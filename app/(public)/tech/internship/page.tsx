"use client"

import React, { useRef, useState } from "react"
import { Card, CardBody, Button } from "@heroui/react"
import {
    User,
    Mail,
    Phone,
    Paperclip,
    CheckCircle2,
    XCircle,
    GraduationCap,
    FileText,
    Trash2,
    CloudUpload,
} from "lucide-react"

type FormState = {
    fullname: string
    email: string
    mobile: string
    year: string
    degree: string
    motivation: string
}

const DEGREE_OPTIONS = {
    undergraduate: [
        "B.E. Computer Science and Engineering",
        "B.E. Information Technology",
        "B.Tech Computer Science and Engineering",
        "B.Tech Information Technology",
        "B.Tech Artificial Intelligence and Data Science",
        "B.Tech Software Engineering",
        "B.Sc Computer Science",
        "B.Sc Information Technology",
        "B.C.A.",
    ],
    postgraduate: [
        "M.E. Computer Science and Engineering",
        "M.Tech Computer Science and Engineering",
        "M.Sc Computer Science",
        "M.C.A.",
    ],
}

export default function AgaramTechInternshipForm() {
    const [form, setForm] = useState<FormState>({
        fullname: "",
        email: "",
        mobile: "",
        year: "",
        degree: "",
        motivation: "",
    })
    const [resume, setResume] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [dragActive, setDragActive] = useState(false)

    // New: success view state and server-returned metadata
    const [showSuccess, setShowSuccess] = useState(false)
    const [submittedId, setSubmittedId] = useState<string | null>(null)
    const [submittedUrl, setSubmittedUrl] = useState<string | null>(null)

    const validate = () => {
        const e: Record<string, string> = {}
        if (!form.fullname.trim()) e.fullname = "Full name is required"
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email"
        if (!/^[+\d][\d\s\-]{6,20}$/.test(form.mobile)) e.mobile = "Please enter a valid mobile"
        if (!form.year.trim()) e.year = "Year is required"
        if (!form.degree.trim()) e.degree = "Select your degree"
        if (!form.motivation.trim()) e.motivation = "Brief motivation is required"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: "" }))
        setMsg(null)
    }

    const handleFileSelect = (file: File | null) => {
        if (!file) {
            setResume(null)
            return
        }
        const allowed = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]
        const maxBytes = 8 * 1024 * 1024
        if (!allowed.includes(file.type)) {
            setMsg({ type: "error", text: "Unsupported file type. Use PDF / DOC / DOCX." })
            return
        }
        if (file.size > maxBytes) {
            setMsg({ type: "error", text: `File too large — max ${maxBytes / (1024 * 1024)} MB.` })
            return
        }
        setResume(file)
        setMsg(null)
    }

    const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        handleFileSelect(file)
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(true)
    }
    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(false)
    }
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(false)
        const file = e.dataTransfer.files?.[0] ?? null
        handleFileSelect(file)
    }

    const removeResume = () => {
        setResume(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
        setMsg(null)
    }

    const resetFormState = () => {
        setForm({ fullname: "", email: "", mobile: "", year: "", degree: "", motivation: "" })
        setResume(null)
        setErrors({})
        setMsg(null)
        setSubmittedId(null)
        setSubmittedUrl(null)
        setShowSuccess(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMsg(null)
        if (!validate()) return

        setLoading(true)
        try {
            const fd = new FormData()
            Object.entries(form).forEach(([k, v]) => fd.append(k, v))
            if (resume) fd.append("resume", resume)

            const res = await fetch("/api/tech/internship", { method: "POST", body: fd })
            let payload: any = {}
            try {
                payload = await res.json()
            } catch {
                // ignore
            }

            if (!res.ok) {
                const serverMsg = payload?.error || payload?.detail || `Server responded ${res.status}`
                throw new Error(serverMsg)
            }

            // show success panel and save returned info (if any)
            setMsg({ type: "success", text: "Application submitted successfully." })
            setSubmittedId(payload?.id ?? null)
            setSubmittedUrl(payload?.url ?? null)
            setShowSuccess(true)
        } catch (err: any) {
            setMsg({ type: "error", text: err?.message ?? "Upload failed" })
        } finally {
            setLoading(false)
        }
    }

    // render success panel (replaces the form)
    if (showSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="max-w-3xl mx-auto">
                    <Card className="text-center">
                        <CardBody className="p-8">
                            <div className="flex flex-col items-center gap-4">
                                <div className="rounded-full bg-green-50 p-4">
                                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                                </div>

                                <h2 className="text-2xl font-semibold">Application submitted</h2>
                                <p className="text-sm text-gray-600">
                                    Thank you - your application has been received. We’ll review it and contact shortlisted candidates.
                                </p>

                                {submittedId && (
                                    <p className="text-xs text-gray-500">Reference ID: <span className="font-medium">{submittedId}</span></p>
                                )}

                                {submittedUrl && (
                                    <a
                                        href={submittedUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm underline text-indigo-600"
                                    >
                                        View uploaded resume
                                    </a>
                                )}

                                <div className="flex items-center gap-3 mt-6">
                                    <Button onClick={resetFormState}>
                                        Submit another response
                                    </Button>

                                    <Button as="a" href="/" variant="ghost">
                                        Back to home
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        )
    }

    // default: render the form
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <Card className="overflow-hidden">
                    <div className="md:flex">
                        {/* Left hero panel */}
                        <div className="hidden md:flex md:w-1/3 flex-col justify-between px-8 py-10 bg-gradient-to-b from-primary-700 to-primary-600 text-white">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="rounded-full bg-white/20 p-2">
                                        <GraduationCap className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">Agaram Tech Internship</h2>
                                    </div>
                                </div>

                                <ul className="text-sm space-y-3 opacity-90">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span>Hands-on learning with real projects</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span>Exposure to the latest tools & technologies</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span>A chance to build your career in tech</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span>Hybrid learning model (online + in-person)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span>Internship Certificate</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="text-xs mt-6">
                                <div>
                                    For More Details <span className="font-medium"> Please Contact Your Batch Partner</span>
                                </div>
                            </div>
                        </div>

                        {/* Form body */}
                        <CardBody className="w-full md:w-2/3 p-6 md:p-8">
                            <form onSubmit={handleSubmit} onDragOver={onDragOver} onDrop={onDrop} noValidate>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-2xl font-semibold">Apply Agaram Tech Internship</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            <b>We are looking for</b> 2nd year, 3rd year, and final year <b>Agaram students</b> pursuing Computer Science / IT degree.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full name</label>
                                        <div className="relative mt-1">
                                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                id="fullname"
                                                name="fullname"
                                                value={form.fullname}
                                                onChange={handleChange}
                                                placeholder="Your Name"
                                                className={`pl-10 w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-primary-200 ${errors.fullname ? "border-red-300" : "border-gray-200"}`}
                                                aria-invalid={!!errors.fullname}
                                            />
                                        </div>
                                        {errors.fullname && <p className="mt-1 text-xs text-red-600">{errors.fullname}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                        <div className="relative mt-1">
                                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="your.name@example.com"
                                                className={`pl-10 w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-primary-200 ${errors.email ? "border-red-300" : "border-gray-200"}`}
                                                aria-invalid={!!errors.email}
                                            />
                                        </div>
                                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</label>
                                        <div className="relative mt-1">
                                            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                id="mobile"
                                                name="mobile"
                                                value={form.mobile}
                                                onChange={handleChange}
                                                placeholder="+91 98xxxxxxx"
                                                className={`pl-10 w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-primary-200 ${errors.mobile ? "border-red-300" : "border-gray-200"}`}
                                                aria-invalid={!!errors.mobile}
                                            />
                                        </div>
                                        {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                                        <input
                                            id="year"
                                            name="year"
                                            value={form.year}
                                            onChange={handleChange}
                                            placeholder="e.g., 2025"
                                            className={`mt-1 w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-primary-200 ${errors.year ? "border-red-300" : "border-gray-200"}`}
                                            aria-invalid={!!errors.year}
                                        />
                                        {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="degree" className="block text-sm font-medium text-gray-700">Degree</label>
                                        <select
                                            id="degree"
                                            name="degree"
                                            value={form.degree}
                                            onChange={handleChange}
                                            className={`mt-1 w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-primary-200 ${errors.degree ? "border-red-300" : "border-gray-200"}`}
                                            aria-invalid={!!errors.degree}
                                        >
                                            <option value="">Select degree</option>
                                            <optgroup label="Undergraduate">
                                                {DEGREE_OPTIONS.undergraduate.map(d => <option key={d} value={d}>{d}</option>)}
                                            </optgroup>
                                            <optgroup label="Postgraduate">
                                                {DEGREE_OPTIONS.postgraduate.map(d => <option key={d} value={d}>{d}</option>)}
                                            </optgroup>
                                        </select>
                                        {errors.degree && <p className="mt-1 text-xs text-red-600">{errors.degree}</p>}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Resume</label>

                                        <div
                                            onDragOver={onDragOver}
                                            onDragLeave={onDragLeave}
                                            onDrop={onDrop}
                                            className={`mt-2 flex items-center justify-between gap-4 rounded-md p-4 transition-shadow ${dragActive ? "border-primary-400 shadow" : "border-dashed border-gray-200"}`}
                                            style={{ borderWidth: 1, borderStyle: dragActive ? "solid" : "dashed" }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-md bg-primary-50 flex items-center justify-center text-primary-600">
                                                    <CloudUpload className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">Drag & drop your resume or</div>
                                                    <div className="text-xs text-gray-500">PDF, DOC, DOCX — max 8 MB</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <label className="inline-flex items-center gap-2 cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50">
                                                    <Paperclip className="h-4 w-4 text-gray-600" />
                                                    <span>Choose file</span>
                                                    <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={onFileInput} className="sr-only" />
                                                </label>

                                                {resume ? (
                                                    <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-md">
                                                        <FileText className="h-5 w-5 text-gray-600" />
                                                        <div className="truncate max-w-[14rem]">
                                                            <div className="text-sm font-medium">{resume.name}</div>
                                                            <div className="text-xs text-gray-400">{Math.round(resume.size / 1024)} KB</div>
                                                        </div>
                                                        <button type="button" onClick={removeResume} aria-label="Remove file" className="ml-3 text-red-500 hover:bg-red-50 p-1 rounded">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        {msg && msg.type === "error" && <p className="mt-2 text-xs text-red-600">{msg.text}</p>}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label htmlFor="motivation" className="block text-sm font-medium text-gray-700">Why do you want to join this internship?</label>
                                    <textarea
                                        id="motivation"
                                        name="motivation"
                                        value={form.motivation}
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="Shortly tell us about your interests & what you hope to learn."
                                        className={`mt-2 w-full rounded-md border p-3 text-sm focus:ring-2 focus:ring-primary-200 ${errors.motivation ? "border-red-300" : "border-gray-200"}`}
                                        aria-invalid={!!errors.motivation}
                                    />
                                    {errors.motivation && <p className="mt-1 text-xs text-red-600">{errors.motivation}</p>}
                                </div>

                                <div className="mt-6 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Button type="submit" className="px-5 py-2">
                                            {loading ? "Submitting..." : "Submit Application"}
                                        </Button>

                                        <Button type="button" onClick={() => { setForm({ fullname: "", email: "", mobile: "", year: "", degree: "", motivation: "" }); setResume(null); setErrors({}); setMsg(null); }}>
                                            Reset
                                        </Button>
                                    </div>

                                    <div aria-live="polite">
                                        {msg?.type === "success" && (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <CheckCircle2 className="h-5 w-5" />
                                                <span className="text-sm">{msg.text}</span>
                                            </div>
                                        )}
                                        {msg?.type === "error" && (
                                            <div className="flex items-center gap-2 text-red-600">
                                                <XCircle className="h-5 w-5" />
                                                <span className="text-sm">{msg.text}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="mt-4 text-xs text-gray-400">
                                    By submitting you agree to Agaram’s <a className="underline text-primary-600" href="/privacy_policy">privacy policy</a>.
                                </p>
                            </form>
                        </CardBody>
                    </div>
                </Card>
            </div>
        </div>
    )
}
