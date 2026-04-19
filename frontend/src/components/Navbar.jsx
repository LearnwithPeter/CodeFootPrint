import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ExternalLink, Menu, X, Footprints } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [repoInput, setRepoInput] = useState('')
  const [showAnalyzeBar, setShowAnalyzeBar] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAnalyze = () => {
    if (repoInput.trim()) {
      navigate('/?repo=' + encodeURIComponent(repoInput.trim()))
      setShowAnalyzeBar(false)
      setRepoInput('')
    }
  }

  <h1 className="text-red-500 text-5xl">TEST</h1>

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#080B10]/95 backdrop-blur-xl border-b border-[#1E2A3A]'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0A84FF] flex items-center justify-center">
                <Footprints size={16} className="text-black" />
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0A84FF] opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-300" />
            </div>
            <span className="font-display font-700 text-xl tracking-tight">
              <span className="text-white">code</span>
              <span className="text-[#00D4FF]">footprint</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg font-body text-sm transition-all duration-300 relative group ${
                  location.pathname === link.to
                    ? 'text-[#00D4FF] bg-[#00D4FF11]'
                    : 'text-[#718096] hover:text-[#E2E8F0] hover:bg-[#1E2A3A]'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                  location.pathname === link.to ? 'w-full bg-gradient-to-r from-[#00D4FF] to-[#00FF88]' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Right: Analyze Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg border border-[#1E2A3A] text-[#718096] hover:text-[#00D4FF] hover:border-[#00D4FF44] transition-all duration-200"
            >
              <ExternalLink size={18} />
            </a>
            <button
              onClick={() => setShowAnalyzeBar(!showAnalyzeBar)}
              className="btn-primary px-5 py-2 rounded-lg font-display font-600 text-sm text-black"
            >
              <span>Analyze Repo</span>
            </button>
          </div>

          {/* Mobile Menu */}
          <button
            className="md:hidden p-2 text-[#718096]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Analyze Input Bar */}
        {showAnalyzeBar && (
          <div className="border-t border-[#1E2A3A] bg-[#0D1117]/95 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 items-center">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[#00D4FF] text-sm">~/</span>
                <input
                  type="text"
                  placeholder="github.com/owner/repository"
                  value={repoInput}
                  onChange={e => setRepoInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                  className="w-full bg-[#111820] border border-[#1E2A3A] focus:border-[#00D4FF44] rounded-lg pl-10 pr-4 py-2.5 font-mono text-sm text-[#E2E8F0] placeholder-[#4A5568] transition-colors duration-200"
                  autoFocus
                />
              </div>
              <button
                onClick={handleAnalyze}
                className="btn-primary px-6 py-2.5 rounded-lg font-display text-sm text-black font-600 whitespace-nowrap"
              >
                <span>→ Run Analysis</span>
              </button>
              <button onClick={() => setShowAnalyzeBar(false)} className="text-[#4A5568] hover:text-[#718096]">
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Nav Dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#1E2A3A] bg-[#0D1117]/98 backdrop-blur-xl">
            <div className="px-6 py-4 flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg font-body text-sm transition-all ${
                    location.pathname === link.to
                      ? 'text-[#00D4FF] bg-[#00D4FF11]'
                      : 'text-[#718096] hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => { setMobileOpen(false); setShowAnalyzeBar(true) }}
                className="btn-primary mt-2 py-3 rounded-lg font-display text-sm text-black font-600"
              >
                <span>Analyze Repo</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
