import Hero_section from "@/components/sections/hero_section";
import Recommend_section from "@/components/sections/recommend_section";
import New_collection_section from "@/components/sections/new_collection._section";
import About_section from "@/components/sections/about_section";
import Collection_section from "@/components/sections/collection_section";

import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Hero_section />
      <div className="max-w-[68vw] mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <Recommend_section />
        </Suspense>
        <New_collection_section />
      </div>
      <About_section />
      <div className="max-w-[68vw] mx-auto">
        <Collection_section />
      </div>
    </>
  );
}
