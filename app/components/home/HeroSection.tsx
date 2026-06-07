"use client";

import { Swiper, SwiperSlide } from "swiper/react";
// @ts-ignore: CSS module declarations unavailable
import "swiper/swiper-bundle.css";
 // @ts-ignore: CSS module declarations unavailable
import "swiper/css";
// @ts-ignore: CSS module declarations unavailable
import "swiper/css/pagination";
import "animate.css";
import Image from "next/image";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useState, useEffect, useRef } from "react";
import type { Swiper as SwiperType } from "swiper/types";
import { LuArrowUpRight } from "react-icons/lu";
import { Button, Link } from "@heroui/react";

type ButtonItem = {
  label: string;
  link: string;
};

type ProductWithDetails = {
  id: string;
  title: string;
  subtitle: string;
  background: string;
  imageSrc: string;
  rightSubtitle: string;
  leftSubtitle: string;
  leftButtons: ButtonItem[];
  rightButtons: ButtonItem[];
};

const productsArray: ProductWithDetails[] = [
  {
    id: "moringa-superblend",
    title: "Transforming living",
    subtitle: "With Learn-for-all Access",
    background:
      "linear-gradient(to top,#5cc9d7 0%,#9cdce5 33%,#c7eef1 66%,#ffffff 100%)",
    imageSrc: "/assets/images/slider/agaram_slider_img_1.webp",
    rightSubtitle:
      "Strive to bridge the gap between deserving students and quality education.",
    leftSubtitle: "Extend the power of education to every corner of society.",
    leftButtons: [{ label: "Our Mission", link: "/our_mission" }],
    rightButtons: [{ label: "Donate Now", link: "/donate" }],
  },
  {
    id: "app-launch",
    title: "Presenting Our New App",
    subtitle: "Now Available on Play Store",
    background:
      "linear-gradient(to top,#5cc9d7 0%,#9cdce5 33%,#c7eef1 66%,#ffffff 100%)",
    imageSrc: "/assets/images/slider/agaram_slider_img_2.webp",
    leftSubtitle: "Download our app to empower education with just a tap.",
    rightSubtitle:
      "Strive to bridge the gap between deserving students and quality education.",
    leftButtons: [
      {
        label: "Download App",
        link: "https://play.google.com/store/apps/details?id=com.agaramfoundation.app&pcampaignid=web_share",
      },
    ],
    rightButtons: [{ label: "Support Students", link: "/donate" }],
  },
];

