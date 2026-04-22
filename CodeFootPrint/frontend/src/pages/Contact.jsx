import { useState } from 'react'
import { Mail, MessageSquare, CheckCircle, ExternalLink, AtSign } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (form.message.trim().length < 10) e.message = 'Say a bit more (min 10 chars)'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setTimeout(() => setSubmitted(true), 300)
  }

  return (
    <div className="min-h-screen pt-24 pb-20">

      {/* Hero */}
      <section className="py-16 px-6 relative overflow-hidden hero-bg">
        <div className="absolute inset-0 grid-bg" />
        <div className="glow-blob w-72 h-72 bg-[#2ec18f] opacity-[0.07] top-0 left-1/3" />
        <div className="max-w-4xl mx-auto relative text-center">
          <div className="pill-badge inline-flex mb-6">
            <span className="font-body text-sm font-600 text-[#2ec18f]">Contact Us</span>
          </div>
          <h1 className="font-display font-800 text-5xl md:text-6xl text-[#0f2d24] mt-2 mb-4 leading-tight">
            Get in touch.
          </h1>
          <p className="font-body text-lg text-[#4a7a65] max-w-xl mx-auto">
            Have a question or want to learn more? Send us a message and we'll get back to you.
          </p>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 mt-10">
        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2ec18f] to-[#1aab7a] flex items-center justify-center shadow-lg">
              <MessageSquare size={18} className="text-white" />
            </div>
            <h2 className="font-display font-700 text-[#0f2d24] text-2xl">Send a message</h2>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-body text-xs text-[#4a7a65] font-600 mb-1.5">Your name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Rahul Sharma"
                  className={`w-full bg-[#f7fdf9] border rounded-xl px-4 py-3 font-body text-sm text-[#0f2d24] placeholder-[#b0d4c4] transition-colors focus:border-[#2ec18f] ${errors.name ? 'border-red-300' : 'border-[#d4ede5]'}`}
                />
                {errors.name && <p className="font-body text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block font-body text-xs text-[#4a7a65] font-600 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="rahul@example.com"
                  className={`w-full bg-[#f7fdf9] border rounded-xl px-4 py-3 font-body text-sm text-[#0f2d24] placeholder-[#b0d4c4] transition-colors focus:border-[#2ec18f] ${errors.email ? 'border-red-300' : 'border-[#d4ede5]'}`}
                />
                {errors.email && <p className="font-body text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block font-body text-xs text-[#4a7a65] font-600 mb-1.5">Message</label>
                <textarea
                  rows={6}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us what you need, what you'd like to see, or anything else..."
                  className={`w-full bg-[#f7fdf9] border rounded-xl px-4 py-3 font-body text-sm text-[#0f2d24] placeholder-[#b0d4c4] transition-colors focus:border-[#2ec18f] resize-none ${errors.message ? 'border-red-300' : 'border-[#d4ede5]'}`}
                />
                {errors.message && <p className="font-body text-xs text-red-500 mt-1">{errors.message}</p>}
              </div>

              <button type="submit" className="btn-teal w-full py-3.5 rounded-xl font-display font-600 text-sm flex items-center justify-center gap-2">
                <Mail size={16} /> Send Message
              </button>

              <p className="font-body text-xs text-[#b0d4c4] text-center">
                Usually reply within 24-48 hours. No spam ever.
              </p>
            </form>
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#f0fdf8] border border-[#c8e8dc] flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={30} className="text-[#2ec18f]" />
              </div>
              <h3 className="font-display font-700 text-[#0f2d24] text-2xl mb-2">Message sent!</h3>
              <p className="font-body text-sm text-[#4a7a65]">We'll get back to you at {form.email}</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }) }}
                className="mt-6 font-body text-sm text-[#9bc4b2] hover:text-[#2ec18f] transition-colors"
              >
                Send another →
              </button>
            </div>
          )}

          {/* Socials */}
          <div className="mt-6 pt-5 border-t border-[#e8f5ef] flex items-center justify-between">
            <span className="font-body text-xs text-[#9bc4b2]">Or reach us on</span>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 border border-[#d4ede5] rounded-xl text-[#9bc4b2] hover:text-[#2ec18f] hover:border-[#b6e8d6] transition-all bg-[#f7fdf9]">
                <ExternalLink size={15} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 border border-[#d4ede5] rounded-xl text-[#9bc4b2] hover:text-[#2ec18f] hover:border-[#b6e8d6] transition-all bg-[#f7fdf9]">
                <AtSign size={15} />
              </a>
              <a href="mailto:hello@codefootprint.dev" className="p-2 border border-[#d4ede5] rounded-xl text-[#9bc4b2] hover:text-[#2ec18f] hover:border-[#b6e8d6] transition-all bg-[#f7fdf9]">
                <Mail size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
