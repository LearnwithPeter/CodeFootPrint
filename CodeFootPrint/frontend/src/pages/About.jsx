import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  Code2,
  Zap,
  Users,
  Target,
  ArrowRight,
  GitCommit,
  BarChart3,
  Terminal,
  Shield,
  Cpu,
  Globe,
} from "lucide-react";

const TEAM = [
  {
    name: "Arjun Mehta",
    role: "Founder & Backend",
    avatar: "AM",
    color: "#00D4FF",
    bio: "Built the GitHub API pipeline and contributor analysis engine. Obsessed with developer tooling.",
    github: "arjunmehta",
    commits: "Core infra",
  },
  {
    name: "Priya Sharma",
    role: "AI / ML",
    avatar: "PS",
    color: "#00FF88",
    bio: "Designed the ownership mapping model and the AI summarization pipeline.",
    github: "priyasharma",
    commits: "AI layer",
  },
  {
    name: "Rohan Das",
    role: "Frontend",
    avatar: "RD",
    color: "#FFB800",
    bio: "Crafted the interface from scratch. Dark theme enthusiast. Hates over-engineered UIs.",
    github: "rohandas",
    commits: "UI/UX",
  },
];

const TECH_STACK = [
  { name: "React", category: "Frontend", color: "#61DAFB" },
  { name: "TailwindCSS", category: "Styling", color: "#06B6D4" },
  { name: "Node.js", category: "Backend", color: "#68A063" },
  { name: "GitHub API", category: "Data", color: "#ffffff" },
  { name: "OpenAI", category: "AI", color: "#00D4FF" },
  { name: "PostgreSQL", category: "Database", color: "#336791" },
  { name: "Redis", category: "Cache", color: "#DC382D" },
  { name: "Vercel", category: "Deploy", color: "#ffffff" },
];

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
  const [hoveredMember, setHoveredMember] = useState(null);

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="hero-glow w-96 h-96 bg-[#00D4FF] opacity-[0.04] top-0 right-1/4" />
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

      {/* Origin story */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display font-700 text-3xl text-white mb-4">
                The origin story
              </h2>
              <p className="font-body text-[#718096] leading-relaxed mb-4">
                In 2024, our team submitted a college project. Three people. One
                repo. One person wrote 78% of the code. The group presentation
                didn't reflect that.
              </p>
              <p className="font-body text-[#718096] leading-relaxed mb-4">
                We wrote a Python script that parsed git history and printed
                contribution stats. Showed it to our professor. He gave everyone
                a fair grade.
              </p>
              <p className="font-body text-[#718096] leading-relaxed">
                The tool grew from there. Now it uses AI to generate natural
                language summaries, maps file ownership, and helps teams
                understand exactly who drove what — without politics.
              </p>
            </div>
            <div className="bg-[#0D1117] border border-[#1E2A3A] rounded-xl p-6 font-mono text-xs">
              <div className="text-[#4A5568] mb-4">
                // git log --oneline --all | sort | uniq -c
              </div>
              <div className="space-y-2">
                {[
                  {
                    name: "arjunmehta",
                    count: 247,
                    color: "#00D4FF",
                    bar: 100,
                  },
                  {
                    name: "priyasharma",
                    count: 189,
                    color: "#00FF88",
                    bar: 77,
                  },
                  { name: "rohandas", count: 31, color: "#FFB800", bar: 13 },
                ].map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between mb-1 text-[#718096]">
                      <span>{item.name}</span>
                      <span style={{ color: item.color }}>
                        {item.count} commits
                      </span>
                    </div>
                    <div className="h-1 bg-[#1E2A3A] rounded">
                      <div
                        className="h-full rounded contribution-bar"
                        style={{
                          width: `${item.bar}%`,
                          background: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-[#4A5568]">
                // This is what started everything.
              </div>
            </div>
          </div>
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

      {/* Team */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-mono text-xs text-[#00D4FF] tracking-widest uppercase">
              The team
            </span>
            <h2 className="font-display font-700 text-3xl text-white mt-3">
              Three people, one obsession
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="card-hover cursor-default bg-[#0D1117] border border-[#1E2A3A] rounded-xl p-6 text-center relative overflow-hidden"
                onMouseEnter={() => setHoveredMember(member.name)}
                onMouseLeave={() => setHoveredMember(null)}
                style={
                  hoveredMember === member.name
                    ? {
                        borderColor: `${member.color}44`,
                        boxShadow: `0 0 24px ${member.color}11`,
                      }
                    : {}
                }
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${member.color}66, transparent)`,
                    opacity: hoveredMember === member.name ? 1 : 0,
                  }}
                />
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center font-mono text-lg font-700 text-black"
                  style={{
                    background: `linear-gradient(135deg, ${member.color}, ${member.color}88)`,
                  }}
                >
                  {member.avatar}
                </div>
                <h3 className="font-display font-600 text-white text-lg">
                  {member.name}
                </h3>
                <div
                  className="font-mono text-xs mb-1"
                  style={{ color: member.color }}
                >
                  {member.role}
                </div>
                <div className="font-body text-xs text-[#4A5568] mb-4 leading-relaxed">
                  {member.bio}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111820] border border-[#1E2A3A] rounded-full">
                  <ExternalLink size={12} className="text-[#4A5568]" />
                  <span className="font-mono text-xs text-[#718096]">
                    @{member.github}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-16 px-6 relative">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="font-display font-700 text-3xl text-white">
              Built with
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {TECH_STACK.map(({ name, category, color }) => (
              <div
                key={name}
                className="card-hover flex items-center gap-2 px-4 py-2.5 bg-[#0D1117] border border-[#1E2A3A] rounded-lg"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: color }}
                />
                <span className="font-body text-sm text-white">{name}</span>
                <span className="font-mono text-xs text-[#4A5568]">
                  {category}
                </span>
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
