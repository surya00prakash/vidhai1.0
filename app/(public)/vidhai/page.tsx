'use client'

import React, { useState, useRef } from 'react'
import { Card, CardHeader, Image, CardBody, Button, Chip } from "@heroui/react"
import { motion } from "framer-motion"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"

// ─── DATA ──────────────────────────────────────────────────────────────────

const orbitItems = [
  { icon: "🎓", title: "Skill Training" },
  { icon: "🤝", title: "Student Sponsorship" },
  { icon: "💼", title: "Placement" },
  { icon: "🚀", title: "Internship" },
  { icon: "👥", title: "Employee Engagement" },
  { icon: "👨‍🏫", title: "Mentoring" },
]

const graduateData = [
  { name: "Yes", value: 5373 },
  { name: "No", value: 1030 },
]

const genderData = [
  { name: "Female", value: 4346 },
  { name: "Male", value: 2057 },
]

const COLORS1 = ["#22c55e", "#cbd5e1"]
const COLORS2 = ["#06b6d4", "#cbd5e1"]

const cardsData = [
  {
    id: 1,
    title: "Our Vision:",
    subtitle:
      "To bring about a significant positive change in the socio-economic status of rural society by offering quality education to deserving individuals.",
    image:
      "https://herald.uohyd.ac.in/wp-content/uploads/2022/09/abc.jpg",
  },
  {
    id: 2,
    title: "Our Mission:",
    subtitle:
      "Strive to bridge the gap between deserving candidates and quality education and  build a generation of responsible youth with commitment to society.",
    image:
      "https://img.studioflicks.com/wp-content/uploads/2024/08/11211044/Agaram-Foundation-45th-Year-Award-Ceremony-HQ-Stills-28.jpg",
  },
  {
    id: 3,
    title: "About Vidhai",
    subtitle:
      "Agaram has been working in education for the past 15+ years. We believe education is the most powerful tool to bridge the socio-economic divide.",
    image:
      "https://th.bing.com/th/id/OIP.k5RXdVEPDvxIeoyX0ik89gHaE7?w=273&h=182&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
]

const years = [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2014, 2016, 2018, 2020, 2022, 2024, 2025]

const milestones: Record<number, { title: string; desc: string }> = {
  2006: { title: "Registered", desc: "Registered as a Non-Profit Organization." },
  2007: { title: "Adopt a School", desc: "Revival & restoration of Govt. School in Palur near Chengalpet." },
  2008: { title: "Learning Centre", desc: "Post-school learning activities for Government school students." },
  2009: { title: "Vazhikattigal", desc: "Supporting school children in remote areas of Tamil Nadu." },
  2010: { title: "Vidhai", desc: "Sponsored 5800+ deserving students for higher education and mentoring." },
  2011: { title: "Vidhai Grows", desc: "Expanding reach to more districts across Tamil Nadu." },
  2012: { title: "Scaling Up", desc: "Increased scholarship support and mentorship programmes." },
  2014: { title: "Milestone", desc: "2000+ students supported through Vidhai programme." },
  2016: { title: "Namadhu Graman", desc: "Rehabilitated 3 villages (141 families)." },
  2018: { title: "Thai Programme", desc: "Industry skills training & mentoring for rural youth." },
  2020: { title: "Covid Relief", desc: "500 smartphones distributed and educational support to 2500+ students." },
  2022: { title: "ANPF", desc: "Pilot fellowship launched in Jawadhu Hills." },
  2024: { title: "EmpowHer", desc: "International Conclave for Women in STEM." },
  2025: { title: "Kalviye Ayutham", desc: "Agaram 15th Year Celebration." },
}

const stats = [
  { value: "95K+", label: "Applications" },
  { value: "6400+", label: "Students Supported" },
  { value: "4500+", label: "Graduates" },
  { value: "15+", label: "Years of Impact" },
]

const parentInfo = [
  { title: "Both Alive", value: "49.87%" },
  { title: "Mother", value: "26.33%" },
  { title: "Father", value: "5.34%" },
  { title: "No Parent", value: "9.65%" },
]

const graduate = [
  { name: "Yes", value: 5373, color: "#94a3b8" },
  { name: "No", value: 1030, color: "#60a5fa" },
]

const gender = [
  { name: "Female", value: 4346, color: "#94a3b8" },
  { name: "Male", value: 2057, color: "#4ade80" },
]

// ─── PIE CHART HELPERS ─────────────────────────────────────────────────────

const circleRadius = 45

const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
  const a = ((angle - 90) * Math.PI) / 180.0
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

const describeArc = (
  x: number, y: number, r: number,
  startAngle: number, endAngle: number
) => {
  const start = polarToCartesian(x, y, r, endAngle)
  const end = polarToCartesian(x, y, r, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y} L ${x} ${y} Z`
}

const buildPieSegments = (data: { name: string; value: number; color: string }[]) => {
  let startAngle = 0
  const total = data.reduce((sum, item) => sum + item.value, 0)
  return data.map((item) => {
    const angle = (item.value / total) * 360
    const segment = { ...item, startAngle, endAngle: startAngle + angle }
    startAngle += angle
    return segment
  })
}

// ─── STATIC PARTICLE POSITIONS (fixes hydration error) ────────────────────

const PARTICLES = [
  { left: "8%",  top: "12%", size: 4 },
  { left: "18%", top: "55%", size: 5 },
  { left: "27%", top: "30%", size: 4 },
  { left: "35%", top: "80%", size: 6 },
  { left: "42%", top: "18%", size: 4 },
  { left: "50%", top: "65%", size: 5 },
  { left: "58%", top: "40%", size: 7 },
  { left: "65%", top: "88%", size: 4 },
  { left: "73%", top: "22%", size: 5 },
  { left: "80%", top: "50%", size: 6 },
  { left: "88%", top: "75%", size: 4 },
  { left: "92%", top: "10%", size: 5 },
  { left: "5%",  top: "72%", size: 6 },
  { left: "14%", top: "92%", size: 4 },
  { left: "55%", top: "5%",  size: 5 },
  { left: "70%", top: "95%", size: 4 },
  { left: "32%", top: "48%", size: 6 },
  { left: "47%", top: "33%", size: 4 },
  { left: "83%", top: "38%", size: 5 },
  { left: "96%", top: "60%", size: 4 },
]

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────

export default function Home() {
  const [activeCard, setActiveCard] = useState("")
  const [cardActive, setCardActive] = useState<number>(1)
  const [activeYear, setActiveYear] = useState<number>(2010)

  const getPosition = (id: number) => {
    if (id === cardActive) return "center"
    if (
      (cardActive === 1 && id === 2) ||
      (cardActive === 2 && id === 3) ||
      (cardActive === 3 && id === 1)
    ) return "right"
    return "left"
  }

  return (
    <>
      {/* ══════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden bg-[#f8f8f8]">
        <img
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600"
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-cyan-600">
            Vidhai Programme
          </h1>
          <p className="mt-10 max-w-4xl text-2xl leading-relaxed text-gray-700">
            To bring about a significant positive change in the socio-economic
            status of rural society by offering quality education to deserving individuals.
          </p>
          <div className="mt-10 flex flex-col gap-4 md:flex-row md:justify-center">
            <Button color="primary" size="lg">Explore Journey</Button>
            <Button variant="bordered" size="lg">Donate</Button>
          </div>
          <div className="mt-16 text-lg text-gray-500">
            www.agaram.in &nbsp;|&nbsp; info@agaram.in &nbsp;|&nbsp; +91 91500 04329
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — CARD CAROUSEL (Vision / Mission / About)
      ══════════════════════════════════════ */}
      <section className="bg-primary-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-5xl font-bold text-center text-primary-600">Vidhai Journey</h2>
          <p className="mt-4 text-center text-xl text-gray-600">2010 – 2025</p>

          <div className="relative mt-16 flex justify-center">
            <div className="relative w-[900px] h-[400px]">
              {cardsData.map((card) => {
                const position = getPosition(card.id)
                return (
                  <Card
                    key={card.id}
                    isPressable
                    onPress={() => setCardActive(card.id)}
                    className={[
                      "absolute w-[300px] h-[350px] transition-all duration-500 cursor-pointer bg-white/80 backdrop-blur-lg rounded-xl overflow-hidden",
                      position === "center" ? "left-1/2 -translate-x-1/2 scale-125 z-50 top-0" : "",
                      position === "left"   ? "left-0 scale-90 opacity-70 z-40 top-6" : "",
                      position === "right"  ? "right-0 scale-90 opacity-70 z-40 top-6" : "",
                    ].join(" ")}
                  >
                    <CardBody className="flex flex-col justify-between p-6 h-full">
                      <div>
                        <h3 className="text-xl font-semibold text-secondary-500">{card.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-gray-700">{card.subtitle}</p>
                      </div>
                      <img
                        className="mt-4 h-36 w-full rounded-xl object-cover"
                        src={card.image}
                        alt={card.title}
                      />
                    </CardBody>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — JOURNEY EXPLORER
      ══════════════════════════════════════ */}
      <section className="py-24 bg-[#f8fafb]">
        <div className="mx-auto max-w-7xl px-8">
          <h2 className="text-6xl font-black text-center">Explore the Journey</h2>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            {/* LEFT — stats */}
            <div>
              <div className="mb-8 inline-flex rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
                15+ YEARS OF IMPACT
              </div>
              <h3 className="text-5xl font-black text-cyan-600">Vidhai Journey</h3>
              <p className="mt-6 text-xl text-gray-600">
                We have received more than 95,000 applications in the past 15+ years
                and Vidhai has supported over 6400 students.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {stats.map((item, index) => (
                  <Card key={index} shadow="lg" className="rounded-[30px] border bg-white/80 backdrop-blur-xl">
                    <CardBody className="p-8 text-center">
                      <h4 className="text-4xl font-black text-cyan-600">{item.value}</h4>
                      <p className="mt-3 text-lg text-gray-700">{item.label}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>

            {/* RIGHT — year explorer */}
            <div>
              <Card shadow="lg" className="rounded-[40px] bg-white/90 backdrop-blur-xl p-10">
                <div className="grid gap-8">
                  <div>
                    <h3 className="text-3xl font-bold">Explore our Journey</h3>
                    <p className="mt-3 text-gray-500">Click any year to discover the impact.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => setActiveYear(year)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                          activeYear === year
                            ? "bg-cyan-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                  <div className="rounded-[30px] border bg-white p-8 shadow-sm">
                    <h4 className="text-5xl font-black text-cyan-600">{activeYear}</h4>
                    <p className="mt-4 text-xl font-semibold text-slate-900">
                      {milestones[activeYear]?.title ?? "No milestone available"}
                    </p>
                    <p className="mt-4 text-gray-600">
                      {milestones[activeYear]?.desc ?? "Tap any year to view the milestone description."}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 — IMPACT NUMBERS
      ══════════════════════════════════════ */}
      <section className="relative py-32">
        <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-cyan-100 blur-[120px]" />
        <div className="absolute right-0 bottom-20 h-80 w-80 rounded-full bg-sky-100 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-8">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="tracking-[4px] text-cyan-600 font-bold">OUR IMPACT</p>
            <h1 className="text-7xl font-black mt-5">Numbers Behind</h1>
            <h1 className="text-7xl font-black text-cyan-600">Every Dream</h1>
            <p className="mt-8 text-xl text-gray-500 max-w-3xl leading-9">
              Every application carries a story. Every scholarship creates a future.
            </p>
          </motion.div>

          {/* KPI cards */}
          <div className="grid lg:grid-cols-4 gap-6 mt-20">
            {[
              ["95K+", "Applications"],
              ["6400+", "Students"],
              ["83%", "First Generation"],
              ["10%", "No parents"],
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <Card shadow="lg" className="rounded-[30px] bg-white/80 backdrop-blur-xl">
                  <CardBody className="p-8 text-center">
                    <h1 className="text-5xl font-black text-cyan-600">{item[0]}</h1>
                    <p className="mt-4 text-lg">{item[1]}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Two column */}
          <div className="grid lg:grid-cols-2 gap-16 mt-24">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -80 }} whileInView={{ opacity: 1, x: 0 }}>
              <Card shadow="lg" className="rounded-[40px]">
                <CardBody className="p-10">
                  <h1 className="text-5xl font-black">15 Years of</h1>
                  <h1 className="text-5xl font-black text-cyan-600">Transformation</h1>
                  <p className="mt-8 text-xl text-gray-500 leading-9">
                    Supporting rural students through quality education.
                    Creating first generation graduates and empowering families across Tamil Nadu.
                  </p>
                  <Button color="primary" className="mt-10">Learn More</Button>
                </CardBody>
              </Card>
            </motion.div>

            {/* Right — progress bars */}
            <motion.div initial={{ opacity: 0, x: 80 }} whileInView={{ opacity: 1, x: 0 }}>
              <Card shadow="lg" className="rounded-[40px]">
                <CardBody className="p-10">
                  <h2 className="text-3xl font-black">Student Background</h2>
                  <div className="mt-10 space-y-8">
                    {[
                      { label: "First Generation", pct: "83%" },
                      { label: "No parents",         pct: "10%" },
                      { label: "Single Parent",    pct: "34%" },
                    ].map((bar) => (
                      <div key={bar.label}>
                        <div className="flex justify-between">
                          <span>{bar.label}</span>
                          <span>{bar.pct}</span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-200 mt-3">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: bar.pct }}
                            transition={{ duration: 1.5 }}
                            className="h-3 rounded-full bg-cyan-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 5 — PIE CHARTS (SVG)
      ══════════════════════════════════════ */}


      {/* ══════════════════════════════════════
          SECTION 6 — SUCCESS STORIES
      ══════════════════════════════════════ */}
      <section className="relative py-32 bg-gradient-to-b from-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="tracking-[4px] font-bold text-cyan-600">SUCCESS STORIES</p>
            <h1 className="text-7xl font-black mt-4">Dreams into</h1>
            <h1 className="text-7xl font-black text-cyan-600">Reality</h1>
            <p className="mt-8 text-xl text-gray-500 max-w-3xl">
              Thousands of students have transformed their dreams into successful careers.
            </p>
          </motion.div>

          {/* Story cards */}
          <div className="grid lg:grid-cols-3 gap-8 mt-20">
            {[
              { name: "Arun",  role: "Software Engineer", text: "Vidhai helped me become the first graduate in my family." },
              { name: "Priya", role: "Doctor",            text: "Education changed my life and my community." },
              { name: "Rahul", role: "Civil Engineer",    text: "Support and mentorship gave me confidence." },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <Card shadow="lg" className="rounded-[35px]">
                  <CardBody className="p-8">
                    <div className="w-20 h-20 rounded-full bg-cyan-100 flex items-center justify-center text-3xl">
                      🎓
                    </div>
                    <h2 className="mt-6 text-3xl font-bold">{item.name}</h2>
                    <p className="text-cyan-600">{item.role}</p>
                    <p className="mt-8 text-lg leading-8 text-gray-500">"{item.text}"</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Stats banner */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-24">
            <Card shadow="lg" className="rounded-[40px] bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
              <CardBody className="p-12">
                <div className="grid lg:grid-cols-4 gap-8 text-center">
                  {[
                    ["4500+", "Graduates"],
                    ["1700+", "Current Students"],
                    ["83%",   "First Generation"],
                    ["15+",   "Years Impact"],
                  ].map(([num, label], i) => (
                    <div key={i}>
                      <h1 className="text-6xl font-black">{num}</h1>
                      <p className="mt-3">{label}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* CTA */}
          <div className="mt-32 text-center">
            <motion.h1 initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} className="text-7xl font-black">
              Continue the
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-7xl font-black text-cyan-600"
            >
              Journey
            </motion.h1>
            <p className="mt-8 text-xl text-gray-500 max-w-2xl mx-auto">
              Together, we can empower the next generation of rural students.
            </p>
            <div className="flex justify-center gap-6 mt-12">
              <Button color="primary" size="lg">Donate Now</Button>
              <Button variant="bordered" size="lg">Explore More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 7 — STUDENT PROFILE
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-slate-50">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-100 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-green-100 blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <Chip color="primary" variant="flat">VIDHAI PROJECT IMPACT</Chip>
            <h1 className="mt-8 text-6xl lg:text-8xl font-black">Empowering</h1>
            <h1 className="text-6xl lg:text-8xl font-black text-cyan-600">Students</h1>
            <h2 className="mt-4 text-4xl lg:text-5xl font-bold">Transforming Lives.</h2>
            <h2 className="text-4xl lg:text-5xl font-bold">Building Futures.</h2>
            <p className="mt-8 max-w-2xl text-xl text-slate-500 leading-9">
              For more than fifteen years, the Vidhai Programme has empowered deserving
              rural students through quality education and opportunity.
            </p>
            <div className="mt-10 flex gap-4">
              <Button color="primary" size="lg">Explore</Button>
              <Button variant="bordered" size="lg">Donate</Button>
            </div>
          </motion.div>

          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {stats.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
              >
                <Card shadow="lg" className="rounded-[28px] bg-white/80 backdrop-blur-xl">
                  <CardBody className="p-8 text-center">
                    <h1 className="text-5xl font-black text-cyan-600">{item.value}</h1>
                    <p className="mt-4 text-lg">{item.label}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Donut preview */}
          
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 8 — STUDENT PROFILE DETAILS
      ══════════════════════════════════════ */}
      <section className="relative py-24 bg-slate-50 overflow-hidden">
        <div className="absolute -left-32 top-0 w-96 h-96 rounded-full bg-cyan-100 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 w-96 h-96 rounded-full bg-green-100 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
            <h1 className="text-6xl font-black">Student</h1>
            <h1 className="text-6xl font-black text-cyan-600">Profile</h1>
            <p className="mt-6 text-xl text-slate-500">Understanding the background of Vidhai students.</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 mt-20">
            {/* Parent status donut */}
            <Card shadow="lg" className="rounded-[40px]">
              <CardBody className="p-10">
                <h2 className="text-3xl font-bold">Parent Status</h2>
                <div className="mt-12 flex justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                    className="relative w-72 h-72"
                  >
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "conic-gradient(#0ea5e9 0 50%, #84cc16 50% 76%, #f59e0b 76% 90%, #ef4444 90% 100%)",
                      }}
                    />
                    <div className="absolute inset-[50px] rounded-full bg-white flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-5xl font-black text-cyan-600">49%</h1>
                        <p>Both Alive</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-10">
                  {parentInfo.map((item) => (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      key={item.title}
                      className="rounded-xl border p-4"
                    >
                      <p className="text-slate-500">{item.title}</p>
                      <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
                    </motion.div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Academic insights */}
            <Card shadow="lg" className="rounded-[40px] bg-white/80 backdrop-blur-xl">
              <CardBody className="p-10">
                <h2 className="text-3xl font-bold">Academic Insights</h2>
                <p className="mt-3 text-slate-500">School Type & Stream Wise Distribution</p>

                {/* School type bars */}
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-8">School Type</h3>
                  {[
                    { name: "Government", count: 4512, width: "85%" },
                    { name: "Govt Aided", count: 1382, width: "45%" },
                    { name: "Private",    count: 509,  width: "20%" },
                  ].map((item) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="mb-8"
                    >
                      <div className="flex justify-between">
                        <span>{item.name}</span>
                        <span>{item.count}</span>
                      </div>
                      <div className="mt-3 relative h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: item.width }}
                          transition={{ duration: 1.5 }}
                          className="absolute top-0 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-green-500"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Stream bars */}
                <div className="mt-14">
                  <h3 className="text-xl font-bold mb-8">Stream Wise</h3>
                  {[
                    ["Engineering", 2067, "90%"],
                    ["Arts",        1773, "78%"],
                    ["Science",     1266, "60%"],
                    ["Diploma",     622,  "35%"],
                    ["Medical",     471,  "25%"],
                  ].map((item) => (
                    <motion.div key={item[0] as string} whileHover={{ scale: 1.02 }} className="mb-8">
                      <div className="flex justify-between">
                        <span>{item[0]}</span>
                        <span>{item[1]}</span>
                      </div>
                      <div className="mt-3 relative h-3 rounded-full bg-slate-200 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: item[2] as string }}
                          transition={{ duration: 1.5 }}
                          className="absolute top-0 h-3 rounded-full bg-gradient-to-r from-green-500 to-cyan-500"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Recharts pie row */}
          <div className="grid grid-cols-2 gap-5 h-[240px] mt-12">
            <div className="rounded-3xl bg-white shadow p-4">
              <h2 className="text-center font-bold mb-2">First Graduate</h2>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie data={graduateData} cx="50%" cy="50%" outerRadius={50} dataKey="value" label>
                    {graduateData.map((_, index) => (
                      <Cell key={index} fill={COLORS1[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-3xl bg-white shadow p-4">
              <h2 className="text-center font-bold mb-2">Gender</h2>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" innerRadius={25} outerRadius={50} dataKey="value" label>
                    {genderData.map((_, index) => (
                      <Cell key={index} fill={COLORS2[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 9 — ORBIT / EMPOWER FUTURES
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#f8fafb] py-24">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-cyan-100 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-green-100 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-7xl font-black">Together, We</h1>
            <h1 className="text-7xl font-black text-cyan-600">Empower Futures</h1>
            <p className="mt-8 text-xl text-slate-500 max-w-3xl mx-auto">
              Supporting students through education, mentorship and opportunity.
            </p>
          </div>

          {/* Static particles — no Math.random() */}
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -30, 0], x: [0, 15, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 4 + (i % 6), repeat: Infinity, ease: "easeInOut" }}
              className="absolute rounded-full bg-cyan-400 pointer-events-none"
              style={{ width: p.size, height: p.size, left: p.left, top: p.top }}
            />
          ))}

          <div className="relative h-[900px] mt-20">
            {/* Background glow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-[500px] w-[500px] rounded-full bg-cyan-100 opacity-30 blur-[120px]" />
            </div>

            {/* Rotating orbit ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-cyan-200/30" />
            </motion.div>

            {/* Center images triangle */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-cyan-200"
              />
              <div className="relative w-[420px] h-[350px]">
                {[
                  { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300", pos: "absolute left-1/2 -translate-x-1/2 top-0" },
                  { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300", pos: "absolute left-0 bottom-0" },
                  { src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=300", pos: "absolute right-0 bottom-0" },
                ].map((img, i) => (
                  <img
                    key={i}
                    src={img.src}
                    alt=""
                    className={`${img.pos} w-48 h-60 object-cover rounded-[30px] shadow-2xl`}
                  />
                ))}
              </div>
            </div>

            {/* SVG connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {[
                ["50%","12%","50%","38%"],
                ["18%","30%","40%","45%"],
                ["82%","30%","60%","45%"],
                ["18%","70%","40%","55%"],
                ["82%","70%","60%","55%"],
                ["50%","88%","50%","62%"],
              ].map(([x1,y1,x2,y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#06b6d4" strokeWidth="2" opacity=".25" />
              ))}
            </svg>

            {/* Orbit cards */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
              className="absolute inset-0"
            >
              {[
                { icon: "🎓", title: "Skill Training",    pos: "absolute left-1/2 top-0 -translate-x-1/2",      key: "skill",     size: "w-44 h-44" },
                { icon: "🤝", title: "Sponsorship",       pos: "absolute left-[120px] top-[180px]",              key: "sponsor",   size: "w-40 h-40" },
                { icon: "💼", title: "Placement",         pos: "absolute right-[120px] top-[180px]",             key: "placement", size: "w-40 h-40" },
                { icon: "👥", title: "Employee Engage",   pos: "absolute left-[120px] bottom-[180px]",           key: "employee",  size: "w-40 h-40" },
                { icon: "🚀", title: "Internship",        pos: "absolute right-[120px] bottom-[180px]",          key: "intern",    size: "w-40 h-40" },
                { icon: "👨‍🏫", title: "Mentoring",       pos: "absolute left-1/2 bottom-0 -translate-x-1/2",   key: "mentor",    size: "w-44 h-44" },
              ].map((item) => (
                <div key={item.key} className={item.pos}>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
                  >
                    <div className="rotate-45">
                      <Card
                        onMouseEnter={() => setActiveCard(item.key)}
                        onMouseLeave={() => setActiveCard("")}
                        className={`${item.size} shadow-xl hover:shadow-cyan-400/50 transition-all duration-500`}
                      >
                        <CardBody className="-rotate-45 flex flex-col items-center justify-center text-center">
                          <div className="text-5xl">{item.icon}</div>
                          <h3 className="font-bold mt-2 text-sm">{item.title}</h3>
                        </CardBody>
                      </Card>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>

            {/* Floating blobs */}
            <motion.div
              animate={{ y: [0, -25, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
              className="absolute left-20 top-32 h-32 w-32 rounded-full bg-cyan-200 blur-3xl pointer-events-none"
            />
            <motion.div
              animate={{ y: [0, 25, 0] }}
              transition={{ repeat: Infinity, duration: 7 }}
              className="absolute right-20 bottom-32 h-32 w-32 rounded-full bg-green-200 blur-3xl pointer-events-none"
            />
          </div>
        </div>
      </section>
    </>
  )
}