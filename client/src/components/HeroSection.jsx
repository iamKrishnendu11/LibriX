
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TypingText from "./lightswind/typing-text";


import heroVideo from "../assets/videos/heroVideo.mp4";

const Hero = () => {
  const line1Words = ["readers", "minds", "voices"];
  const line2Words = ["hearts", "stories", "souls"];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % line1Words.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-100"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
      />

     
      <div className="absolute inset-0 z-0" />

      {/* Centered Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="text-white leading-tight max-w-4xl"
        >
          {/* Line 1 – Bigger */}
          <div className="text-6xl text-white/70 md:text-8xl lg:text-8xl font-semibold">
            Bringing{" "}
            <span className="inline-block min-w-[150px] text-6xl md:text-8xl lg:text-9xl font-bold font-bold text-yellow-400">
              <TypingText
                key={line1Words[index]}
                duration={1.5}
                color="text-yellow-400"
                fontSize="text-6xl md:text-8xl lg:text-9xl"
                fontWeight="font-bold"
                
              >
                {line1Words[index]}
              </TypingText>
            </span>{" "}
            together
          </div>

          {/* Line 2 – Smaller */}
          <div className="mt-4 text-xl md:text-3xl font-light">
            Connecting{" "}
            <span className="inline-block min-w-[150px] font-bold text-pink-400">
              <TypingText
                key={line2Words[index]}
                delay={0.6}
                duration={1.5}
                color="text-yellow-400"
              >
                {line2Words[index]}
              </TypingText>
            </span>{" "}
            through every page.
          </div>
        </motion.h2>
      </div>
    </section>
  );
};

export default Hero;
