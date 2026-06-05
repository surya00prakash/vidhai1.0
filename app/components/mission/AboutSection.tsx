import Image from 'next/image'

const cards = [
    {
        company: "Impact of Agaram (on Students)",
        description:
            "When the playing field levels, possibilities multiply. Since we began, Agaram under the Vidhai program has helped close to 6500+ students step into college, for many the first in their families to ever do so. Nearly 68% are young women, all from rural communities and economically challenged backgrounds. With steady mentorship, hostel support, and an unbroken chain of guidance, our students don’t just graduate they secure meaningful jobs or pursue higher studies, reshaping what their families believe is possible. The real change is generational. Families who once saw education as out of reach now speak of degrees and careers with pride.\n\n Former students return to mentor others, forming a circle of trust and shared strength. For us, impact isn’t just measured in numbers, but in the confidence, clarity, and stability that take root in a student’s life rippling outward to communities. Step by step, we are nurturing a society that thinks deeper, acts wiser, and grows stronger together, where equal opportunity is not just a legal right but a reality.",
        image: "/assets/images/mission/our_mission.webp",
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
                            <h3 className="text-4xl font-semibold mb-4 text-gray-900">{card.company}</h3>
                            <p className="text-justify text-md text-gray-600">{card.description}</p>
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