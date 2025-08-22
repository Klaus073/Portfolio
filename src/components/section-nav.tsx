"use client";

import { useEffect, useState } from "react";

const SECTION_IDS = ["home", "experience", "blogs", "contact"] as const;

export function SectionNav() {
  const [active, setActive] = useState<string>(SECTION_IDS[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(id);
            }
          });
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav aria-label="Section navigation" className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:block">
      <ul className="flex flex-col gap-3">
        {SECTION_IDS.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-label={id}
              className="block w-[4px] h-5 rounded-full bg-neutral-700 hover:bg-neutral-300 transition-colors"
              style={{
                backgroundColor: active === id ? "#ffffff" : undefined,
                boxShadow: active === id ? "0 0 0 2px rgba(255,255,255,0.15)" : undefined,
              }}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}



