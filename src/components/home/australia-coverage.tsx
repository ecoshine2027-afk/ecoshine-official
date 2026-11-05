"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { type ServedState } from "@/lib/site";
import { HEX_POINTS } from "@/lib/hex-map";
import type { SectionHeadingContent } from "@/lib/content";

const HEX_SIZE = 12; // drawn radius, smaller than the 15px grid spacing so hexes sit apart

// Timing for the reveal sequence once the map scrolls into view: the neutral
// grid sweeps in first, then each served state's hex cluster pops in, one
// state after another - quick enough to feel snappy, staggered enough to read
// as "this is where we operate."
const GRID_SPAN = 0.45;
const GRID_END = 0.35;
const STATE_GAP = 0.3;

function hexPath(cx: number, cy: number, size = HEX_SIZE) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${(cx + size * Math.cos(angle)).toFixed(1)},${(cy + size * Math.sin(angle)).toFixed(1)}`;
  }).join(" ");
}

function statusColor(s: ServedState) {
  return s.status === "launching" ? "#f59e0b" : "#193cb9";
}

export function AustraliaCoverage({
  serviceNames,
  heading,
  states,
}: {
  serviceNames: { slug: string; short: string }[];
  heading: SectionHeadingContent;
  states: ServedState[];
}) {
  // Default to the head-office state, else the first served state.
  const defaultState = states.find((s) => s.isHq) ?? states[0];
  const [activeCode, setActiveCode] = useState(defaultState?.code ?? "");
  const active = states.find((s) => s.code === activeCode) ?? defaultState;

  const launching = states.find((s) => s.status === "launching");

  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { neutralHexes, minX, spanX } = useMemo(() => {
    const neutral = HEX_POINTS.filter((h) => !h.region);
    const xs = HEX_POINTS.map((h) => h.x);
    const lo = Math.min(...xs);
    const hi = Math.max(...xs);
    return { neutralHexes: neutral, minX: lo, spanX: hi - lo || 1 };
  }, []);

  return (
    <section className="bg-surface py-20" id="coverage" ref={sectionRef}>
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
            {heading.eyebrow}
          </span>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            {heading.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {heading.description}
          </p>
        </div>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          {/* Hex map */}
          <div className="relative">
            <svg
              viewBox="0 0 1000 850"
              className="h-auto w-full"
              role="img"
              aria-label="Hex map of Australia highlighting the states and territories Ecoshine services"
            >
              {/* Neutral grid: the rest of the country, sweeping in left to right */}
              {neutralHexes.map((h, i) => {
                const delay = GRID_SPAN * ((h.x - minX) / spanX);
                return (
                  <polygon
                    key={`n-${i}`}
                    points={hexPath(h.x, h.y)}
                    fill="currentColor"
                    className={`text-brand-200 dark:text-brand-800/60 ${
                      inView ? "animate-hex-fade" : "opacity-0"
                    }`}
                    style={inView ? { animationDelay: `${delay}s` } : undefined}
                  />
                );
              })}

              {/* Served states: hex clusters pop in state by state */}
              {states.map((s, stateIndex) => {
                const hexes = HEX_POINTS.filter((h) => h.region === s.code);
                const color = statusColor(s);
                const isActive = s.code === activeCode;
                const groupStart = GRID_END + stateIndex * STATE_GAP;
                return (
                  <g key={s.code}>
                    {hexes.map((h, i) => {
                      const delay = groupStart + Math.min(i * 0.02, 0.2);
                      return (
                        <polygon
                          key={`${s.code}-${i}`}
                          points={hexPath(h.x, h.y, isActive ? HEX_SIZE * 1.1 : HEX_SIZE)}
                          fill={color}
                          opacity={isActive ? 1 : 0.7}
                          className={`cursor-pointer transition-opacity ${
                            inView ? "animate-hex-pop" : "opacity-0"
                          }`}
                          style={inView ? { animationDelay: `${delay}s` } : undefined}
                          onClick={() => setActiveCode(s.code)}
                        />
                      );
                    })}
                    {isActive && (
                      <circle
                        cx={s.cx}
                        cy={s.cy}
                        r={30}
                        fill={color}
                        opacity="0.16"
                        className="animate-ring-pulse"
                        style={{ animationIterationCount: 1 }}
                      />
                    )}
                    <text
                      x={s.cx + s.labelDx}
                      y={s.cy + s.labelDy}
                      fontSize="26"
                      fontWeight="700"
                      fill="currentColor"
                      className={`cursor-pointer text-foreground ${
                        inView ? "animate-hex-fade" : "opacity-0"
                      }`}
                      style={inView ? { animationDelay: `${groupStart + 0.3}s` } : undefined}
                      textAnchor={s.labelDx < 0 ? "end" : "start"}
                      onClick={() => setActiveCode(s.code)}
                    >
                      {s.code}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs font-medium text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-600" /> Now servicing
              </span>
              {launching && (
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Launching
                  {launching.launchDate ? ` ${launching.launchDate}` : " soon"}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-200 dark:bg-brand-800/60" /> Not
                yet servicing
              </span>
            </div>
          </div>

          {/* Detail panel + selector */}
          <div>
            <div className="flex flex-wrap gap-2">
              {states.map((s) => {
                const isActive = s.code === activeCode;
                return (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => setActiveCode(s.code)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-border bg-card text-foreground hover:border-brand-300"
                    }`}
                  >
                    {s.code}
                    {s.status === "launching" && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                          isActive ? "bg-white/20 text-white" : "bg-amber-500/15 text-amber-600"
                        }`}
                      >
                        NEW
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {active && (
            <div
              key={active.code}
              className="animate-fade-rise mt-6 rounded-card border border-border bg-card p-6 sm:p-7"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-bold text-foreground">{active.name}</h3>
                {active.isHq && (
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 dark:bg-brand-600/15 dark:text-brand-300">
                    Head office
                  </span>
                )}
                {active.status === "launching" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    Launching {active.launchDate}
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted">{active.tagline}</p>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-foreground">
                Cities we cover
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {active.cities.map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground"
                  >
                    <MapPin className="h-3.5 w-3.5 text-brand-600" />
                    {city}
                  </span>
                ))}
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-foreground">
                Services available
              </p>
              <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {serviceNames.map((s) => (
                  <li key={s.slug} className="flex items-center gap-2 text-sm text-muted">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-eco-500" />
                    {s.short}
                  </li>
                ))}
              </ul>

              <Link
                href="/quote"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-300"
              >
                {active.status === "launching"
                  ? `Register your interest in ${active.code}`
                  : `Get a free quote in ${active.code}`}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
