import React from "react";
import { ArrowUpRight } from "lucide-react";
import VideoText from "./lightswind/video-text";
import Video from "../assets/videos/heroVideo.mp4"
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};


const Features = () => {
  return (
    <section id="features" className="py-20 bg-primary bg-gradient-to-br from-green-200 via-white to-yellow-100 backdrop-blur-lg
                  borderz-10 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <VideoText
            as="h2"
            src={Video}
            fontSize={16} // vw-based, tweak for responsiveness
            fontWeight={800}
            className="w-full h-[140px] md:h-[180px] mb-2"
            autoPlay
            muted
            loop
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            LibriX!
          </VideoText>

          <p className="text-xl text-center text-gray-900 max-w-3xl mx-auto">
            Comprehensive AI-powered tools to revolutionize your farming operations
          </p>
        </div>

        {/* Bento Box Grid Layout */}
        {/* GRID FEATURES */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-fr"
      >
        {/* Feature 1 */}
        <motion.div
          variants={cardVariants}
          className="md:col-span-3 md:row-span-2 p-8 bg-gradient-to-br from-amber-100 to-rose-100 backdrop-blur-lg border border-white/30 rounded-3xl hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 group"
        >
          <div className="flex flex-col h-full">
            <div className="mb-6 flex justify-between items-center">
              <div className="text-6xl group-hover:scale-110 transition-transform">📖</div>
              <div className="bg-gray-400/60 p-4 rounded-full group-hover:rotate-45 transition-transform">
                <ArrowUpRight />
              </div>
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              AI Reading Intelligence
            </h3>

            <p className="text-gray-600 text-lg flex-grow">
              Hyper-personalized book discovery powered by AI — understanding
              your interests, reading pace, and preferences to suggest stories
              you’ll love.
            </p>

            <div className="overflow-hidden rounded-2xl mt-6 h-full border border-white/30">
              <video
                className="w-full h-full object-cover"
                src={Video}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          variants={cardVariants}
          className="md:col-span-3 p-8 flex justify-between items-end gap-6 bg-gradient-to-br from-amber-100 to-rose-100 backdrop-blur-lg border border-white/30 rounded-3xl hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 group"
        >
          <div>
            <div className="mb-6 flex justify-between items-center">
              <div className="text-5xl group-hover:scale-110 transition-transform">🤖</div>
              <div className="bg-gray-400/60 p-4 rounded-full group-hover:rotate-45 transition-transform">
                <ArrowUpRight />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Smart Reading Advisories
            </h3>

            <p className="text-gray-600 text-lg">
              Get intelligent summaries, reading insights, and mood-based
              suggestions — helping you choose your next perfect read.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl h-full border border-white/30">
            <img className="h-full w-auto" src="/reading-advice.jpg" alt="" />
          </div>
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          variants={cardVariants}
          className="md:col-span-2 p-8 bg-gradient-to-br from-amber-100 to-rose-100 backdrop-blur-lg border border-white/30 rounded-3xl hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 group"
        >
          <div className="mb-6 flex justify-between items-center">
            <div className="text-5xl group-hover:scale-110 transition-transform">💰</div>
            <div className="bg-gray-400/60 p-4 rounded-full group-hover:rotate-45 transition-transform">
              <ArrowUpRight />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Affordable Book Access
          </h3>

          <p className="text-gray-600 text-lg">
            Buy, borrow, or lend books effortlessly — reducing costs while
            expanding your personal library.
          </p>
        </motion.div>

        {/* Feature 4 */}
        <motion.div
          variants={cardVariants}
          className="md:col-span-1 p-8 bg-gradient-to-br from-amber-100 to-rose-100 backdrop-blur-lg border border-white/30 rounded-3xl hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 group text-center"
        >
          <div className="mb-4">
            <div className="bg-gray-400/60 p-4 rounded-full inline-block group-hover:rotate-45 transition-transform">
              <ArrowUpRight />
            </div>
          </div>

          <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">👥</div>

          <h3 className="text-xl font-bold text-gray-900">
            Reader Community
          </h3>
        </motion.div>
      </motion.div>

      {/* LONG FEATURE */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-6 p-8 bg-gradient-to-br from-amber-100 to-rose-100 backdrop-blur-lg border border-white/30 rounded-3xl hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 group"
      >
        <div className="flex gap-6">
          <div className="text-5xl group-hover:scale-110 transition-transform">🏛️</div>

          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                Literary Programs & Initiatives
              </h3>
              <div className="bg-gray-400/60 p-4 rounded-full group-hover:rotate-45 transition-transform">
                <ArrowUpRight />
              </div>
            </div>

            <p className="text-gray-600 text-lg mt-2">
              Explore author events, reading challenges, library collaborations,
              educational initiatives, and exclusive literary experiences —
              curated inside LibriX.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl h-44 w-72 border border-white/30">
            <img className="w-full h-full object-cover" src="/library.jpg" alt="" />
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  );
};

export default Features;