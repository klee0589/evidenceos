import { useRef } from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Benefits from "../components/landing/Benefits";
import APIDemo from "../components/landing/APIDemo";
import WaitlistForm from "../components/landing/WaitlistForm";
import Testimonials from "../components/landing/Testimonials";
import Footer from "../components/landing/Footer";

const HERO_IMAGE = "/__generating__/img_551d64c0acc0.png";

export default function Landing() {
  const waitlistRef = useRef(null);
  const demoRef = useRef(null);

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onWaitlistClick={scrollToWaitlist} />
      <Hero onWaitlistClick={scrollToWaitlist} onDemoClick={scrollToDemo} heroImage={HERO_IMAGE} />
      <Benefits />
      <APIDemo />
      <WaitlistForm formRef={waitlistRef} />
      <Testimonials />
      <Footer />
    </div>
  );
}