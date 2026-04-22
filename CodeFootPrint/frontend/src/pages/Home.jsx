import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  GitCommit, Users, Code2, TrendingUp, Star, GitBranch,
  Zap, ChevronRight, BarChart3, Eye, Shield,
  ArrowRight, Activity, FileCode, CheckCircle, Search
} from 'lucide-react'

const MOCK_RESULT = {
  repo: 'facebook/react',
  stars: 224000,
  totalCommits: 18472,
  contributors: [
    { login: 'gaearon', name: 'Dan Abramov', avatar: 'DA', commits: 3241, linesAdded: 128430, linesRemoved: 87234, filesChanged: 892, primaryRole: 'Core Architecture', topFiles: ['packages/react-reconciler/', 'packages/react/'], color: '#2ec18f', percent: 34 },
    { login: 'acdlite', name: 'Andrew Clark', avatar: 'AC', commits: 2180, linesAdded: 97200, linesRemoved: 64100, filesChanged: 643, primaryRole: 'Concurrent Features', topFiles: ['packages/react-dom/', 'packages/scheduler/'], color: '#1aab7a', percent: 24 },
    { login: 'sebmarkbage', name: 'Sebastian Markbåge', avatar: 'SM', commits: 1542, linesAdded: 73400, linesRemoved: 49800, filesChanged: 421, primaryRole: 'React Fiber', topFiles: ['packages/react-reconciler/'], color: '#0f8a5f', percent: 18 },
    { login: 'bvaughn', name: 'Brian Vaughn', avatar: 'BV', commits: 987, linesAdded: 41200, linesRemoved: 28900, filesChanged: 312, primaryRole: 'DevTools & Profiler', topFiles: ['packages/react-devtools/'], color: '#38b2ac', percent: 12 },
    { login: 'rickhanlonii', name: 'Rick Hanlon', avatar: 'RH', commits: 643, linesAdded: 29800, linesRemoved: 18700, filesChanged: 218, primaryRole: 'Documentation', topFiles: ['docs/', 'packages/react/'], color: '#4299e1', percent: 8 },
    { login: 'lunaruan', name: 'Luna Ruan', avatar: 'LR', commits: 389, linesAdded: 17400, linesRemoved: 11200, filesChanged: 143, primaryRole: 'Testing & CI', topFiles: ['scripts/', '__tests__/'], color: '#68d391', percent: 4 },
  ],
  languages: [
    { name: 'JavaScript', percent: 68, color: '#f6ad55' },
    { name: 'TypeScript', percent: 22, color: '#4299e1' },
    { name: 'Flow', percent: 7, color: '#e8bd36' },
    { name: 'CSS', percent: 3, color: '#2ec18f' },
  ],
  aiSummary: `The facebook/react repository shows a highly concentrated development model with 6 core contributors driving 100% of meaningful commits. Dan Abramov leads as the primary architect, owning reconciler and core package changes. Andrew Clark focuses on concurrent rendering features and the react-dom surface. Sebastian Markbåge invented and maintains the Fiber architecture. Brian Vaughn single-handedly owns DevTools. The codebase is written primarily in JavaScript (68%) with TypeScript adoption growing in newer packages. Overall team velocity is high with strong ownership boundaries — minimal code duplication across contributor domains.`
}

