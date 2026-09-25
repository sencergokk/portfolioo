import { Nav } from "@/components/layout/Nav";
import { About } from "@/components/sections/About";
import { Apps } from "@/components/sections/Apps";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Stack } from "@/components/sections/Stack";
import { SceneLayer } from "@/scene/SceneLayer";

export default function Home() {
  return (
    <>
      <SceneLayer />
      <Nav />
      <main id="icerik" className="relative z-10">
        <Hero />
        <About />
        <Apps />
        <Experience />
        <Stack />
        <Contact />
      </main>
    </>
  );
}
