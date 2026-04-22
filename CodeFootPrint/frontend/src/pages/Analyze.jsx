import { useState } from 'react'
import axios from 'axios'
import {
  GitBranch, GitCommit, Users, Code2, BarChart3, Eye,
  Shield, Activity, Star, ChevronRight, FileCode,
  Search, ArrowRight, Zap
} from 'lucide-react'

const LOADING_STEPS = [
  'Connecting to Backend...',
  'Fetching commit history...',
  'Analyzing code diffs...',
  'Mapping file ownership...',
  'Generating AI report...',
  'Finalizing analysis...'
]

// ─── Loading Screen ───────────────────────────────────────
function LoadingScreen({ repoName, step }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="glass-card rounded-3xl p-12 text-center w-full max-w-md">

        {/* Spinner rings */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-[#e8f5ef]" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#2ec18f] animate-spin" />
          <div
            className="absolute inset-2 rounded-full border-2 border-t-[#1aab7a] animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.4s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <GitBranch size={26} className="text-[#2ec18f]" />
          </div>
        </div>

        {/* Repo pill */}
        <div className="pill-badge inline-flex mb-5">
          <GitBranch size={13} className="text-[#2ec18f]" />
          <span className="font-body text-sm font-600 text-[#0f2d24]">{repoName}</span>
        </div>

        {/* Current step text */}
        <p className="font-display font-600 text-[#0f2d24] text-lg mb-1">
          {LOADING_STEPS[step] ?? 'Finishing up…'}
        </p>
        <p className="font-body text-sm text-[#9bc4b2] mb-8">This takes a few seconds…</p>

        {/* Step dots */}
        <div className="flex justify-center gap-2 mb-5">
          {LOADING_STEPS.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-300 ${
                i < step
                  ? 'w-2 h-2 bg-[#2ec18f]'
                  : i === step
                  ? 'w-3 h-3 bg-[#2ec18f] scale-110'
                  : 'w-2 h-2 bg-[#d4ede5]'
              }`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-[#e8f5ef] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2ec18f] to-[#1aab7a] rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / LOADING_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Analysis Result ──────────────────────────────────────
function AnalysisResult({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <section className="min-h-screen pt-6 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Repo header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#2ec18f] animate-pulse" />
              <span className="font-body text-xs text-[#2ec18f] font-600 uppercase tracking-widest">
                Analysis Complete
              </span>
            </div>
            <h2 className="font-display font-800 text-3xl md:text-4xl text-[#0f2d24] flex items-center gap-3">
              <span className="text-[#9bc4b2]">/</span>
              {data.repoUrl?.replace('https://github.com/', '')?.replace('github.com/', '')}
            </h2>
            <div className="flex items-center gap-4 mt-2 font-body text-sm text-[#4a7a65] flex-wrap">
              <span className="flex items-center gap-1">
                <Users size={12} className="text-[#f6ad55]" />
                User: {data.username}
              </span>
              <span className="flex items-center gap-1">
                <GitCommit size={12} />
                {data.totalCommits?.toLocaleString()} commits
              </span>
            </div>
          </div>
          <button
            onClick={onReset}
            className="btn-outline flex items-center gap-2 px-5 py-2.5 font-body text-sm font-500 self-start"
          >
            <ArrowRight size={14} className="rotate-180" /> New Analysis
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['overview', 'ai-summary'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-body text-sm font-500 transition-all capitalize ${
                activeTab === tab
                  ? 'bg-[#0f2d24] text-white shadow-lg'
                  : 'glass-card text-[#4a7a65] hover:text-[#0f2d24]'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Impact Card */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-700 text-[#0f2d24] text-lg mb-6 flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#2ec18f]" /> Developer Impact
                </h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-display text-xl font-700 text-white shadow-lg bg-[#2ec18f]">
                    {data.username ? data.username.slice(0,2).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="font-display font-600 text-xl text-[#0f2d24]">{data.username}</div>
                    <div className="font-body text-sm text-[#9bc4b2]">{data.stats?.uniqueFilesTouched || 0} files touched</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  {[
                    { label: 'Lines Added',  value: `+${(data.stats?.totalLinesAdded || 0).toLocaleString()}`, color: 'text-green-600' },
                    { label: 'Lines Removed',value: `-${(data.stats?.totalLinesRemoved || 0).toLocaleString()}`, color: 'text-red-500' },
                    { label: 'Diffs Analyzed', value: (data.totalDiffsAnalyzed || 0).toLocaleString(), color: 'text-[#0f2d24]' },
                    { label: 'Functions',   value: (data.stats?.functionsWritten || 0).toLocaleString(), color: 'text-[#0f2d24]' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-[#f7fdf9] rounded-xl py-3 border border-[#d4ede5]">
                      <div className={`font-display text-lg font-700 ${color}`}>{value}</div>
                      <div className="font-body text-xs text-[#9bc4b2] mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Files Analyzed */}
              <div className="glass-card rounded-2xl p-6 flex flex-col max-h-[350px]">
                <h3 className="font-display font-700 text-[#0f2d24] mb-5 flex items-center gap-2">
                  <FileCode size={16} className="text-[#2ec18f]" /> Top Files Touched
                </h3>
                <div className="overflow-y-auto pr-2 space-y-2 flex-1 scrollbar-thin">
                  {data.filesAnalyzed && data.filesAnalyzed.length > 0 ? (
                    data.filesAnalyzed.map((f, i) => (
                      <div key={i} className="font-body text-sm text-[#4a7a65] py-1.5 flex items-start gap-2 border-b border-[#e8f5ef] last:border-0">
                        <ChevronRight size={14} className="text-[#2ec18f] mt-0.5 shrink-0" />
                        <span className="break-all">{f}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-[#9bc4b2] italic">No files available</div>
                  )}
                </div>
              </div>
              
            </div>
          </div>
        )}

        {/* ── AI Summary Tab ── */}
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
                  <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                  <span className="font-body text-xs text-[#2ec18f] font-600">Live</span>
                </div>
              </div>

              <div className="font-body text-[#4a7a65] leading-relaxed whitespace-pre-wrap">
                {data.report || "No summary generated."}
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  )
}

// ─── Input Screen ─────────────────────────────────────────
function InputScreen({ onAnalyze }) {
  const [username, setUsername] = useState('')
  const [inputVal, setInputVal] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!inputVal.trim()) {
      setError('Please enter a GitHub repository URL or owner/repo')
      return
    }
    if (!username.trim()) {
      setError('Please enter a GitHub username')
      return
    }
    setError('')
    onAnalyze(inputVal.trim(), username.trim())
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl">

        {/* Heading */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2ec18f] to-[#1aab7a] flex items-center justify-center mx-auto mb-5 shadow-[0_8px_24px_rgba(46,193,143,0.32)]">
            <GitBranch size={30} className="text-white" />
          </div>
          <h1 className="font-display font-800 text-4xl md:text-5xl text-[#0f2d24] mb-3 leading-tight">
            Analyze any<br />
            <span className="text-[#2ec18f]">GitHub Repo</span>
          </h1>
          <p className="font-body text-[#4a7a65] text-lg max-w-md mx-auto">
            Get a full breakdown of a developer's contribution, ownership, and an AI-powered
            summary — instantly.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8">

          {/* Username */}
          <label className="block font-body text-sm font-600 text-[#4a7a65] mb-2">
            GitHub Username
          </label>
          <div className="flex rounded-2xl overflow-hidden border bg-[#f7fdf9] border-[#c8e8dc] mb-5">
            <div className="flex items-center px-4 border-r border-[#e0f2ec]">
              <Users size={16} className="text-[#2ec18f]" />
            </div>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
              placeholder="e.g. harshmalhotra"
              className="flex-1 bg-transparent px-4 py-4 font-body text-sm text-[#0f2d24] placeholder-[#b0d4c4] focus:outline-none"
            />
          </div>

          <label className="block font-body text-sm font-600 text-[#4a7a65] mb-2">
            GitHub Repository URL
          </label>
          {/* Input row */}
          <div
            className={`flex rounded-2xl overflow-hidden border bg-[#f7fdf9] transition-all duration-300
              focus-within:shadow-[0_0_0_3px_rgba(46,193,143,0.13)]
              ${error && !inputVal ? 'border-red-300' : 'border-[#c8e8dc] focus-within:border-[#2ec18f]'}`}
          >
            <div className="flex items-center px-4 border-r border-[#e0f2ec]">
              <Search size={16} className="text-[#2ec18f]" />
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={e => { setInputVal(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g.  github.com/facebook/react   or   vercel/next.js"
              className="flex-1 bg-transparent px-4 py-4 font-body text-sm text-[#0f2d24] placeholder-[#b0d4c4] focus:outline-none"
            />
          </div>

          {error && (
            <p className="font-body text-xs text-red-500 mt-2 flex items-center gap-1">
              ⚠ {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="btn-teal w-full py-4 rounded-2xl font-display font-600 text-base flex items-center justify-center gap-2 mt-5"
          >
            <Zap size={18} /> Analyze Repository
          </button>

          {/* Quick-pick examples */}
          <div className="mt-6 pt-5 border-t border-[#e8f5ef]">
            <p className="font-body text-xs text-[#9bc4b2] mb-3 text-center">Or try a popular repo:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['facebook/react', 'vercel/next.js', 'tailwindlabs/tailwindcss', 'microsoft/vscode'].map(repo => (
                <button
                  key={repo}
                  onClick={() => { setInputVal(repo); setError('') }}
                  className="font-body text-xs px-3.5 py-1.5 rounded-full bg-[#f0fdf8] border border-[#c8e8dc] text-[#4a7a65] hover:text-[#2ec18f] hover:border-[#2ec18f] transition-all"
                >
                  {repo}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature hints */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { icon: Users,    label: 'User Stats' },
            { icon: BarChart3, label: 'Impact Data' },
            { icon: Eye,      label: 'AI Summary'       },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="glass-card rounded-xl p-3 text-center">
              <Icon size={16} className="text-[#2ec18f] mx-auto mb-1" />
              <span className="font-body text-xs text-[#4a7a65] font-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Analyze Page ────────────────────────────────────
export default function Analyze() {
  const [phase, setPhase]         = useState('input')   // 'input' | 'loading' | 'result' | 'error'
  const [loadingStep, setLoadingStep] = useState(0)
  const [result, setResult]       = useState(null)
  const [repoName, setRepoName]   = useState('')
  const [apiError, setApiError]   = useState('')

  const handleAnalyze = async (raw, username) => {
    const cleaned = raw
      .replace('https://github.com/', '')
      .replace('http://github.com/', '')
      .replace('github.com/', '')
      .trim()

    setRepoName(cleaned)
    setPhase('loading')
    setLoadingStep(0)
    setApiError('')

    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % LOADING_STEPS.length;
      setLoadingStep(step);
    }, 2500);

    try {
      const response = await axios.post('/api/analyze', {
        repoUrl: cleaned,
        username: username
      });
      
      clearInterval(interval);
      setLoadingStep(LOADING_STEPS.length - 1);
      
      // Delay slightly for effect
      await new Promise(r => setTimeout(r, 500));
      
      setResult(response.data);
      setPhase('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      clearInterval(interval);
      console.error("Analysis Error:", err);
      setApiError(err.response?.data?.message || err.message || "Failed to connect to backend");
      setPhase('error');
    }
  }

  const handleReset = () => {
    setPhase('input')
    setResult(null)
    setRepoName('')
    setLoadingStep(0)
    setApiError('')
  }

  return (
    <div className="min-h-screen pt-20 hero-bg relative">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="relative z-10">
        {phase === 'input'   && <InputScreen   onAnalyze={handleAnalyze} />}
        {phase === 'loading' && <LoadingScreen repoName={repoName} step={loadingStep} />}
        {phase === 'result'  && <AnalysisResult data={result} onReset={handleReset} />}
        {phase === 'error'   && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
             <div className="glass-card rounded-3xl p-12 w-full max-w-md">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Shield size={32} className="text-red-500" />
                </div>
                <h2 className="font-display font-700 text-2xl text-[#0f2d24] mb-2">Analysis Failed</h2>
                <p className="font-body text-[#4a7a65] mb-6">{apiError}</p>
                <button
                  onClick={handleReset}
                  className="btn-outline px-6 py-2 rounded-xl font-body text-sm font-500"
                >
                  Try Again
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
