import HeartParticles from "@/components/HeartParticles";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import PricingSection from "@/components/landing/PricingSection";
import CountdownSection from "@/components/landing/CountdownSection";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <div className="min-h-screen">
            <HeartParticles />
            <HeroSection />
            <HowItWorks />
            <PricingSection />
            <CountdownSection />
            <Footer />
        </div>
    );
}
