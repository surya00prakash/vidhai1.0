import Image from 'next/image'

const cards = [
  {
    company: "Agaram Foundation",
    description:
      "India stands at a crossroads, racing ahead in science, technology, and infrastructure, yet still held back by the weight of inequality. For millions, the promise of the Right to Education remains words on paper, and entire communities are left untouched by opportunity. At Agaram Foundation, we believe every child, deserves the key that can unlock every door in life. We work hand in hand with communities to break down barriers, kindle ambition, and make quality education not a privilege, but a birthright.",
    image: "/assets/images/agaram-donation-image.webp",
  }
];

const AboutSection = () => {
  return (
    <div className="max-w-7xl mt-16 mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-1">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="rounded-2xl overflow-hidden flex gap-20 flex-col md:flex-row items-stretch justify-between"
        >
          {/* LEFT CONTENT */}
          <div className="p-6 flex flex-col justify-between w-full md:w-1/2 space-y-4 bg-white">
            <div className="space-y-2">
              <h3 className="text-4xl font-semibold mb-4 text-secondary-500">{card.company}</h3>
              <p className="text-justify text-lg text-secondary-400">{card.description}</p>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full md:w-1/2 h-[240px] md:h-auto">
            <Image
              src={card.image}
              alt={card.company}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-xl md:rounded-none md:rounded-l-2xl"
            />
          </div>
        </div>

      ))}
    </div>
  )
}

export default AboutSection