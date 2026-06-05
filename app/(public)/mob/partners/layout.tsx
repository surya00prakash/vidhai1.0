"use client"
import { Button } from '@heroui/react'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import { LuArrowRight } from 'react-icons/lu'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-center min-h-[320px] sm:min-h-[420px] lg:min-h-[520px] flex items-center justify-center px-4 sm:px-8"
        style={{ backgroundImage: "url('/assets/images/partners/partner_banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 z-0" />
        <div className="relative z-10 max-w-3xl w-full text-center text-white space-y-6 py-10 sm:py-16">
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold">
            Our Trusted Partners
          </h1>
          <p className="text-white text-base sm:text-lg lg:text-xl">
            We work with organizations that care about real impact. Through strong partnerships, we bring innovation, education, and empowerment to the people who need it most.
          </p>
          {/*         <Button
            as={Link}
            size="lg"
            href='/contact'
            color="primary"
            className="rounded-full text-base sm:text-lg px-6 py-4 text-white"
            endContent={<LuArrowRight className="w-5 h-5" />}
          >
            Become a Partner
          </Button> */}
        </div>
      </section>

      {/* Description */}
      <section className="bg-[#eaeaea] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h2 className="text-secondary text-2xl sm:text-3xl font-semibold">
            Creating Value Through Collaboration
          </h2>
          <p className="text-secondary-light text-base sm:text-lg">
            Our partnerships include businesses, schools, and social groups. Together, we share resources, skills, and ideas to build better outcomes. Whether you offer support, services, or experience, we welcome collaboration that moves communities forward.
          </p>
        </div>
      </section>
      <div>{children}</div>
    </div>
  )
}

export default Layout