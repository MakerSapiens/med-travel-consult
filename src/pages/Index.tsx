
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import OnlineConsultation from "@/components/OnlineConsultation";
import HowItWorks from "@/components/HowItWorks";
import FeaturedDoctors from "@/components/FeaturedDoctors";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedDestinations />
      <OnlineConsultation />
      <HowItWorks />
      <FeaturedDoctors />
      <TrustSection />
      <Footer />
    </div>
  );
};

export default Index;
