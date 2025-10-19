import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeaturedProjects from "@/components/FeaturedProjects";
import PremiumSection from "@/components/PremiumSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <FeaturedProjects />
      <PremiumSection />
      <AboutSection />
      <ContactSection />
      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default Index;
