import Image from "next/image";
import Hero from "@/components/insurance/Hero";
import Bg from "@/components/shader-bg/bg";
import { About } from "@/components/insurance/About";
import Features from "@/components/insurance/Features";
import Capabilities from "@/components/insurance/Capabilities";
import Results from "@/components/insurance/Results";
import PlatformCapabilities from "@/components/insurance/PlatformCapabilities";
import Outcomes from "@/components/insurance/Outcomes";
import Efficiency from "@/components/insurance/Efficiency";
import CustomerQuotes from "@/components/insurance/CustomerQuotes";
import FutureScope from "@/components/insurance/FutureScope";
import FAQs from "@/components/insurance/FAQ";
import CTC from '@/components/insurance/CTC'
import Footer from "@/components/insurance/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <Capabilities />
      <Results />
      <PlatformCapabilities />
      <Outcomes />
      <Efficiency />
      <CustomerQuotes />
      <FutureScope />
      <FAQs />
      <CTC />
      <Footer />
    </>
  );
}
