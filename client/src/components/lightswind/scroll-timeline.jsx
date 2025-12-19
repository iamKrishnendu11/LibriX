"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { cn } from "../../lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

/* ------------------------------------------------------------------ */
/* DEFAULT EVENTS */
/* ------------------------------------------------------------------ */

const DEFAULT_EVENTS = [
  {
    year: "2023",
    title: "Major Achievement",
    description: "Description of the achievement.",
  },
  {
    year: "2022",
    title: "Important Milestone",
    description: "Details about the milestone.",
  },
];

/* ------------------------------------------------------------------ */
/* COMPONENT */
/* ------------------------------------------------------------------ */

export const ScrollTimeline = ({
  events = DEFAULT_EVENTS,
  title = "Timeline",
  subtitle = "Scroll to explore the journey",
  animationOrder = "sequential",
  cardAlignment = "alternating",
  progressIndicator = true,
  parallaxIntensity = 0.15,
  progressLineWidth = 3,
  progressLineCap = "round",
  dateFormat = "badge",
  revealAnimation = "fade",
  className = "",
  darkMode = false,
}) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  /* ---------------- SCROLL PROGRESS ---------------- */

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const progressHeight = useTransform(
    smoothProgress,
    [0, 1],
    ["0%", "100%"]
  );

  /* ---------------- PARALLAX (HOOK SAFE) ---------------- */

  const parallaxY = useTransform(
    smoothProgress,
    [0, 1],
    [parallaxIntensity * 80, -parallaxIntensity * 80]
  );

  /* ---------------- ACTIVE INDEX ---------------- */

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((v) => {
      const idx = Math.floor(v * events.length);
      if (idx >= 0 && idx < events.length) {
        setActiveIndex(idx);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, events.length]);

  /* ---------------- CARD VARIANTS ---------------- */

  const getCardVariants = (index) => {
    const delay =
      animationOrder === "staggered"
        ? index * 0.2
        : animationOrder === "sequential"
        ? index * 0.3
        : 0;

    const initial = {
      fade: { opacity: 0, y: 30 },
      slide: { opacity: 0, x: index % 2 === 0 ? -80 : 80 },
      scale: { opacity: 0, scale: 0.9 },
      flip: { opacity: 0, rotateY: 90 },
      none: { opacity: 1 },
    };

    return {
      initial: initial[revealAnimation],
      whileInView: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotateY: 0,
        transition: { duration: 0.7, delay },
      },
      viewport: { once: false, margin: "-100px" },
    };
  };

  /* ---------------------------------------------------------------- */

  return (
    <section
      ref={scrollRef}
      className={cn(
        "relative min-h-screen w-full overflow-hidden",
        darkMode ? "bg-background text-foreground" : "bg-white text-black",
        className
      )}
    >
      {/* HEADER */}
      <div className="text-center py-16 px-4">
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="text-black/70 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* TIMELINE */}
      <div className="relative max-w-6xl mx-auto px-4 pb-24">
        {/* BACK LINE */}
        <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-black/10" />

        {/* PROGRESS LINE */}
        {progressIndicator && (
          <motion.div
            className="absolute left-1/2 top-0 -translate-x-1/2 z-10"
            style={{
              height: progressHeight,
              width: progressLineWidth,
              borderRadius: progressLineCap === "round" ? 9999 : 0,
              background:
                "linear-gradient(to bottom, #facc15, #22c55e)",
            }}
          />
        )}

        {/* EVENTS */}
        <div className="relative z-20">
          {events.map((event, index) => {
            const Icon = event.icon || Calendar;

            return (
              <motion.div
                key={event.id || index}
                className={cn(
                  "relative mb-20 flex flex-col lg:flex-row",
                  cardAlignment === "alternating"
                    ? index % 2 === 0
                      ? "lg:justify-start"
                      : "lg:flex-row-reverse"
                    : cardAlignment === "left"
                    ? "lg:justify-start"
                    : "lg:flex-row-reverse"
                )}
                variants={getCardVariants(index)}
                initial="initial"
                whileInView="whileInView"
                style={{ y: parallaxY }}
              >
                {/* DOT */}
                <div className="absolute left-1/2 top-6 -translate-x-1/2 z-30">
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full border-4 bg-white",
                      index <= activeIndex
                        ? "border-green-500"
                        : "border-black/20"
                    )}
                  />
                </div>

                {/* CARD */}
                <Card className="w-full lg:w-[calc(50%-40px)] mt-12">
                  <CardContent className="p-6">
                    {dateFormat === "badge" && (
                      <div className="flex items-center mb-2">
                        <Icon className="h-4 w-4 mr-2 text-yellow-500" />
                        <span className="text-sm font-bold text-green-600">
                          {event.year}
                        </span>
                      </div>
                    )}

                    <h3 className="text-xl font-bold mb-1">
                      {event.title}
                    </h3>

                    {event.subtitle && (
                      <p className="text-black/60 mb-2">
                        {event.subtitle}
                      </p>
                    )}

                    <p className="text-black/70">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};