// ─── Hero ────────────────────────────────────────────────
function HeroSection({ onAnalyze }) {
  const [inputVal, setInputVal] = useState('')
  const examples = ['facebook/react','vercel/next.js','tailwindlabs/tailwindcss','microsoft/vscode']
  const [exIdx, setExIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setExIdx(i => (i + 1) % examples.length), 2800)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 hero-bg">
      <div className="absolute inset-0 grid-bg" />
      {/* Glow blobs */}
      <div className="glow-blob w-[500px] h-[500px] bg-[#2ec18f] opacity-[0.08] top-1/2 left-1/4 -translate-y-1/2" />
      <div className="glow-blob w-[400px] h-[400px] bg-[#93c5fd] opacity-[0.09] top-1/3 right-1/4" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center text-center">

        {/* Badge */}
        <div className="pill-badge mb-8 animate-pulse">
          <span className="pulse-dot" />
          <span className="font-body text-sm font-600 text-[#0f2d24]">AI Powered Repo Analysis</span>
        </div>

        {/* Floating left circle */}
        <div className="hidden lg:block absolute left-[-80px] xl:left-[-160px] xl:left- top-[40%] -translate-y-[60%] float-anim">
          <div className="w-52 h-52 rounded-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.18)] border-4 border-white">
            <div className="w-full h-full bg-gradient-to-br from-[#c2e8d8] to-[#2ec18f] flex items-center justify-center">
              <GitBranch size={60} className="text-white opacity-80" />
            </div>
          </div>
          <div className="mt-3 glass-card rounded-2xl px-4 py-2.5 text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2ec18f]" />
              <span className="font-body text-xs font-600 text-[#0f2d24]">AI-Powered Repo Mastery</span>
            </div>
          </div>
        </div>

        {/* Floating right circle */}
        <div className="hidden lg:block absolute right-[-80px] xl:right-[-190px] xl:right-12 top-[40%] -translate-y-[55%] float-anim-slow">
          <div className="w-52 h-52 rounded-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-4 border-white">
            <div className="w-full h-full bg-gradient-to-br from-[#bfdbfe] to-[#4299e1] flex items-center justify-center">
              <Code2 size={60} className="text-white opacity-80" />
            </div>
          </div>
          <div className="mt-3 stat-bubble px-4 py-2.5 ml-auto text-right">
            <div className="font-body text-xs font-600 text-[#0f2d24]">Code Breakdown 100% Visibility</div>
          </div>
        </div>

        {/* Headline */}
        {/* <h1 className="font-display font-800 text-5xl md:text-7xl leading-[1.07] tracking-tight mb-6 max-w-4xl">
          <span className="text-[#0f2d24]">Every Line Of Code</span>{' '}
          <br />
          <span className="text-[#2ec18f]">Tells a Story</span>
          <br />
          <span className="text-[#0f2d24]">We Decode It</span>
        </h1> */}

        <h1 className="text-5xl font-bold leading-tight text-black">
        Code doesn’t lie 
        <br />
        It tells a{" "}
        <span className="text-green-500">story</span>.{" "}
        We make it{" "}
        <span className="text-green-500">visible</span>.
        </h1>
          <br />
        <p className="font-body text-lg md:text-xl text-[#4a7a65] max-w-2xl mx-auto mb-4 leading-relaxed">
          Drop any GitHub repository link. Get a complete breakdown of who built what — commits, ownership, code patterns, and an AI summary of every contributor's impact.
        </p>

        

{/* Analyze Button Only */}
<div className="w-full flex flex-col items-center mb-12">
  <br />
  <button
    onClick={() => onAnalyze('facebook/react')}
    className="btn-dark px-12 py-5 text-lg font-display font-600 rounded-xl flex items-center gap-3 shadow-[0_10px_30px_rgba(46,193,143,0.25)] hover:scale-105 transition-all duration-300"
  >
    <Zap size={20} />
    Analysis Demo
    
  </button>

  <p className="mt-4 font-body text-sm text-[#6b9c8c] text-center max-w-md">
    Click to explore repository insights, contributor activity, and code patterns instantly.
  </p>

</div>

        <br />

  
      </div>
    </section>
  )
}

