import React from "react";
import { motion } from "framer-motion";
import { VideoText } from "../components/lightswind/video-text";
import { TypingText } from "../components/lightswind/typing-text";
import ThreeDHoverGallery from "../components/lightswind/3d-hover-gallery";

// Asset Import
import heroImage from "../assets/heroImage.jpg";

const Hero = () => {
  // Sample images for the gallery (placeholders as requested)
  const galleryImages = [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800",
    "https://images.unsplash.com/photo-1524578271613-d550eebad100?q=80&w=800",
    "https://images.unsplash.com/photo-1474367658819-e17559466f21?q=80&w=800",
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800",
  ];

  return (
    <section id="home" className="relative w-full min-h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Background Image with Parallax-like feel */}
      <div
        className="absolute inset-0 w-full h-full z-0 opacity-40"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 pt-32 pb-20 text-center">
        
        {/* 1. Tagline: Video Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4"
        >
          <VideoText
            src="https://cdn.pixabay.com/video/2021/04/12/70817-537330761_large.mp4" // Placeholder book/ink video
            fontSize={12} // Adjusting for viewport width
            fontWeight={900}
            className="leading-none"
          >
            BORROW. READ. REPEAT.
          </VideoText>
        </motion.div>

        {/* 2. Brief Intro with Typing Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="max-w-4xl mb-12"
        >
          <h2 className="text-white text-2xl md:text-4xl font-light leading-relaxed">
            Bringing{" "}
            <span className="inline-block min-w-[120px] text-blue-400 font-bold">
              <TypingText duration={1.5} color="text-blue-400">
                readers
              </TypingText>
            </span>{" "}
            together & <br />
            connecting{" "}
            <span className="inline-block min-w-[120px] text-pink-400 font-bold">
              <TypingText delay={1} duration={1.5} color="text-pink-400">
                hearts
              </TypingText>
            </span>{" "}
            through every page.
          </h2>
        </motion.div>

        {/* 3. 3D Hover Gallery Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full h-[500px] mb-20"
        >
          <ThreeDHoverGallery
            images={galleryImages}          // your array of images
            itemWidth={4}
            itemHeight={15}
            gap={0.6}
            perspective={40}
            hoverScale={12}                 // how much the image enlarges on hover
            transitionDuration={1.5}
            backgroundColor="transparent"   // transparent background
            grayscaleStrength={0.8}
            brightnessLevel={0.6}
            activeWidth={35}
            enableKeyboardNavigation={true}
            autoPlay={false}                // disable auto rotation
            onImageClick={(index, image) => handleImageClick(index, image)}
            onImageHover={(index, image) => handleImageHover(index, image)}
            />

        </motion.div>

        {/* 4. Trusted User Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          <p className="text-gray-400 tracking-widest uppercase text-sm">Trusted by 1200+ Readers</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Replace these with actual logos later */}
             <div className="text-white font-bold text-xl">LITHUB</div>
             <div className="text-white font-bold text-xl">BOOKMATE</div>
             <div className="text-white font-bold text-xl">NOVELTY</div>
             <div className="text-white font-bold text-xl">STORYLINE</div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;