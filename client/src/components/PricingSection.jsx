import React from "react";
import { Check, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const plans = [
  {
    name: "Basic",
    price: 49,
    features: [
      "Upload up to 20 books",
      "Rental availability tracking",
      "Standard search visibility",
      "Monthly earnings summary",
      "Email support"
    ]
  },
  {
    name: "Standard",
    price: 99,
    popular: true,
    features: [
      "Upload up to 50 books",
      "Priority rental placement",
      "Advanced earnings analytics",
      "Featured book badge",
      "Priority support"
    ]
  },
  {
    name: "Premium",
    price: 199,
    features: [
      "Unlimited book uploads",
      "Top search placement",
      "Full analytics dashboard",
      "Marketing & promo tools",
      "24/7 dedicated support"
    ]
  }
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 }
  }
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
};

export default function PricingSection() {
  return (
    <section id='pricing' className="bg-white py-28">
      <div className="max-w-6xl mx-auto px-4">

        {/* Heading */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h2
            variants={item}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900"
          >
            Pricing built for book lenders
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Transparent plans that grow with your library.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.7 }}
              className="relative overflow-hidden rounded-3xl border border-yellow-200 bg-yellow-50 group"
            >
              {/* Gradient sweep (NEW animation) */}
              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-amber-200 to-yellow-300 opacity-0 group-hover:opacity-100"
              />

              {/* Content */}
              <div className="relative p-8 flex flex-col h-full">

                {/* Popular label */}
                {plan.popular && (
                  <span className="self-start mb-4 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">
                    Most Popular
                  </span>
                )}

                {/* Header */}
                <div className="mb-8">
                  <BookOpen className="w-9 h-9 mb-3 text-yellow-500 group-hover:text-black transition" />

                  <h3 className="text-2xl font-bold text-slate-900">
                    {plan.name}
                  </h3>

                  {/* animated underline */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: 40 }}
                    transition={{ duration: 0.6 }}
                    className="h-[3px] bg-yellow-400 rounded-full mt-2"
                  />

                  <div className="mt-5 flex items-end gap-1">
                    <span className="text-5xl font-extrabold text-slate-900">
                      ₹{plan.price}
                    </span>
                    <span className="text-sm text-slate-600 mb-1">
                      /month
                    </span>
                  </div>
                </div>

                {/* Features */}
                <motion.ul
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="space-y-4 flex-1"
                >
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      variants={item}
                      className="flex items-start gap-3"
                    >
                      <div className="w-5 h-5 mt-1 rounded-full bg-yellow-200 flex items-center justify-center">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                      <span className="text-sm text-slate-700">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* CTA */}
                <Link
                  to={createPageUrl("Register") + "?role=lender"}
                  className="mt-10"
                >
                  <Button className="w-full py-6 rounded-2xl bg-yellow-300 text-black hover:bg-yellow-500 transition">
                    Choose {plan.name}
                  </Button>
                </Link>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}