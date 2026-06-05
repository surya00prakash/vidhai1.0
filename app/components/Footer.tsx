import { Chip, Link } from "@heroui/react";
import { Image } from "@heroui/react";
import { FaEnvelope, FaInstagram, FaLinkedinIn, FaPhone, FaSquareFacebook, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { LuMapPin } from "react-icons/lu";

const Footer = () => {
  return (
    <footer className="hidden sm:block footer bg-[#101010] text-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-10 pb-5">
        {/* Responsive grid for columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <Image
              src="/assets/images/logo/agaram_logo.webp"
              alt="Agaram Foundation"
              className="rounded-sm mb-4 w-28"
            />
            <p className="text-sm text-gray-400 leading-relaxed">
              To bring about a significant positive change in the socio-economic status of the rural society by offering quality education to the deserving individual.
            </p>
            <Link> <div style={{ fontFamily: '"Caveat", cursive' }} className='text-primary text-5xl my-4'>
              #change<span className='text-white'>a</span>life
            </div></Link>
            <div className="flex space-x-4">
              <Image src="/assets/images/logo/ssl.webp" alt="SSL" className="rounded-sm w-30" />
              <a href="https://razorpay.com/" target="_blank" rel="noopener noreferrer">
                <Image src="/assets/images/logo/secured_payments.webp" alt="Razorpay" className="rounded-sm w-30" />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h6 className="text-lg font-semibold mb-3">Quick Links</h6>
            <ul className="flex flex-col space-y-2 text-gray-400">
              <Link href="/" className="text-gray-400 hover:text-gray-200">Home</Link>
              <Link href="/our_mission" className="text-gray-400 hover:text-gray-200">Our Mission</Link>
              <Link href="/our_journey" className="text-gray-400 hover:text-gray-200">Our Journey</Link>
              <Link href="/financials" className="text-gray-400 hover:text-gray-200">Financials</Link>
              <Link href="/partners" className="text-gray-400 hover:text-gray-200">Partners</Link>
            </ul>
            <h6 className="mt-6 text-lg font-semibold">Our Websites</h6>
            <div className="flex space-x-4 mt-4">
              <Image src="/assets/images/logo/agaram_foundation_org.webp" alt="agaramfoundation.org" className="rounded-sm w-30" />
              <Image src="/assets/images/logo/agaram_alumni_association.webp" alt="alumni.agaram.in" className="rounded-sm w-30" />
            </div>
          </div>

          {/* Column 3 */}
          <div>
            <h6 className="text-lg font-semibold mb-3">Important Links</h6>
            <ul className="flex flex-col space-y-2 text-gray-400">
              <Link href="/privacy_policy" className="text-gray-400 hover:text-gray-200">Privacy Policy</Link>
              <Link href="/terms_and_conditions" className="text-gray-400 hover:text-gray-200">Terms & Conditions</Link>
              <Link href="/privacy_policy" className="text-gray-400 hover:text-gray-200">Refund Policy</Link>
            </ul>
            <h6 className="mt-6 font-semibold text-lg">Office Address:</h6>
            <p className="text-sm text-gray-400 leading-relaxed my-2">
              15/4, Arulambal Street, T.Nagar, <br />
              Chennai - 600 017<br />
              Tamil Nadu, India.<br />
            </p>

            <Chip
              color="primary"
              variant="flat"
              className="flex items-center justify-center px-3 py-1 cursor-pointer transition hover:scale-105 hover:shadow-md"
            >
              <Link
                href="https://maps.app.goo.gl/QjX1KLW1x7J9vxoK7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white"
              >
                <LuMapPin className="w-4 h-4" />
                <span className="text-xs font-medium leading-none">
                  View Location in Map
                </span>
              </Link>
            </Chip>


          </div>

          {/* Column 4 */}
          <div>
            <h6 className="text-lg font-semibold mb-3">Download Our App</h6>
            <a href="https://play.google.com/store/apps/details?id=com.agaramfoundation.app&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
              <Image src="/assets/images/logo/playstore.webp" alt="Playstore" className="rounded-sm w-35" />
            </a>

            <h6 className="mt-6 text-lg font-semibold mb-3" >Support</h6>
            <ul className="space-y-2 text-gray-400">
              <Link href="mailto:info@agaram.in" className="flex items-center text-gray-400 hover:text-gray-200">
                <FaEnvelope className="text-lg mr-2" /> info@agaram.in
              </Link>
              <Link href="tel:9841891000" className="flex items-center text-gray-400 hover:text-gray-200" target="_blank">
                <FaPhone className="text-lg mr-2" /> +91 98418 91000
              </Link>
              <Link href="tel:04443506361" className="flex items-center text-gray-400 hover:text-gray-200" target="_blank">
                <FaPhone className="text-lg mr-2" /> 044-43506361
              </Link>
              <Link href="https://wa.me/919841891000" className="flex items-center text-gray-400 hover:text-gray-200" target="_blank">
                <FaWhatsapp className="text-lg mr-2" /> +91 98418 91000
              </Link>

            </ul>

            <div className="flex space-x-4 mt-6 text-2xl ">
              <Link href="https://www.facebook.com/agaramfoundation" className="text-gray-400 hover:text-gray-200" target="_blank"><FaSquareFacebook /></Link>
              <Link href="https://www.instagram.com/agaram_foundation_official?igsh=ZDc2eHJ3dThkNmxq" className="text-gray-400 hover:text-gray-200" target="_blank"><FaInstagram /></Link>
              <Link href="https://x.com/agaramvision?t=2QUd1JKQWJ-bHdFAO8HZeg&s=09" className="text-gray-400 hover:text-gray-200" target="_blank"><FaXTwitter /></Link>
              <Link href="https://www.linkedin.com/company/agaram-foundation/" className="text-gray-400 hover:text-gray-200" target="_blank"><FaLinkedinIn /></Link>
              <Link href="https://wa.me/919841891000" className="text-gray-400 hover:text-gray-200" target="_blank"><FaWhatsapp /></Link>
            </div>
          </div>
        </div>


        {/* Copyright */}

      </div>
      <hr className="border-gray-400" />
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-3 md:flex items-center justify-between text-center md:text-start">
        {/* Left Side - Copyright */}
        <small className="text-xs tracking-wider text-gray-300">
          Copyright © {new Date().getFullYear()}{" "}
          <Link
            className="text-white"
            href="https://agaram.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <small>Agaram Foundation</small>
          </Link>
          . All Rights Reserved.
        </small>

        {/* Right Side - Designed By */}
        <div className="flex items-center justify-center mt-3 md:mt-0">
          <small className="text-xs md:text-sm tracking-wide text-gray-300">
            Designed & Developed by
          </small>
          <Link
            href="https://www.antcorptech.in/"
            target="_blank"
            className="flex items-center group"
            rel="noopener noreferrer"
          >
            <Image
              src="/assets/images/logo/antcorp_technologies.webp"
              alt="Antcorp Technologies"
              width={100}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;