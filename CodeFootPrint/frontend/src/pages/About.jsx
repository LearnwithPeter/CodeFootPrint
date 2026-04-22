import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Code2, Zap, Users, Target, ArrowRight, GitCommit, BarChart3, Shield, Globe } from 'lucide-react'

const TEAM = [
  {
    name: 'Earnest Peter',
    role: 'AI Integration & Prompt Engineering',
    avatar: 'EP',
    color: '#2ec18f',
    bio: 'Designs effective prompts, integrates AI models, optimizes responses, and enhances intelligent features across applications',
    github: 'learnwithpeter',
  },
  {
    name: 'Harsh',
    role: 'UI/UX Designer',
    avatar: 'H',
    color: '#22c55e',
    bio: 'Creates intuitive user experiences, designs visually appealing interfaces, focuses on usability, accessibility, and seamless interactions.',
    github: 'malhotraharsh241',
  },
  {
    name: 'Om Kumar',
    role: 'Backend',
    avatar: 'RD',
    color: '#22c55e',
    bio: 'Builds robust backend systems, optimizes APIs, manages databases, and ensures reliable, secure application performance daily.',
    github: 'OmKumar103',
  },
  {
    name: 'Owais Usmani',
    role: 'Frontend',
    avatar: 'OU',
    color: '#10b981',
    bio: 'Designs responsive interfaces, builds interactive components, ensures smooth user experience, and optimizes performance across devices.',
    github: 'owais-usmani-017',
  }
];

const TECH_STACK = [
  { name: 'React', category: 'Frontend', color: '#61DAFB' },
  { name: 'TailwindCSS', category: 'Styling', color: '#06B6D4' },
  { name: 'Node.js', category: 'Backend', color: '#68A063' },
  { name: 'GitHub API', category: 'Data', color: '#2ec18f' },
  { name: 'Groq', category: 'AI', color: '#1aab7a' },
  { name: 'MongoDB', category: 'Database', color: '#336791' },
  { name: 'Railway/Render', category: 'Cache', color: '#DC382D' },
  { name: 'Vercel', category: 'Deploy', color: '#0f2d24' },
]

const PRINCIPLES = [
  { icon: Shield, title: 'Privacy-first', desc: 'We only analyze public repositories. No code is stored, only metadata and aggregated stats.', color: '#2ec18f' },
  { icon: Zap, title: 'Fast by default', desc: 'Results in under 10 seconds. We aggressively cache GitHub API responses to cut latency.', color: '#4299e1' },
  { icon: Target, title: 'Accuracy matters', desc: 'Our attribution model handles merge commits, co-authors, and rebased history correctly.', color: '#1aab7a' },
  { icon: Globe, title: 'Built in public', desc: 'We dogfood our own tool. Our own repo is publicly analyzable — we have nothing to hide.', color: '#38b2ac' },
]