// ─── Analysis Result ──────────────────────────────────────
function AnalysisResult({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedContrib, setSelectedContrib] = useState(null)
  const [animKey, setAnimKey] = useState(0)
  useEffect(() => { setAnimKey(k => k + 1) }, [data])

  return (
    <section className="min-h-screen pt-28 pb-20 px-6 hero-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="pulse-dot" />
              <span className="font-body text-sm text-[#2ec18f] font-600">Analysis Complete</span>
            </div>
            <h2 className="font-display font-800 text-3xl md:text-4xl text-[#0f2d24] flex items-center gap-2">
              <span className="text-[#9bc4b2]">/</span>{data.repo}
            </h2>
            <div className="flex items-center gap-4 mt-2 font-body text-sm text-[#4a7a65]">
              <span className="flex items-center gap-1"><Star size={12} className="text-[#f6ad55]" />{data.stars.toLocaleString()} stars</span>
              <span className="flex items-center gap-1"><GitCommit size={12} />{data.totalCommits.toLocaleString()} commits</span>
              <span className="flex items-center gap-1"><Users size={12} />{data.contributors.length} contributors</span>
            </div>
          </div>
          <button onClick={onReset} className="btn-outline px-5 py-2.5 font-body text-sm font-500 flex items-center gap-2">
            <ArrowRight size={14} className="rotate-180" /> New Analysis
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {['overview','contributors','ai-summary'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-body text-sm font-500 transition-all capitalize ${
                activeTab === tab
                  ? 'bg-[#0f2d24] text-white shadow-lg'
                  : 'glass-card text-[#4a7a65] hover:text-[#0f2d24]'
              }`}
            >
              {tab.replace('-',' ')}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-700 text-[#0f2d24] text-lg mb-6 flex items-center gap-2">
                <BarChart3 size={18} className="text-[#2ec18f]" /> Contribution Breakdown
              </h3>
              <div className="space-y-5">
                {data.contributors.map((c, i) => (
                  <div key={c.login} className="cursor-pointer group" onClick={() => { setSelectedContrib(c); setActiveTab('contributors') }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-display text-xs font-700 text-white" style={{ background: c.color }}>
                          {c.avatar}
                        </div>
                        <div>
                          <span className="font-body text-sm font-600 text-[#0f2d24] group-hover:text-[#2ec18f] transition-colors">{c.name}</span>
                          <span className="font-body text-xs text-[#9bc4b2] ml-2">@{c.login}</span>
                        </div>
                        <span className="hidden md:block font-body text-xs px-2.5 py-1 rounded-full bg-[#f0fdf8] text-[#4a7a65] border border-[#c8e8dc]">{c.primaryRole}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-sm font-700" style={{ color: c.color }}>{c.percent}%</span>
                        <div className="font-body text-xs text-[#9bc4b2]">{c.commits.toLocaleString()} commits</div>
                      </div>
                    </div>
                    <div className="h-2 bg-[#e8f5ef] rounded-full overflow-hidden">
                      <div key={animKey} className="h-full rounded-full contribution-bar" style={{ width: `${c.percent}%`, background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-700 text-[#0f2d24] mb-5 flex items-center gap-2">
                  <Code2 size={16} className="text-[#2ec18f]" /> Languages
                </h3>
                {data.languages.map(l => (
                  <div key={l.name} className="mb-4">
                    <div className="flex justify-between mb-1.5">
                      <span className="font-body text-sm text-[#4a7a65] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />{l.name}
                      </span>
                      <span className="font-display text-sm font-700" style={{ color: l.color }}>{l.percent}%</span>
                    </div>
                    <div className="h-1.5 bg-[#e8f5ef] rounded-full">
                      <div key={animKey} className="h-full rounded-full contribution-bar" style={{ width: `${l.percent}%`, background: l.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-700 text-[#0f2d24] mb-5 flex items-center gap-2">
                  <Activity size={16} className="text-[#2ec18f]" /> Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Avg commits/contributor', value: Math.round(data.totalCommits / data.contributors.length).toLocaleString(), icon: GitCommit },
                    { label: 'Top contributor', value: data.contributors[0].name.split(' ')[0], icon: Star },
                    { label: 'Total contributors', value: data.contributors.length, icon: Users },
                    { label: 'Repo health', value: 'Active', icon: Shield, teal: true },
                  ].map(({ label, value, icon: Icon, teal }) => (
                    <div key={label} className="bg-[#f7fdf9] rounded-xl p-4 border border-[#d4ede5]">
                      <Icon size={14} className={teal ? 'text-[#2ec18f] mb-2' : 'text-[#9bc4b2] mb-2'} />
                      <div className={`font-display text-sm font-700 ${teal ? 'text-[#2ec18f]' : 'text-[#0f2d24]'}`}>{value}</div>
                      <div className="font-body text-xs text-[#9bc4b2] mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contributors */}
        {activeTab === 'contributors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.contributors.map(c => (
              <div
                key={c.login}
                onClick={() => setSelectedContrib(selectedContrib?.login === c.login ? null : c)}
                className={`card-hover cursor-pointer glass-card rounded-2xl p-5 transition-all duration-300 ${
                  selectedContrib?.login === c.login ? 'ring-2 ring-[#2ec18f]/40' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-display text-sm font-700 text-white shadow-lg" style={{ background: c.color }}>
                      {c.avatar}
                    </div>
                    <div>
                      <div className="font-display font-600 text-[#0f2d24]">{c.name}</div>
                      <div className="font-body text-xs text-[#9bc4b2]">@{c.login}</div>
                    </div>
                  </div>
                  <span className="font-display text-sm font-700" style={{ color: c.color }}>{c.percent}%</span>
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-body font-500 mb-4" style={{ background: `${c.color}18`, color: c.color, border: `1px solid ${c.color}30` }}>
                  {c.primaryRole}
                </span>
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  {[
                    { label: 'Commits', value: c.commits.toLocaleString() },
                    { label: 'Lines+', value: (c.linesAdded/1000).toFixed(1)+'k' },
                    { label: 'Files', value: c.filesChanged },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[#f7fdf9] rounded-xl py-2.5 border border-[#d4ede5]">
                      <div className="font-display text-sm font-700 text-[#0f2d24]">{value}</div>
                      <div className="font-body text-xs text-[#9bc4b2]">{label}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-body text-xs text-[#9bc4b2] mb-2 flex items-center gap-1"><FileCode size={10} /> Top areas</div>
                  {c.topFiles.map(f => (
                    <div key={f} className="font-body text-xs text-[#4a7a65] py-0.5 flex items-center gap-1">
                      <ChevronRight size={10} style={{ color: c.color }} />{f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Summary */}
        {activeTab === 'ai-summary' && (
          <div className="max-w-3xl">
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#2ec18f] to-transparent opacity-40" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2ec18f] to-[#1aab7a] flex items-center justify-center shadow-lg">
                  <Eye size={16} className="text-white" />
                </div>
                <div>
                  <div className="font-display font-700 text-[#0f2d24]">AI Analysis Summary</div>
                  <div className="font-body text-xs text-[#9bc4b2]">Generated by CodeFootprint AI</div>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0fdf8] border border-[#c8e8dc]">
                  <span className="pulse-dot" style={{ width:6, height:6 }} />
                  <span className="font-body text-xs text-[#2ec18f] font-600">Live</span>
                </div>
              </div>
              <p className="font-body text-[#4a7a65] leading-relaxed">{data.aiSummary}</p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.contributors.slice(0,3).map(c => (
                  <div key={c.login} className="bg-[#f7fdf9] rounded-xl p-4 border border-[#d4ede5]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center font-display text-xs text-white" style={{ background: c.color }}>{c.avatar[0]}</div>
                      <span className="font-body text-sm text-[#0f2d24] font-500">{c.name.split(' ')[0]}</span>
                    </div>
                    <div className="font-body text-xs text-[#9bc4b2]">{c.primaryRole}</div>
                    <div className="mt-1 font-display text-sm font-700" style={{ color: c.color }}>{c.percent}% ownership</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: GitCommit, title: 'Commit Archaeology', desc: 'Deep-dive into every commit — who wrote what, when, and why. Full timeline of team activity.', color: '#2ec18f' },
    { icon: BarChart3, title: 'Ownership Mapping', desc: 'See exactly which files, folders, and features belong to each contributor. No ambiguity.', color: '#1aab7a' },
    { icon: Eye, title: 'AI-Powered Summary', desc: 'Get a human-readable summary of each person\'s role and contribution style, powered by AI.', color: '#4299e1' },
    { icon: TrendingUp, title: 'Velocity Insights', desc: 'Track contribution velocity over time. Spot bottlenecks and silent contributors.', color: '#38b2ac' },
    { icon: Code2, title: 'Language Breakdown', desc: 'Understand the tech stack per contributor. Who owns the TypeScript? Who writes the CSS?', color: '#68d391' },
    { icon: Shield, title: 'Zero Setup', desc: 'Just paste a GitHub URL. No API keys, no OAuth, no repositories to clone. Instant results.', color: '#0f8a5f' },
  ]

  return (
    <section className="py-24 px-6 section-alt relative">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="pill-badge inline-flex mb-4">
            <span className="font-body text-sm font-600 text-[#2ec18f]">What we analyze</span>
          </div>
          <h2 className="font-display font-800 text-4xl md:text-5xl text-[#0f2d24] mt-2">
            Complete team visibility
          </h2>
          <p className="font-body text-[#4a7a65] mt-4 max-w-xl mx-auto text-lg">
            From a single GitHub link to a full picture of your team's work — in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card-hover group glass-card rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-t-2xl" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
              <div className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center" style={{ background: `${color}18`, border: `1.5px solid ${color}30` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="font-display font-700 text-[#0f2d24] text-lg mb-2">{title}</h3>
              <p className="font-body text-sm text-[#4a7a65] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────
// function HowItWorks() {
//   const steps = [
//     { num: '01', title: 'Paste the repo URL', desc: 'Drop any public GitHub repository link into the analyzer.', note: 'github.com/owner/repository' },
//     { num: '02', title: 'We fetch everything', desc: 'CodeFootprint pulls commits, diffs, file trees, and author data via the GitHub API.', note: 'Fetching 18,472 commits...' },
//     { num: '03', title: 'AI does the work', desc: 'Our AI maps ownership, detects patterns, and writes plain-English summaries for each contributor.', note: 'Analyzing contributor patterns...' },
//     { num: '04', title: 'Read the report', desc: 'Get a detailed, interactive breakdown — ready to share with your team or manager.', note: 'Report ready ✓' },
//   ]

//   return (
//     <section className="py-24 px-6 relative hero-bg">
//       <div className="absolute inset-0 grid-bg" />
//       <div className="max-w-5xl mx-auto relative">
//         <div className="text-center mb-16">
//           <div className="pill-badge inline-flex mb-4">
//             <span className="font-body text-sm font-600 text-[#2ec18f]">Process</span>
//           </div>
//           <h2 className="font-display font-800 text-4xl md:text-5xl text-[#0f2d24] mt-2">How it works</h2>
//         </div>
//         <div className="space-y-8">
//           {steps.map((step, i) => (
//             <div key={step.num} className="flex gap-5 items-start">
//               <div className="step-dot mt-1">{i + 1}</div>
//               <div className="flex-1 glass-card rounded-2xl p-5 card-hover">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
//                   <div>
//                     <div className="font-body text-xs text-[#9bc4b2] font-500 mb-1">{step.num}</div>
//                     <h3 className="font-display font-700 text-[#0f2d24] text-lg mb-1">{step.title}</h3>
//                     <p className="font-body text-sm text-[#4a7a65] leading-relaxed">{step.desc}</p>
//                   </div>
//                   <div className="flex-shrink-0 bg-[#f0fdf8] border border-[#c8e8dc] rounded-xl px-4 py-2.5 text-center min-w-[180px]">
//                     <span className="font-body text-xs text-[#2ec18f] font-500">{step.note}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

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
      desc: "CodeFootprint pulls commits, diffs, file trees, and contributor data via GitHub API.",
      code: "> fetching commits...",
    },
    {
      num: "03",
      title: "AI does the work",
      desc: "We analyze ownership, detect patterns, and generate clear contributor insights.",
      code: "> analyzing patterns...",
    },
    {
      num: "04",
      title: "View insights",
      desc: "Get a complete breakdown of contributions, structure, and activity.",
      code: "> report ready ✓",
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#f8fbfa]">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-green-500 tracking-widest uppercase">
            Process
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-black mt-3">
            How it works
          </h2>
        </div>

        <div className="relative">

          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-green-200 via-green-400 to-green-200" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >

                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-6 w-4 h-4 rounded-full border-2 border-green-500 bg-white z-10 shadow" />

                {/* Content box */}
                <div
                  className={`md:w-[calc(50%-2rem)] ml-12 md:ml-0 ${
                    i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"
                  }`}
                >
                  <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                    <div className="font-mono text-xs text-green-500 mb-2">
                      {step.num}
                    </div>
                    <h3 className="font-semibold text-black text-xl mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Code box */}
                <div
                  className={`md:w-[calc(50%-2rem)] ml-12 md:ml-0 ${
                    i % 2 === 0 ? "md:pl-8" : "md:pr-8 md:text-right"
                  }`}
                >
                  <div className="bg-[#0f172a] rounded-lg px-4 py-3 inline-block shadow-md">
                    <span className="font-mono text-xs text-green-400">
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

// ─── CTA ──────────────────────────────────────────────────


// ─── Main ─────────────────────────────────────────────────
export default function Home() {
  const [searchParams] = useSearchParams()
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const resultRef = useRef(null)

  const loadingMessages = [
    'Connecting to GitHub API...','Fetching commit history...','Mapping contributor patterns...',
    'Analyzing code ownership...','Running AI summary...','Building your report...',
  ]

  const handleAnalyze = async (url) => {
    setLoading(true); setAnalysisData(null)
    for (let i = 0; i < loadingMessages.length; i++) {
      setLoadingMsg(loadingMessages[i])
      await new Promise(r => setTimeout(r, 600))
    }
    setAnalysisData({ ...MOCK_RESULT, repo: url.replace('github.com/','').replace('https://github.com/','') || MOCK_RESULT.repo })
    setLoading(false)
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  useEffect(() => {
    const repo = searchParams.get('repo')
    if (repo) handleAnalyze(repo)
  }, [])

  return (
    <div>
      {!analysisData && !loading && (
        <>
          <HeroSection onAnalyze={handleAnalyze} />
          <FeaturesSection />
          <HowItWorks />
        
        </>
      )}

      {loading && (
        <div className="min-h-screen flex items-center justify-center pt-20 hero-bg">
          <div className="glass-card rounded-3xl p-12 text-center max-w-sm mx-4">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-[#e8f5ef]" />
              <div className="absolute inset-0 rounded-full border-2 border-t-[#2ec18f] animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-t-[#1aab7a] animate-spin" style={{ animationDirection:'reverse', animationDuration:'1.5s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <GitBranch size={22} className="text-[#2ec18f]" />
              </div>
            </div>
            <div className="font-display font-600 text-[#0f2d24] mb-1">{loadingMsg}</div>
            <div className="font-body text-sm text-[#9bc4b2]">This takes a few seconds...</div>
            <div className="mt-6 w-48 h-1.5 bg-[#e8f5ef] rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#2ec18f] to-[#1aab7a] rounded-full animate-pulse" style={{ width: '65%' }} />
            </div>
          </div>
        </div>
      )}

      {analysisData && !loading && (
        <div ref={resultRef}>
          <AnalysisResult data={analysisData} onReset={() => setAnalysisData(null)} />
        </div>
      )}
    </div>
  )
}