const MainCarousel = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const rafRef = useRef<number | null>(null);

  // Canvas background animation - respects prefers-reduced-motion
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const canvas = document.getElementById("particle-bg") as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let offsetY = 0;

    const resizeCanvas = () => {
      const cssW = canvas.offsetWidth;
      const cssH = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(cssW * dpr));
      canvas.height = Math.max(1, Math.floor(cssH * dpr));
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const size = 100;
    const step = size * Math.SQRT2;
    const speed = 0.8;

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;

      offsetY = (offsetY + speed) % step;

      for (let y = -step; y < h + step; y += step) {
        for (let x = -step; x < w + step; x += step) {
          ctx.save();
          ctx.translate(x, (y + offsetY) % (h + step));
          ctx.rotate(Math.PI / 4);
          ctx.strokeRect(-size / 2, -size / 2, size, size);
          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ✅ Swiper animations
  const triggerAnimation = (swiper: SwiperType) => {
    const activeSlide = swiper.slides[swiper.activeIndex] as HTMLElement | undefined;
    if (!activeSlide) return;

    const imgElement = activeSlide.querySelector(".animated-img") as HTMLElement | null;
    const titleElement = activeSlide.querySelector(".animated-title") as HTMLElement | null;
    const leftElement = activeSlide.querySelector(".animated-nutrients") as HTMLElement | null;
    const rightElement = activeSlide.querySelector(".animated-benefits") as HTMLElement | null;

    const resetAndPlay = (el: HTMLElement | null, classes: string[]) => {
      if (!el) return;
      el.classList.remove(...classes);
      void el.offsetWidth; // reflow
      el.classList.add(...classes);
    };

    resetAndPlay(imgElement, ["animate__animated", "animate__zoomInUp"]);
    resetAndPlay(titleElement, ["animate__animated", "animate__bounceInDown"]);
    resetAndPlay(rightElement, ["animate__animated", "animate__fadeInRight"]);
    resetAndPlay(leftElement, ["animate__animated", "animate__fadeInLeft"]);
  };

  useEffect(() => {
    if (!swiperInstance) return;
    triggerAnimation(swiperInstance);
    const onSlideChange = () => triggerAnimation(swiperInstance);
    swiperInstance.on("slideChange", onSlideChange);
    return () => swiperInstance.off("slideChange", onSlideChange);
  }, [swiperInstance]);

  return (
    <div className="relative">
      <canvas
        id="particle-bg"
        className="absolute inset-0 w-full h-full z-0"
        aria-hidden="true"
        style={{ pointerEvents: "none" }}
      />
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        loop
        autoHeight={true}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
      >
        {productsArray.map(
          ({
            id,
            title,
            subtitle,
            background,
            imageSrc,
            leftSubtitle,
            rightSubtitle,
            leftButtons,
            rightButtons,
          }) => (
            <SwiperSlide
              key={id}
              style={{
                background,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
              }}
            >
              <div className="flex flex-col w-full">
                {/* Title */}
                <div className="w-full p-4 text-center mt-6 sm:mt-10 animated-title">
                  <h1 className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                    {title}
                  </h1>
                  <h2 className="text-secondary text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium my-2 sm:my-3">
                    {subtitle}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center">
                  {/* Left Subtitle + Buttons */}
                  <div className="w-full md:w-1/2 lg:w-1/3 order-2 lg:order-1 flex flex-col justify-start items-center text-white p-3 md:mb-3 animated-nutrients">
                    <div className="grid grid-cols-1 gap-4 text-white w-full max-w-md">
                      <div
                        style={{ background: "rgba(22, 22, 23, 0.2)" }}
                        className="flex flex-col items-center justify-center p-4 text-center rounded-lg"
                      >
                        <p className="text-base sm:text-lg md:text-xl tracking-wide">
                          {leftSubtitle}
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                        {leftButtons.map((btn, idx) => (
                          <Button
                            key={idx}
                            className="flex items-center px-3 py-3 sm:px-4 sm:py-5 rounded-lg text-sm sm:text-base bg-white/50 hover:bg-white"
                            as={Link}
                            href={btn.link}
                          >
                            {btn.label} <LuArrowUpRight className="ml-2" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="w-full md:w-full lg:w-1/3 order-1 lg:order-2 flex justify-center items-center p-2">
                    <div className="p-2 sm:p-4 text-white text-center">
                      <div className="flex justify-center items-center w-[400px] h-[400px] mx-auto">
                        <Image
                          className="animated-img object-contain"
                          src={imageSrc}
                          width={900}
                          height={900}
                          alt={`${title} image`}
                          priority
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Subtitle + Buttons */}
                  <div className="w-full md:w-1/2 lg:w-1/3 order-3 flex flex-col justify-center items-center text-white p-3 md:mb-3 mb-6 sm:mb-10 animated-benefits">
                    <div className="grid grid-cols-1 gap-4 text-white w-full max-w-md">
                      <div
                        style={{ background: "rgba(22, 22, 23, 0.2)" }}
                        className="flex flex-col items-center justify-center p-4 text-center rounded-lg"
                      >
                        <p className="text-base sm:text-lg md:text-xl tracking-wide">
                          {rightSubtitle}
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                        {rightButtons.map((btn, idx) => (
                          <Button
                            key={idx}
                            className="flex items-center px-3 py-3 sm:px-4 sm:py-5 rounded-lg text-sm sm:text-base bg-white/50 hover:bg-white"
                            as={Link}
                            href={btn.link}
                          >
                            {btn.label} <LuArrowUpRight className="ml-2" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        )}
      </Swiper>
    </div>
  );
};

export default MainCarousel;
