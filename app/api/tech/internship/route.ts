// app/api/tech/internship/route.ts
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { Readable } from "stream"

const MAX_FILE_BYTES = 8 * 1024 * 1024 // 8 MB
const ALLOWED_MIMETYPES = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

function jsonError(msg: string, status = 400) {
    return NextResponse.json({ error: msg }, { status })
}

// helper: convert Web Stream (File.stream()) to Node Readable
function webStreamToNodeReadable(webStream: ReadableStream) {
    return Readable.from(webStream as any)
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData()

        // fields
        const fullnameRaw = formData.get("fullname") ?? formData.get("name")
        const fullname = typeof fullnameRaw === "string" ? fullnameRaw.trim() : (fullnameRaw?.toString() ?? "").trim()

        const emailRaw = formData.get("email")
        const email = typeof emailRaw === "string" ? emailRaw.trim() : (emailRaw?.toString() ?? "").trim()

        const mobileRaw = formData.get("mobile")
        const mobile = typeof mobileRaw === "string" ? mobileRaw.trim() : (mobileRaw?.toString() ?? "").trim()

        const year = (formData.get("year") as string | null)?.toString()?.trim() ?? ""
        const degree = (formData.get("degree") as string | null)?.toString()?.trim() ?? ""
        const motivation = (formData.get("motivation") as string | null)?.toString()?.trim() ?? ""

        if (!fullname) return jsonError("Full name is required", 400)
        if (!email) return jsonError("Email is required", 400)
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonError("Invalid email", 400)
        if (!mobile) return jsonError("Mobile is required", 400)

        // dynamic import of mongoose connect helper
        let connectDB: (() => Promise<any>) | null = null
        try {
            const mod: any = await import("@/lib/mongoose")
            connectDB = mod.connectDB ?? mod.default ?? null
        } catch (impErr) {
            return NextResponse.json({ error: "Server error (import connectDB failed)" }, { status: 500 })
        }

        if (!connectDB) {
            return NextResponse.json({ error: "Server misconfiguration (connectDB missing)" }, { status: 500 })
        }

        // ensure DB connection
        try {
            await connectDB()
        } catch (connErr) {
            return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
        }

        // Now get mongoose (so we can use connection.db for GridFSBucket)
        const mongooseMod: any = await import("mongoose")
        const mongoose = mongooseMod.default ?? mongooseMod
        const db = mongoose.connection.db
        if (!db) {
            return NextResponse.json({ error: "Database not ready" }, { status: 500 })
        }

        // Create GridFSBucket
        const { GridFSBucket } = await import("mongodb") // GridFSBucket type from native driver
        const bucket = new GridFSBucket(db, { bucketName: "resumes" })

        const candidateData: any = { fullname, email, mobile, year, degree, motivation }

        // If resume file present: stream to GridFS
        const resumeField = formData.get("resume")
        if (resumeField && resumeField instanceof File) {
            const file: File = resumeField as File
            const contentType = file.type || "application/octet-stream"
            if (!ALLOWED_MIMETYPES.has(contentType)) {
                return jsonError("Unsupported file type. Use PDF/DOC/DOCX", 400)
            }

            // size check (some platforms supply .size)
            const size = (file as any).size ?? 0
            if (typeof size === "number" && size > MAX_FILE_BYTES) {
                return jsonError(`File too large. Max ${MAX_FILE_BYTES / (1024 * 1024)} MB`, 400)
            }

            // Get readable Node stream
            const nodeStream = webStreamToNodeReadable(file.stream())

            // choose filename
            const filename = `${Date.now()}-${file.name}`

            // open upload stream - returns writable stream
            const uploadStream = bucket.openUploadStream(filename, {
                metadata: { contentType, uploadedBy: "tech-internship-form", originalName: file.name },
            })

            // pipe readable -> upload
            await new Promise<void>((resolve, reject) => {
                nodeStream.pipe(uploadStream)
                uploadStream.on("finish", () => resolve())
                uploadStream.on("error", (err: any) => reject(err))
            })

            // the file entry info is in uploadStream.id after finish
            const fileId = uploadStream.id as ObjectId
            // get file length & filename saved (GridFS tracks it)
            // note: uploadStream.length is NOT available; instead we'll query the files collection
            const filesColl = db.collection("resumes.files")
            const savedFileDoc = await filesColl.findOne({ _id: fileId })
            candidateData.resume = {
                id: fileId.toHexString(),
                filename: savedFileDoc?.filename ?? filename,
                contentType,
                length: savedFileDoc?.length ?? size,
            }
        }

        // Save candidate using your Mongoose model
        // dynamic import of your model to avoid ts compile issues
        let CandidateModel: any = null
        try {
            const mod: any = await import("@/models/TechIntership")
            CandidateModel = mod.default ?? mod
        } catch (mErr) {
            return NextResponse.json({ error: "Server error (model import failed)" }, { status: 500 })
        }

        try {
            const doc = await CandidateModel.create(candidateData)
            return NextResponse.json({ ok: true, id: doc._id, resume: candidateData.resume ?? null }, { status: 201 })
        } catch (dbErr) {
            // If DB save failed, we might want to clean up the GridFS file we just wrote.
            // If resume was saved and its id exists, attempt delete to avoid orphan files.
            try {
                if (candidateData.resume?.id) {
                    const fid = new ObjectId(candidateData.resume.id)
                    await bucket.delete(fid)
                }
            } catch (cleanupErr) {
            }

            // Return error details (avoid leaking sensitive internals)
            return NextResponse.json({ error: "Database save failed", detail: (dbErr as any)?.message ?? String(dbErr) }, { status: 500 })
        }
    } catch (err) {
        return NextResponse.json({ error: "Server error", detail: (err as any)?.message ?? String(err) }, { status: 500 })
    }
}
