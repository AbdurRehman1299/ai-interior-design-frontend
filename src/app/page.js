import Footer from '@/components/Footer';
import CallToActionSection from '@/components/Home/CallToAction';
import FeaturesSection from '@/components/Home/FeatureSection';
import HeroSection from '@/components/Home/HeroSection';
import Navigation from '@/components/NavigationBar';
import TestimonialsSection from '@/components/Home/TestimonialsSection';
import React from 'react';

export const metadata = {
  title: "Redesign Your Room with AI | Vision Home AI",
  description: "Stuck on your room design? Use VisionHome AI for unlimited, free AI interior design ideas. Upload a photo and start visualizing your dream room in seconds."
}

function Home(){
  return (
    <main className="bg-white">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CallToActionSection />
      <Footer />
    </main>
  )
}

export default Home;