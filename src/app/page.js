"use client";
import Hero from '@/components/Hero';
import FeaturedLawyers from '@/components/FeaturedLawyers';
import TopLegalExperts from '@/components/TopLegalExperts';
import LegalCategories from '@/components/LegalCategories';
import HowItWorks from '@/components/HowItWorks';
import WhyTrustUs from '@/components/WhyTrustUs';
import StatsSection from '@/components/StatsSection';
import Testimonials from '@/components/Testimonials';
import LatestTips from '@/components/LatestTips';
import ContactUs from '@/components/ContactUs';
import PricingSection from '@/components/PricingSection';
import MeetAdmin from '@/components/MeetAdmin';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedLawyers />
      <TopLegalExperts />
      <LegalCategories />
      <HowItWorks />
      <WhyTrustUs />
      <StatsSection />
      <Testimonials />
      <LatestTips />
      <PricingSection />
      <MeetAdmin />
      <ContactUs />
    </div>
  );
}