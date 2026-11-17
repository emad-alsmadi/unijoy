'use client';
import dynamic from "next/dynamic";
const About = dynamic(() => import("@/components/layout/About"), { ssr: false });

const AboutPage = () => {
  return <About />;
};

export default AboutPage;