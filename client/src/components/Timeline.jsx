import {
  UserPlus,
  Search,
  ShoppingCart,
  MapPin,
  ArrowRight
} from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Register on LibriX",
    description: "Create your reader identity in seconds.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Browse or Request",
    description: "Find books nearby or request what you need.",
    icon: Search,
  },
  {
    number: "03",
    title: "Rent, Buy or Bid",
    description: "Choose how you want the book.",
    icon: ShoppingCart,
  },
  {
    number: "04",
    title: "Pick Up Nearby",
    description: "Fast pickup from local readers or hubs.",
    icon: MapPin,
  },
]

export default function HowItWorksHorizontal() {
  return (
    <section className="bg-white py-24">
      {/* Heading */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-6xl font-bold mb-4 text-slate-900">
          How{" "}
          <span className="bg-gradient-to-r from-amber-300 to-yellow-600 bg-clip-text text-transparent">
            LibriX
          </span>{" "}
          Works
        </h2>
        <p className="text-slate-600">
          A simple, local-first way to discover books.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 px-6">
  {steps.map((step, index) => (
    <div key={step.number} className="flex items-center">
      
      {/* Step Card */}
      <div className="flex flex-col items-center text-center bg-gradient-to-br from-yellow-200 to-amber-100 backdrop-blur-lg border border-white/40 rounded-2xl px-6 py-8 w-64 shadow-md">
        <div className="text-sm font-semibold text-black mb-2">
          STEP {step.number}
        </div>

        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300 to-yellow-600 flex items-center justify-center mb-4">
          <step.icon className="w-6 h-6 text-black" />
        </div>

        <h3 className="font-semibold text-slate-900 mb-2">
          {step.title}
        </h3>

        <p className="text-sm text-slate-600">
          {step.description}
        </p>
      </div>

      {/* Arrow */}
      {index !== steps.length - 1 && (
        <ArrowRight className="hidden md:block mx-4 text-black w-6 h-6 flex-shrink-0" />
      )}
    </div>
  ))}
</div>

    </section>
  )
}