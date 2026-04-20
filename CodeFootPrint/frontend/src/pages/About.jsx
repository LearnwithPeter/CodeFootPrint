import { Link } from "react-router-dom";
import {
  ExternalLink,
  Code2,
  Zap,
  Target,
  ArrowRight,
  GitCommit,
  BarChart3,
  Terminal,
  Shield,
  Globe,
} from "lucide-react";

const PRINCIPLES = [
  {
    icon: Shield,
    title: "Privacy-first",
    desc: "We only analyze public repositories. No code is stored, only metadata and aggregated stats.",
    color: "#00D4FF",
  },
  {
    icon: Zap,
    title: "Fast by default",
    desc: "Results in under 10 seconds. We aggressively cache GitHub API responses to cut latency.",
    color: "#FFB800",
  },
  {
    icon: Target,
    title: "Accuracy matters",
    desc: "Our attribution model handles merge commits, co-authors, and rebased history correctly.",
    color: "#00FF88",
  },
  {
    icon: Globe,
    title: "Built in public",
    desc: "We dogfood our own tool. Our own repo is publicly analyzable — we have nothing to hide.",
    color: "#A78BFA",
  },
];

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute hero-glow w-96 h-96 bg-[#00D4FF] opacity-[0.04] top-0 right-1/4" />
        <div className="max-w-4xl mx-auto relative text-center">
          <span className="font-mono text-xs text-[#00D4FF] tracking-widest uppercase">
            About
          </span>
          <h1 className="font-display font-800 text-5xl md:text-6xl text-white mt-4 mb-6 leading-tight">
            We built the tool
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#00FF88]">
              we wished existed.
            </span>
          </h1>
          <p className="font-body text-lg text-[#718096] max-w-2xl mx-auto leading-relaxed">
            CodeFootprint started when a team of three developers kept arguing
            about "who did what" in code reviews. We built a script to settle
            it. Then we made it beautiful. Then we decided everyone deserves
            this.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16 px-6 relative">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="font-display font-700 text-3xl text-white">
              What we stand for
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRINCIPLES.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="card-hover flex gap-4 bg-[#0D1117] border border-[#1E2A3A] rounded-xl p-5"
              >
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}33`,
                  }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <h3 className="font-display font-600 text-white mb-1">
                    {title}
                  </h3>
                  <p className="font-body text-sm text-[#4A5568] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-700 text-3xl text-white mb-4">
            Want early access?
          </h2>
          <p className="font-body text-[#718096] mb-8">
            We're building features for private repos and team exports. Join the
            waitlist.
          </p>
          <Link
            to="/contact"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-display font-600 text-black"
          >
            <span className="flex items-center gap-2">
              Join Waitlist <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