export default function About() {
  const [hoveredMember, setHoveredMember] = useState(null)

  return (
    <div className="min-h-screen pt-24 pb-20">

      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden hero-bg">
        <div className="absolute inset-0 grid-bg" />
        <div className="glow-blob w-80 h-80 bg-[#2ec18f] opacity-[0.08] top-0 right-1/4" />
        <div className="max-w-4xl mx-auto relative text-center">
          <div className="pill-badge inline-flex mb-6">
            <span className="font-body text-sm font-600 text-[#2ec18f]">About Us</span>
          </div>
          <h1 className="font-display font-800 text-5xl md:text-6xl text-[#0f2d24] mt-2 mb-6 leading-tight">
            Every commit leaves a footprint —{' '}
            <span className="text-[#2ec18f]">we help you see the story behind it</span>
          </h1>
          <p className="font-body text-lg text-[#4a7a65] max-w-2xl mx-auto leading-relaxed">
            CodeFootprint started when a team of four developers kept arguing about "who did what"
            in code reviews. We built a script to settle it. Then we made it beautiful.
            Then we decided everyone deserves this.
          </p>
        </div>
      </section>

      {/* Origin story */}
      <section className="py-16 px-6 section-alt">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display font-800 text-3xl text-[#0f2d24] mb-4">The origin story</h2>
              <p className="font-body text-[#4a7a65] leading-relaxed mb-4">
                In 2024, our team submitted a college project. Four people. One repo.
                One person wrote 78% of the code. The group presentation didn't reflect that.
              </p>
              <p className="font-body text-[#4a7a65] leading-relaxed mb-4">
                We developed a way to analyze git history and reveal contribution insights — making the evaluation more transparent and fair.</p>
              <p className="font-body text-[#4a7a65] leading-relaxed">
                The tool grew from there. Now it uses AI to generate natural language summaries,
                maps file ownership, and helps teams understand exactly who drove what — without politics.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 font-mono text-xs">
              <div className="text-[#9bc4b2] mb-4">// git log --oneline --all | sort | uniq -c</div>
              <div className="space-y-3">
                {[
                  { name: 'Earnest peter', count: 247, color: '#2ec18f', bar: 100 },
                  { name: 'Harsh', count: 189, color: '#1aab7a', bar: 77 },
                  { name: 'Owais Usmani', count: 31, color: '#4299e1', bar: 13 },
                  { name: 'Om Kumar', count: 43, color: '#4299e1', bar: 13 },
                ].map(item => (
                  <div key={item.name}>
                    <div className="flex justify-between mb-1 text-[#4a7a65]">
                      <span>{item.name}</span>
                      <span style={{ color: item.color }}>{item.count} commits</span>
                    </div>
                    <div className="h-1.5 bg-[#e8f5ef] rounded-full">
                      <div className="h-full rounded-full contribution-bar" style={{ width: `${item.bar}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-[#9bc4b2]">// This is what started everything.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16 px-6 hero-bg relative">
        <div className="absolute inset-0 grid-bg" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="font-display font-800 text-3xl text-[#0f2d24]">What we stand for</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PRINCIPLES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card-hover flex gap-4 glass-card rounded-2xl p-5">
                <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: `${color}18`, border: `1.5px solid ${color}28` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <h3 className="font-display font-700 text-[#0f2d24] mb-1">{title}</h3>
                  <p className="font-body text-sm text-[#4a7a65] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-6 section-alt">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="pill-badge inline-flex mb-4">
              <Users size={14} className="text-[#2ec18f]" />
              <span className="font-body text-sm font-600 text-[#0f2d24]">The team</span>
            </div>
            <h2 className="font-display font-800 text-3xl text-[#0f2d24] mt-2">Four people, one obsession</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(member => (
              <div
                key={member.name}
                className="card-hover cursor-default glass-card rounded-2xl p-6 text-center relative overflow-hidden"
                onMouseEnter={() => setHoveredMember(member.name)}
                onMouseLeave={() => setHoveredMember(null)}
                style={hoveredMember === member.name ? { boxShadow: `0 20px 50px ${member.color}22` } : {}}
              >
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${member.color}66, transparent)`, opacity: hoveredMember === member.name ? 1 : 0 }} />
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center font-display text-xl font-800 text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}aa)` }}>
                  {member.avatar}
                </div>
                <h3 className="font-display font-700 text-[#0f2d24] text-lg">{member.name}</h3>
                <div className="font-body text-sm font-600 mb-2" style={{ color: member.color }}>{member.role}</div>
                <p className="font-body text-sm text-[#4a7a65] mb-4 leading-relaxed">{member.bio}</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f7fdf9] border border-[#d4ede5] rounded-full">
                  <ExternalLink size={12} className="text-[#9bc4b2]" />
                  <span className="font-body text-xs text-[#4a7a65]">@{member.github}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-16 px-6 hero-bg relative">
        <div className="absolute inset-0 grid-bg" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="font-display font-800 text-3xl text-[#0f2d24]">Built with</h2>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {TECH_STACK.map(({ name, category, color }) => (
              <div key={name} className="card-hover flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="font-body text-sm font-600 text-[#0f2d24]">{name}</span>
                <span className="font-body text-xs text-[#9bc4b2]">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      
    </div>
  )
}
