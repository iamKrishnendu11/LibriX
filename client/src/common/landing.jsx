import React from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/HeroSection'
import Timeline from '@/components/Timeline'
import ContactForm from '@/components/ContactSection'
import Footer from '@/components/Footer'
import Testimonials from '@/components/Testimonials'
import AboutSection from '@/components/AboutSection'
import Band from '@/components/Band'
import FAQ from '@/components/Faq'
// import CircularGallery from '@/components/CircularImages'
import PricingSection from '@/components/PricingSection'


const landing = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <AboutSection />
      <Timeline/>
      <Band />
      <PricingSection />
      {/* <CircularGallery /> */}
      <Testimonials/>
      <FAQ />
      <ContactForm/>
      <Footer/>
    </>
  )
}

export default landing


