import { useRef, useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import QuickStartCode from "../components/landing/QuickStartCode";
import SystemsSupported from "../components/landing/SystemsSupported";
import TestingUseCases from "../components/landing/TestingUseCases";
import ReportsSection from "../components/landing/ReportsSection";
import APIDemo from "../components/landing/APIDemo";
import AuthSection from "../components/landing/AuthSection";
import WaitlistForm from "../components/landing/WaitlistForm";
import PricingSection from "../components/landing/PricingSection";
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
      <QuickStartCode />
      <SystemsSupported />
      <TestingUseCases />
      <ReportsSection />
      <APIDemo />
      <AuthSection />
      <PricingSection user={user} scrollToWaitlist={scrollToWaitlist} />
      <WaitlistForm formRef={waitlistRef} />
      <Footer />
    </div>
  );
}