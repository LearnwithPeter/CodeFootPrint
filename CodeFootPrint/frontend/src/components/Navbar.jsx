import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, GitBranch } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const navLinks = [
    { to: '/',        label: 'Home'           },
    { to: '/about',   label: 'About'          },
    { to: '/contact', label: 'For Recruiters' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-xl shadow-[0_2px_24px_rgba(46,193,143,0.10)]'
        : 'bg-white/70 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2ec18f] to-[#1aab7a] flex items-center justify-center shadow-[0_4px_14px_rgba(46,193,143,0.35)]">
            <GitBranch size={17} className="text-white" />
          </div>
          <span className="font-display font-700 text-xl tracking-tight text-[#0f2d24]">
            code<span className="text-[#2ec18f]">footprint</span>
          </span>
        </Link>

        {/* Desktop nav pills */}
        <div className="hidden md:flex items-center gap-1 bg-[#f0f9f5] rounded-full px-2 py-1.5 border border-[#e0f2ec]">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-5 py-1.5 rounded-full font-body text-sm font-500 transition-all duration-200 ${
                location.pathname === link.to
                  ? 'bg-white text-[#0f2d24] shadow-sm font-600'
                  : 'text-[#4a7a65] hover:text-[#0f2d24]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Analyze Repo button → /analyze page */}
        <div className="hidden md:flex">
          <Link
            to="/analyze"
            className={`btn-dark px-5 py-2 font-display font-600 text-sm ${
              location.pathname === '/analyze' ? 'opacity-70 pointer-events-none' : ''
            }`}
          >
            Analyze Repo
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[#4a7a65] rounded-lg hover:bg-[#f0f9f5]"
          onClick={() => setMobileOpen(v => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#e8f5ef] bg-white/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-3 rounded-xl font-body text-sm transition-all ${
                  location.pathname === link.to
                    ? 'text-[#2ec18f] bg-[#f0fdf8] font-600'
                    : 'text-[#4a7a65] hover:text-[#0f2d24] hover:bg-[#f7fdf9]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/analyze"
              className="btn-dark mt-1 py-3 rounded-xl font-display text-sm font-600 text-center"
            >
              Analyze Repo
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
