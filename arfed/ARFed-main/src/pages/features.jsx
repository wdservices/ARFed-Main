import React from "react";
import FooterNav from "../components/footerNav";
import Head from "next/head";
import HeaderNav from "../components/headerNav";

const features = () => {
  const features = [
    {
      title: "Geography",
      description: "ARFed's geography feature allows users to visualize and interact with geographical features, such as mountains, rivers, and oceans, in a three-dimensional environment. This can help students to better understand the geography of different regions and the relationships between geographical features.",
      image: "geography"
    },
    {
      title: "Biology",
      description: "ARFed's biology feature offers an interactive and immersive way to study the anatomy of different organisms. Students can use ARFed to observe and examine the structures of plants, animals, and microorganisms in real-time, which can help them to understand the complex relationships between different biological systems.",
      image: "biology"
    },
    {
      title: "Chemistry",
      description: "ARFed's chemistry feature offers an interactive way to study the elements and compounds that make up our world. Students can use ARFed to visualize and interact with atomic and molecular structures, as well as observe chemical reactions taking place in real-time.",
      image: "chemistry"
    },
    {
      title: "Planetary",
      description: "ARFed's planetary feature allows users to explore our solar system and beyond. Students can use ARFed to observe the planets and moons of our solar system, as well as learn about the history and geography of our universe.",
      image: "planet"
    },
    {
      title: "Animals",
      description: "ARFed's animals feature allows students to observe and interact with different species of animals, both in their natural habitats and in captivity. This can help students to understand the behaviors, habitats, and relationships between different species of animals.",
      image: "animalsnew-"
    },
    {
      title: "Physics",
      description: "ARFed's physics feature offers an interactive and engaging way to study the laws of physics. Students can use ARFed to observe and experiment with physical phenomena, such as motion, forces, and energy, which can help them to better understand the underlying principles of physics.",
      image: "physics"
    }
  ]
  return (
    <div>
      <Head>
        <title>ARFed || Features</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta
          name="description"
          content="ARFED is a web-based augmented reality application, created to help both students and teachers visualize topics/subject taught in the classroom in 3D."
        />
      </Head>
      <HeaderNav />
      <main className="lg:mx-20 mx-4">
        <h1 className="text-center text-3xl font-bold my-8">Features</h1>
        <div className="flex flex-wrap justify-between my-10 text-black">
          {
            features.map((feature, index) => (
              <div key={index} className="lg:w-[30%] bg-white lg:my-8 my-4 rounded-md">
                <img className="w-full" src={"/images/features/" + feature.image + ".png"} alt="" />
                <div className="p-3">
                  <h3 className="text-xl mb-3 font-bold">{feature.title}</h3>
                  <p className="text-sm">{feature.description}</p>
                </div>
              </div>
            ))
          }
        </div>
      </main>
      <FooterNav />
    </div>
  );
};

export default features;
