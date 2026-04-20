import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  GitCommit,
  Users,
  Code2,
  TrendingUp,
  Star,
  GitBranch,
  Zap,
  ChevronRight,
  Terminal,
  BarChart3,
  Eye,
  Shield,
  ArrowRight,
  Circle,
  Activity,
  Clock,
  FileCode,
} from "lucide-react";

// ─── Particles background ────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 4,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.5 + 0.1,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background:
              p.id % 3 === 0
                ? "#00D4FF"
                : p.id % 3 === 1
                  ? "#00FF88"
                  : "#0A84FF",
            opacity: p.opacity,
            animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
            "--dx": `${(Math.random() - 0.5) * 60}px`,
            "--dy": `${-Math.random() * 80 - 20}px`,
            "--opacity": p.opacity,
            "--duration": `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Hero Section ────────────────────────────────────────
function HeroSection({ onAnalyze }) {
  const [inputVal, setInputVal] = useState("");
  const [typing, setTyping] = useState(true);
  const inputRef = useRef(null);

  const examples = [
    "facebook/react",
    "vercel/next.js",
    "tailwindlabs/tailwindcss",
    "microsoft/vscode",
  ];
  const [exIdx, setExIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setExIdx((i) => (i + 1) % examples.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      <Particles />
      <div className="absolute hero-glow w-[600px] h-[600px] bg-[#00D4FF] opacity-[0.04] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute hero-glow w-[400px] h-[400px] bg-[#0A84FF] opacity-[0.06] top-1/4 left-1/4" />
      <div className="absolute hero-glow w-[300px] h-[300px] bg-[#00FF88] opacity-[0.04] bottom-1/4 right-1/4" />

      {/* Scan line */}
      <div className="scan-line" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00D4FF33] bg-[#00D4FF11] mb-8 backdrop-blur-sm hover:border-[#00D4FF55] hover:bg-[#00D4FF15] transition-all duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
          <span className="font-mono text-xs text-[#00D4FF] tracking-widest uppercase">
            AI-Powered Repo Analysis
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-800 text-5xl md:text-7xl leading-[1.05] tracking-tight mb-6 animate-fade-in">
          <span className="block text-white">Every line of code</span>
          <br />
          <span className="text-white">tells a </span>
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] via-[#00FF88] to-[#00D4FF] glow-cyan-text animate-pulse-slow">
              story.
            </span>
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent opacity-50 blur-sm" />
          </span>
        </h1>

        <p
          className="font-body text-lg md:text-xl text-[#A0B0C0] max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Drop any GitHub repository link. Get a complete breakdown of who built
          what — commits, ownership, code patterns, and an AI summary of every
          contributor's impact.
        </p>

        {/* Input */}
        <div className="max-w-2xl mx-auto">
          <div className="relative flex gap-0 rounded-xl overflow-hidden border border-[#1E2A3A] focus-within:border-[#00D4FF77] focus-within:shadow-lg transition-all duration-300 bg-[#0D1117] shadow-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.2)]">
            <div className="flex items-center px-4 border-r border-[#1E2A3A] text-[#00D4FF]">
              <Terminal size={16} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && inputVal && onAnalyze(inputVal)
              }
              placeholder={`github.com/${examples[exIdx]}`}
              className="flex-1 bg-transparent px-4 py-4 font-mono text-sm text-[#E2E8F0] placeholder-[#3A4A5A] focus:outline-none transition-colors duration-300"
            />
            <button
              onClick={() => inputVal && onAnalyze(inputVal)}
              className="btn-primary px-8 py-4 font-display font-600 text-black text-sm whitespace-nowrap flex items-center gap-2"
            >
              <Zap size={16} />
              Analyze
            </button>
          </div>
          <p className="mt-3 font-mono text-xs text-[#2D3748]">
            try:{" "}
            <button
              onClick={() => {
                setInputVal("facebook/react");
                onAnalyze("facebook/react");
              }}
              className="text-[#4A5568] hover:text-[#00D4FF] transition-colors"
            >
              facebook/react
            </button>
            {" · "}
            <button
              onClick={() => {
                setInputVal("vercel/next.js");
                onAnalyze("vercel/next.js");
              }}
              className="text-[#4A5568] hover:text-[#00D4FF] transition-colors"
            >
              vercel/next.js
            </button>
            {" · "}
            <button
              onClick={() => {
                setInputVal("torvalds/linux");
                onAnalyze("torvalds/linux");
              }}
              className="text-[#4A5568] hover:text-[#00D4FF] transition-colors"
            >
              torvalds/linux
            </button>
          </p>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { label: "Repos Analyzed", value: "2.4K+", icon: GitBranch },
            { label: "Contributors Mapped", value: "18K+", icon: Users },
            { label: "Commits Processed", value: "1.2M+", icon: GitCommit },
          ].map(({ label, value, icon: Icon }, idx) => (
            <div
              key={label}
              className="text-center group cursor-default"
              style={{
                animation: `slideUp 0.6s ease-out ${0.3 + idx * 0.1}s both`,
              }}
            >
              <div className="font-display font-700 text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#00FF88] group-hover:text-[#00D4FF] transition-colors duration-300">
                {value}
              </div>
              <div className="font-body text-xs text-[#5A7A8A] mt-1 flex items-center justify-center gap-1 group-hover:text-[#00D4FF] transition-colors duration-300">
                <Icon size={10} className="group-hover:animate-pulse" />
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce cursor-pointer hover:scale-110 transition-transform duration-300"
        onClick={() =>
          resultRef?.current?.scrollIntoView?.({ behavior: "smooth" })
        }
      >
        <div className="w-px h-8 bg-gradient-to-b from-[#00D4FF] to-transparent" />
        <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse shadow-lg shadow-[#00D4FF]" />
      </div>
    </section>
  );
}

// ─── Analysis Result ─────────────────────────────────────
function AnalysisResult({ data, onReset }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedContrib, setSelectedContrib] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [data]);

  return (
    <section className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Repo header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
              <span className="font-mono text-xs text-[#4A5568] uppercase tracking-widest">
                Analysis Complete
              </span>
            </div>
            <h2 className="font-display font-700 text-3xl md:text-4xl text-white flex items-center gap-3">
              <span className="text-[#4A5568]">/</span>
              {data.repo}
            </h2>
            <div className="flex items-center gap-4 mt-2 font-mono text-xs text-[#4A5568]">
              <span className="flex items-center gap-1">
                <Star size={10} className="text-[#FFB800]" />
                {data.stars.toLocaleString()} stars
              </span>
              <span className="flex items-center gap-1">
                <GitCommit size={10} />
                {data.totalCommits.toLocaleString()} commits
              </span>
              <span className="flex items-center gap-1">
                <Users size={10} />
                {data.contributors.length} contributors
              </span>
            </div>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 border border-[#1E2A3A] rounded-lg font-body text-sm text-[#718096] hover:text-white hover:border-[#2D3748] transition-all"
          >
            <ArrowRight size={14} className="rotate-180" /> New Analysis
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[#1E2A3A] pb-0">
          {["overview", "contributors", "ai-summary"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 font-body text-sm capitalize transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-[#00D4FF] text-[#00D4FF]"
                  : "border-transparent text-[#4A5568] hover:text-[#718096]"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Contributor bars */}
            <div className="bg-[#0D1117] border border-[#1E2A3A] rounded-xl p-6">
              <h3 className="font-display font-600 text-white text-lg mb-6 flex items-center gap-2">
                <BarChart3 size={18} className="text-[#00D4FF]" />
                Contribution Breakdown
              </h3>
              <div className="space-y-5">
                {data.contributors.map((c, i) => (
                  <div
                    key={c.login}
                    className="group cursor-pointer"
                    onClick={() => {
                      setSelectedContrib(c);
                      setActiveTab("contributors");
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-600 text-black"
                          style={{ background: c.color }}
                        >
                          {c.avatar}
                        </div>
                        <div>
                          <span className="font-body text-sm text-white group-hover:text-[#00D4FF] transition-colors">
                            {c.name}
                          </span>
                          <span className="font-mono text-xs text-[#4A5568] ml-2">
                            @{c.login}
                          </span>
                        </div>
                        <span className="hidden md:block font-mono text-xs px-2 py-0.5 rounded-full border border-[#1E2A3A] text-[#718096]">
                          {c.primaryRole}
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className="font-mono text-sm font-600"
                          style={{ color: c.color }}
                        >
                          {c.percent}%
                        </span>
                        <div className="font-mono text-xs text-[#4A5568]">
                          {c.commits.toLocaleString()} commits
                        </div>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#1E2A3A] rounded-full overflow-hidden">
                      <div
                        key={animKey}
                        className="h-full rounded-full contribution-bar"
                        style={{
                          width: `${c.percent}%`,
                          background: `linear-gradient(90deg, ${c.color}, ${c.color}88)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Language + Quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0D1117] border border-[#1E2A3A] rounded-xl p-6">
                <h3 className="font-display font-600 text-white mb-5 flex items-center gap-2">
                  <Code2 size={16} className="text-[#00D4FF]" />
                  Languages
                </h3>
                {data.languages.map((l) => (
                  <div key={l.name} className="mb-4">
                    <div className="flex justify-between mb-1.5">
                      <span className="font-body text-sm text-[#718096] flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: l.color }}
                        />
                        {l.name}
                      </span>
                      <span
                        className="font-mono text-xs"
                        style={{ color: l.color }}
                      >
                        {l.percent}%
                      </span>
                    </div>
                    <div className="h-1 bg-[#1E2A3A] rounded-full">
                      <div
                        key={animKey}
                        className="h-full rounded-full contribution-bar"
                        style={{ width: `${l.percent}%`, background: l.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#0D1117] border border-[#1E2A3A] rounded-xl p-6">
                <h3 className="font-display font-600 text-white mb-5 flex items-center gap-2">
                  <Activity size={16} className="text-[#00D4FF]" />
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Avg commits/contributor",
                      value: Math.round(
                        data.totalCommits / data.contributors.length,
                      ).toLocaleString(),
                      icon: GitCommit,
                    },
                    {
                      label: "Top contributor",
                      value: data.contributors[0].name.split(" ")[0],
                      icon: Star,
                    },
                    {
                      label: "Total contributors",
                      value: data.contributors.length,
                      icon: Users,
                    },
                    {
                      label: "Repo health",
                      value: "Active",
                      icon: Shield,
                      green: true,
                    },
                  ].map(({ label, value, icon: Icon, green }) => (
                    <div
                      key={label}
                      className="bg-[#111820] rounded-lg p-3 border border-[#1E2A3A]"
                    >
                      <Icon
                        size={14}
                        className={
                          green ? "text-[#00FF88] mb-2" : "text-[#4A5568] mb-2"
                        }
                      />
                      <div
                        className={`font-mono text-sm font-600 ${green ? "text-[#00FF88]" : "text-white"}`}
                      >
                        {value}
                      </div>
                      <div className="font-body text-xs text-[#4A5568] mt-0.5">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contributors Tab */}
        {activeTab === "contributors" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.contributors.map((c) => (
              <div
                key={c.login}
                onClick={() =>
                  setSelectedContrib(
                    selectedContrib?.login === c.login ? null : c,
                  )
                }
                className={`card-hover cursor-pointer bg-[#0D1117] border rounded-xl p-5 transition-all duration-300 ${
                  selectedContrib?.login === c.login
                    ? "border-[#00D4FF44]"
                    : "border-[#1E2A3A]"
                }`}
                style={
                  selectedContrib?.login === c.login
                    ? { boxShadow: `0 0 20px ${c.color}22` }
                    : {}
                }
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-700 text-black"
                      style={{
                        background: `linear-gradient(135deg, ${c.color}, ${c.color}88)`,
                      }}
                    >
                      {c.avatar}
                    </div>
                    <div>
                      <div className="font-display font-600 text-white text-sm">
                        {c.name}
                      </div>
                      <div className="font-mono text-xs text-[#4A5568]">
                        @{c.login}
                      </div>
                    </div>
                  </div>
                  <span
                    className="font-mono text-xs font-700"
                    style={{ color: c.color }}
                  >
                    {c.percent}%
                  </span>
                </div>

                <div className="mb-3">
                  <span
                    className="inline-block px-2 py-0.5 rounded-full border text-xs font-mono"
                    style={{
                      borderColor: `${c.color}44`,
                      color: c.color,
                      background: `${c.color}11`,
                    }}
                  >
                    {c.primaryRole}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  {[
                    { label: "Commits", value: c.commits.toLocaleString() },
                    {
                      label: "Lines+",
                      value: (c.linesAdded / 1000).toFixed(1) + "k",
                    },
                    { label: "Files", value: c.filesChanged },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-[#111820] rounded-lg py-2 border border-[#1E2A3A]"
                    >
                      <div className="font-mono text-sm font-600 text-white">
                        {value}
                      </div>
                      <div className="font-body text-xs text-[#4A5568]">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="font-body text-xs text-[#4A5568] mb-2 flex items-center gap-1">
                    <FileCode size={10} /> Top areas
                  </div>
                  {c.topFiles.map((f) => (
                    <div
                      key={f}
                      className="font-mono text-xs text-[#718096] py-0.5 flex items-center gap-1"
                    >
                      <ChevronRight size={10} style={{ color: c.color }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Summary Tab */}
        {activeTab === "ai-summary" && (
          <div className="max-w-3xl">
            <div className="bg-[#0D1117] border border-[#1E2A3A] rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D4FF44] to-transparent" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0A84FF] flex items-center justify-center">
                  <Eye size={14} className="text-black" />
                </div>
                <div>
                  <div className="font-display font-600 text-white">
                    AI Analysis Summary
                  </div>
                  <div className="font-mono text-xs text-[#4A5568]">
                    Generated by CodeFootprint AI
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00FF8811] border border-[#00FF8833]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
                  <span className="font-mono text-xs text-[#00FF88]">Live</span>
                </div>
              </div>
              <p className="font-body text-[#718096] leading-relaxed text-base">
                {data.aiSummary}
              </p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.contributors.slice(0, 3).map((c) => (
                  <div
                    key={c.login}
                    className="bg-[#111820] rounded-lg p-3 border border-[#1E2A3A]"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs text-black"
                        style={{ background: c.color }}
                      >
                        {c.avatar[0]}
                      </div>
                      <span className="font-body text-xs text-white">
                        {c.name.split(" ")[0]}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-[#4A5568]">
                      {c.primaryRole}
                    </div>
                    <div
                      className="mt-1 font-mono text-xs font-600"
                      style={{ color: c.color }}
                    >
                      {c.percent}% ownership
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: GitCommit,
      title: "Commit Archaeology",
      desc: "Deep-dive into every commit — who wrote what, when, and why. Full timeline of team activity.",
      color: "#00D4FF",
    },
    {
      icon: BarChart3,
      title: "Ownership Mapping",
      desc: "See exactly which files, folders, and features belong to each contributor. No ambiguity.",
      color: "#00FF88",
    },
    {
      icon: Eye,
      title: "AI-Powered Summary",
      desc: "Get a human-readable summary of each person's role and contribution style, powered by AI.",
      color: "#FFB800",
    },
    {
      icon: TrendingUp,
      title: "Velocity Insights",
      desc: "Track contribution velocity over time. Spot bottlenecks and silent contributors.",
      color: "#FF3B5C",
    },
    {
      icon: Code2,
      title: "Language Breakdown",
      desc: "Understand the tech stack per contributor. Who owns the TypeScript? Who writes the CSS?",
      color: "#A78BFA",
    },
    {
      icon: Shield,
      title: "Zero Setup",
      desc: "Just paste a GitHub URL. No API keys, no OAuth, no repositories to clone. Instant results.",
      color: "#FB923C",
    },
  ];

  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-[#00D4FF] tracking-widest uppercase">
            What we analyze
          </span>
          <h2 className="font-display font-700 text-4xl md:text-5xl text-white mt-3">
            Complete team visibility
          </h2>
          <p className="font-body text-[#718096] mt-4 max-w-xl mx-auto">
            From a single GitHub link to a full picture of your team's work — in
            seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, color }, idx) => (
            <div
              key={title}
              className="card-hover group bg-[#0D1117] border border-[#1E2A3A] hover:border-[#2D3748] rounded-xl p-6 relative overflow-hidden"
              style={{
                animation: `slideUp 0.6s ease-out ${0.2 + idx * 0.05}s both`,
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-[#00D4FF44] to-transparent"
                style={{ boxShadow: `0 0 20px ${color}66` }}
              />
              <div
                className="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{ background: color }}
              />
              <div
                className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}33`,
                }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <h3 className="font-display font-600 text-white text-lg mb-2 group-hover:text-[#00D4FF] transition-colors duration-300">
                {title}
              </h3>
              <p className="font-body text-sm text-[#4A5568] leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Paste the repo URL",
      desc: "Drop any public GitHub repository link into the analyzer.",
      code: "> github.com/owner/repository",
    },
    {
      num: "02",
      title: "We fetch everything",
      desc: "CodeFootprint pulls commits, diffs, file trees, and author data via the GitHub API.",
      code: "> fetching 18,472 commits...",
    },
    {
      num: "03",
      title: "AI does the work",
      desc: "Our AI maps ownership, detects patterns, and writes plain-English summaries for each contributor.",
      code: "> analyzing contributor patterns...",
    },
    {
      num: "04",
      title: "Read the report",
      desc: "Get a detailed, interactive breakdown — ready to share with your team or manager.",
      code: "> report ready ✓",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-[#00D4FF] tracking-widest uppercase">
            Process
          </span>
          <h2 className="font-display font-700 text-4xl md:text-5xl text-white mt-3">
            How it works
          </h2>
        </div>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00D4FF22] via-[#00D4FF44] to-[#00D4FF22]" />
          <div className="space-y-12">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`relative flex flex-col md:flex-row gap-8 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-4 w-4 h-4 rounded-full border-2 border-[#00D4FF] bg-[#080B10] z-10" />
                {/* Content */}
                <div
                  className={`md:w-[calc(50%-2rem)] ml-12 md:ml-0 ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}
                >
                  <div className="font-mono text-xs text-[#00D4FF] mb-2">
                    {step.num}
                  </div>
                  <h3 className="font-display font-600 text-white text-xl mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm text-[#4A5568] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {/* Code snippet */}
                <div
                  className={`md:w-[calc(50%-2rem)] ml-12 md:ml-0 ${i % 2 === 0 ? "md:pl-8" : "md:pr-8 md:text-right"}`}
                >
                  <div className="bg-[#0D1117] border border-[#1E2A3A] rounded-lg px-4 py-3 inline-block">
                    <span className="font-mono text-xs text-[#00D4FF]">
                      {step.code}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative bg-[#0D1117] border border-[#1E2A3A] rounded-2xl p-12 overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="hero-glow w-96 h-96 bg-[#00D4FF] opacity-[0.05] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="relative">
            <h2 className="font-display font-700 text-4xl md:text-5xl text-white mb-4">
              Ready to see your team's
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#00FF88]">
                {" "}
                footprint?
              </span>
            </h2>
            <p className="font-body text-[#718096] mb-8 max-w-xl mx-auto">
              Join the waitlist for early access to advanced features — private
              repos, team exports, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact"
                className="btn-primary px-8 py-3.5 rounded-xl font-display font-600 text-black"
              >
                <span className="flex items-center gap-2 justify-center">
                  Join Waitlist <ArrowRight size={16} />
                </span>
              </Link>
              <Link
                to="/about"
                className="px-8 py-3.5 rounded-xl border border-[#1E2A3A] font-display font-600 text-[#718096] hover:text-white hover:border-[#2D3748] transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Home Page ───────────────────────────────────────
export default function Home() {
  const [searchParams] = useSearchParams();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const resultRef = useRef(null);

  const loadingMessages = [
    "Connecting to GitHub API...",
    "Fetching commit history...",
    "Mapping contributor patterns...",
    "Analyzing code ownership...",
    "Running AI summary...",
    "Building your report...",
  ];

  const handleAnalyze = async (url) => {
    setLoading(true);
    setAnalysisData(null);
    try {
      // Call the backend API
      const repoName = url
        .replace("github.com/", "")
        .replace("https://github.com/", "");
      for (let i = 0; i < loadingMessages.length; i++) {
        setLoadingMsg(loadingMessages[i]);
        await new Promise((r) => setTimeout(r, 600));
      }
      const response = await fetch(
        `/api/analyze?repo=${encodeURIComponent(repoName)}`,
      );
      if (!response.ok) throw new Error("Analysis failed");
      const data = await response.json();
      setAnalysisData(data);
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Error analyzing repository. Please try again.");
    } finally {
      setLoading(false);
    }
    setTimeout(
      () => resultRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  useEffect(() => {
    const repo = searchParams.get("repo");
    if (repo) handleAnalyze(repo);
  }, []);

  return (
    <div>
      {!analysisData && !loading && (
        <>
          <HeroSection onAnalyze={handleAnalyze} />
          <FeaturesSection />
          <HowItWorks />
          <CTASection />
        </>
      )}

      {loading && (
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-2 border-[#1E2A3A]" />
              <div className="absolute inset-0 rounded-full border-2 border-t-[#00D4FF] animate-spin" />
              <div
                className="absolute inset-2 rounded-full border border-t-[#00FF88] animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Terminal size={20} className="text-[#00D4FF]" />
              </div>
            </div>
            <div className="font-mono text-sm text-[#00D4FF] mb-2">
              {loadingMsg}
            </div>
            <div className="font-body text-xs text-[#4A5568]">
              This takes a few seconds...
            </div>
            <div className="mt-6 w-48 h-1 bg-[#1E2A3A] rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00FF88] rounded-full animate-pulse"
                style={{ width: "60%" }}
              />
            </div>
          </div>
        </div>
      )}

      {analysisData && !loading && (
        <div ref={resultRef}>
          <AnalysisResult
            data={analysisData}
            onReset={() => setAnalysisData(null)}
          />
        </div>
      )}
    </div>
  );
}
