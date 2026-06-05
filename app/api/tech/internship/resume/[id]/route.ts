// app/api/tech/internship/resume/[id]/route.ts
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import stream from "stream"

export async function GET(req: Request, context: any) {
    try {
        const params = context?.params ?? {}
        const id = params?.id
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

        // connect DB (reuse your existing helper)
        const mod: any = await import("@/lib/mongoose")
        const connectDB = mod.connectDB ?? mod.default ?? null
        if (!connectDB) return NextResponse.json({ error: "Server config error" }, { status: 500 })
        await connectDB()

        const mongooseMod: any = await import("mongoose")
        const mongoose = mongooseMod.default ?? mongooseMod
        const db = (mongoose.connection && (mongoose.connection as any).db) ?? null
        if (!db) return NextResponse.json({ error: "DB not available" }, { status: 500 })

        const { GridFSBucket } = await import("mongodb")
        const bucket = new GridFSBucket(db, { bucketName: "resumes" })

        const _id = new ObjectId(id)
        const filesColl = db.collection("resumes.files")
        const meta = await filesColl.findOne({ _id })
        if (!meta) return NextResponse.json({ error: "File not found" }, { status: 404 })

        // open Node Readable stream from GridFS
        const downloadStream = bucket.openDownloadStream(_id)

        // convert Node Readable -> Web ReadableStream
        const webStream = stream.Readable.toWeb(downloadStream)

        const headers = new Headers()
        headers.set("Content-Type", meta.metadata?.contentType || meta.contentType || "application/octet-stream")
        // suggest filename for browser download
        headers.set("Content-Disposition", `attachment; filename="${meta.filename}"`)

        return new Response(webStream as any, { status: 200, headers })
    } catch (err) {
        return NextResponse.json({ error: "Server error", detail: (err as any)?.message ?? String(err) }, { status: 500 })
    }
}
