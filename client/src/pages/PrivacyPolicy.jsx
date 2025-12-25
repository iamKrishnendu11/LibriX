import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const dataUsage = [
  { name: "Account Data", value: 40 },
  { name: "Reading Preferences", value: 25 },
  { name: "Payment Info", value: 15 },
  { name: "Analytics", value: 20 },
];

const COLORS = ["#22c55e", "#a855f7", "#facc15", "#38bdf8"];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-20 py-20">
      
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl md:text-6xl font-bold mb-6"
      >
        Privacy <span className="text-green-400">Policy</span>
      </motion.h1>

      <p className="text-gray-400 max-w-3xl mb-12">
        At <span className="text-white font-medium">LibriX</span>, your privacy
        matters. This policy explains what data we collect, why we collect it,
        and how we keep it safe.
      </p>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <Section
            title="1. Information We Collect"
            text="We collect personal details such as your name, email address, phone number, and reading preferences to provide a personalized experience."
          />

          <Section
            title="2. How We Use Your Data"
            text="Your data helps us recommend books, manage rentals, process payments securely, and improve our platform."
          />

          <Section
            title="3. Data Protection"
            text="We use industry-standard encryption and secure servers to protect your information from unauthorized access."
          />

          <Section
            title="4. Third-Party Services"
            text="We may use trusted third-party tools for payments and analytics. These services comply with strict privacy standards."
          />

          <Section
            title="5. Your Rights"
            text="You can request data access, correction, or deletion at any time by contacting our support team."
          />
        </motion.div>

        {/* Right Chart Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-900 rounded-2xl p-8 shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4">
            How Your Data Is Used
          </h3>

          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={dataUsage}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                >
                  {dataUsage.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <p className="text-sm text-gray-400 mt-4 text-center">
            Transparency matters — we clearly show how your data supports
            LibriX.
          </p>
        </motion.div>
      </div>

      {/* Footer Line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 text-sm mt-20"
      >
        Last updated: January 2025
      </motion.p>
    </div>
  );
};

const Section = ({ title, text }) => (
  <div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{text}</p>
  </div>
);

export default PrivacyPolicy;
