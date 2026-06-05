'use client'
import React, { useState } from 'react'
import { Card, CardHeader, Image } from "@heroui/react";
import { img } from 'framer-motion/client';
import { getImageSize } from 'next/dist/server/image-optimizer';

const cardsData = [
  {
    id: 1,
    title: "Our Vision:",
    subtitle: "To bring about a significant positive change in the socio-economic status of the rural society by offering quality education to the deserving individual.",
    img: "",
    image: "https://herald.uohyd.ac.in/wp-content/uploads/2022/09/abc.jpg"
  },
  {
    id: 2,
    title: "Our Mission:",
    subtitle: "Strive to bridge the gap between deserving candidates and quality education Build a new generation of responsible youth with education, values, commitment and dedication to society.",
    img: "",
    image: "https://img.studioflicks.com/wp-content/uploads/2024/08/11211044/Agaram-Foundation-45th-Year-Award-Ceremony-HQ-Stills-28.jpg"
  },
  {
    id: 3,
    title: "About Vidhai ",
    subtitle: "Agaram has been working in the field of education for the past 15+ years. We believe that education is the most powerful tool to bridge the socio-economic divide.",
    img: "https://heroui.com/images/card-example-2.jpeg",
    image:'https://i.ytimg.com/vi/mpKEuLPFHQE/maxresdefault.jpg'
  }
];

export default function Page() {

  const [active, setActive] = useState(1);

  const getPosition = (id:number) => {
    if (id === active) return "center";
    if ((active === 1 && id === 2) || (active === 2 && id === 3) || (active === 3 && id === 1)) {
      return "right";
    }
    return "left";
  };

  return (
    <>
    <div className='bg-primary-50 py-10'>
    <h1 className='text-5xl md:text-7xl fond-bold text-primary-600 mb-6 flex justify-center'>
        Vidhai Journey
    </h1>
    <p className='text-5xl md:text-6xl fond-bold text-primary-600 mb-6 flex justify-center'>
        (2010 - 2025)
    </p>
     </div>
    <div className="flex justify-center items-center h-180 bg-primary-50 py-10"  >

      <div className="relative w-[900px] h-[500px]">

        {cardsData.map((card) => {
          const position = getPosition(card.id)

          return (
            <Card
              key={card.id}
              isPressable
              onClick={() => setActive(card.id)}
              className={`
                absolute w-[300px] h-[350px] transition-all duration-500 cursor-pointer bg-white/20 backdrop-blur-lg rounded-lg overflow-hidden
                ${position === "center" && "left-1/2 -translate-x-1/2 scale-150 z-50"}
                ${position === "left" && "left-0 scale-90 opacity-80 z-40"}
                ${position === "right" && "right-0 scale-90 opacity-80 z-40"}
              `}
            >
              <CardHeader className="absolute z-10 top-1 flex-col items-start h-600">
                <h1 className="text-2xl font-semibold mb-4 text-secondary-500">
                  {card.title}
                </h1>
                <Image className="w-full h-full object-cover" src={card.image} />
                 <p className="text-justify text-small text-grey-600">
                  {card.subtitle}
                </p>
                </CardHeader>

              <Image
                removeWrapper
                alt="Card background"
                className="z-0 w-full h-full object-cover"
                src={card.img}
              />
            </Card>
          );
        })}

      </div>
    </div>
    <div className='bg-primary-50 py-10' >
      <p className='text-2xl md:text-4xl fond-bold text-primary-600 mb-6 flex justify-center text align-justify mx-20 text gap-4'>
        Initiated in 2010 for rural government school students 6400+ students supported 
        </p>
        <p className='text-2xl md:text-4xl fond-bold text-primary-600 mb-6 flex justify-center text align-justify mx-20 text gap-4'>
          | 4500+ graduates | 1,700+ 
        currently studying Covers fields like Engineering, 
        </p>
        <p className='text-2xl md:text-4xl fond-bold text-primary-600 mb-6 flex justify-center text align-justify mx-20 text gap-4'>
          Medicine, Arts, Science & more.
        </p>
    </div>
    </>
  );
}