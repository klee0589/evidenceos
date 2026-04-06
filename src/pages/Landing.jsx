import { useRef, useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import TrustBar from "../components/landing/TrustBar";
import QuickStartCode from "../components/landing/QuickStartCode";
import HowItWorks from "../components/landing/HowItWorks";
import SystemsSupported from "../components/landing/SystemsSupported";
import BuiltForDevelopers from "../components/landing/BuiltForDevelopers";
import DeveloperOnboarding from "../components/landing/DeveloperOnboarding";
import TestingUseCases from "../components/landing/TestingUseCases";
import ReportsSection from "../components/landing/ReportsSection";
import ResponseFormatExample from "../components/landing/ResponseFormatExample";
import ProductionFeatures from "../components/landing/ProductionFeatures";
import APIDemo from "../components/landing/APIDemo";
import AuthSection from "../components/landing/AuthSection";
import WaitlistForm from "../components/landing/WaitlistForm";
import PricingSection from "../components/landing/PricingSection";
import SandboxDisclaimer from "../components/landing/SandboxDisclaimer";
import Footer from "../components/landing/Footer";

const HERO_IMAGE = "https://media.base44.com/images/public/69d2fa4ba58632a6c6429f1e/3d3c62bee_generated_7174fe43.png";

export default function Landing() {
  const waitlistRef = useRef(null);
  const demoRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        const users = await base44.entities.User.filter({ email: me.email });
        setUser(users[0] ? { ...me, ...users[0] } : me);
      }
    });
  }, []);

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onWaitlistClick={scrollToWaitlist} user={user} />
      <Hero onWaitlistClick={scrollToWaitlist} onDemoClick={scrollToDemo} heroImage={HERO_IMAGE} />
      <TrustBar />
      <QuickStartCode />
      <HowItWorks />
      <SystemsSupported />
      <BuiltForDevelopers />
      <DeveloperOnboarding />
      <TestingUseCases />
      <ReportsSection />
      <ResponseFormatExample />
      <ProductionFeatures />
      <APIDemo />
      <AuthSection />
      <PricingSection user={user} scrollToWaitlist={scrollToWaitlist} />
      <WaitlistForm formRef={waitlistRef} />
      <SandboxDisclaimer />
      <Footer />
    </div>
  );
}