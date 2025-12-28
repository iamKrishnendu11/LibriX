import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is LibriX?",
    answer:
      "LibriX is a reader-first digital platform built to bring readers together, connect stories, and create a shared literary experience beyond just reading."
  },
  {
    question: "Who is LibriX for?",
    answer:
      "LibriX is for readers, writers, thinkers, and anyone who believes books are more than pages — they are connections, emotions, and ideas."
  },
  {
    question: "Can I discover new books on LibriX?",
    answer:
      "Absolutely. LibriX helps you explore books, genres, and voices curated around reader interests, trends, and shared recommendations."
  },
  {
    question: "Does LibriX support community interaction?",
    answer:
      "Yes. LibriX is designed to foster meaningful conversations, shared reading journeys, and collective discovery among readers."
  },
  {
    question: "Is LibriX focused on physical or digital books?",
    answer:
      "LibriX embraces stories in every form — physical books, digital reads, and the emotions and discussions they inspire."
  },
  {
    question: "How does LibriX personalize my experience?",
    answer:
      "Through reading behavior, interests, and community interaction, LibriX curates content that resonates with your literary taste."
  },
  {
    question: "Can writers or creators join LibriX?",
    answer:
      "Yes. LibriX welcomes writers, poets, and storytellers who want to share their voice and connect with engaged readers."
  },
  {
    question: "Is LibriX free to use?",
    answer:
      "LibriX offers free access to core features, with optional premium experiences planned for advanced discovery and engagement."
  },
  {
    question: "Does LibriX support regional or local literature?",
    answer:
      "Definitely. LibriX celebrates diverse voices, regional stories, and cultural narratives — especially from India and beyond."
  },
  {
    question: "What makes LibriX different from other reading platforms?",
    answer:
      "LibriX is not just about reading books — it's about connecting hearts, conversations, and communities through stories."
  }
];

const FAQItem = ({ faq, index, isOpen, toggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="border-b border-white/10 last:border-none"
    >
      <button
        onClick={toggle}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span
          className={`text-xl font-medium transition-colors duration-300 ${
            isOpen
              ? "text-transparent bg-clip-text bg-black"
              : "text-black group-hover:text-gray-400"
          }`}
        >
          {faq.question}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isOpen
              ? "bg-gray-600"
              : "bg-white/10"
          }`}
        >
          {isOpen ? (
            <Minus className="w-4 h-4 text-gray" />
          ) : (
            <Plus className="w-4 h-4 text-gray" />
          )}
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-900 text-l leading-relaxed pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-white">
      {/* Glow Background */}
      <div className="absolute inset-0">
        {/* <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-200 rounded-full blur-[150px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-200 rounded-full blur-[120px]" /> */}
      </div>

      <div
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        ref={ref}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-linear-to-r from-yellow-200 to-amber-300 border border-yellow-300 text-black text-sm font-medium mb-4">
            LibriX FAQ
          </span>

          <h2 className="text-4xl md:text-5xl font-black text-black mb-6">
            Questions about{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-yellow-200
                backdrop-blur-lg">
              LibriX
            </span>
          </h2>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Everything you need to know about our reader-first universe
          </p>
        </motion.div>

        {/* FAQ Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-amber-100 to-yellow-50
                backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-8"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              toggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}