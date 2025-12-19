import { ScrollTimeline } from "../components/lightswind/scroll-timeline"
import {
  UserPlus,
  Search,
  ShoppingCart,
  MapPin
} from "lucide-react"

const events = [
  {
    year: "Step 01",
    title: "Register on LibriX",
    subtitle: "Create your reader identity",
    description:
      "Sign up in seconds to become part of the LibriX reading community.",
    icon: UserPlus,
  },
  {
    year: "Step 02",
    title: "Browse or Request",
    subtitle: "Discover books nearby",
    description:
      "Explore available books or request a title you’re looking for.",
    icon: Search,
  },
  {
    year: "Step 03",
    title: "Rent, Buy or Bid",
    subtitle: "Choose your way",
    description:
      "Rent affordably, buy permanently, or bid on popular books.",
    icon: ShoppingCart,
  },
  {
    year: "Step 04",
    title: "Pick Up Nearby",
    subtitle: "Fast & local",
    description:
      "Pick up books from nearby readers or hubs.",
    icon: MapPin,
  },
]

export default function Timeline() {
  return (
    <section className="bg-white text-black py-20">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">
          How <span className="text-yellow-500">LibriX</span> Works
        </h2>
        <p className="text-black/70">
          Bringing readers together through local discovery.
        </p>
      </div>

      <ScrollTimeline
        events={events}
        progressIndicator
        cardAlignment="alternating"
        revealAnimation="fade"
      />
    </section>
  )
}
