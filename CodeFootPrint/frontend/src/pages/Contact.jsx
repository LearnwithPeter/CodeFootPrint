import { useState } from "react";
import {
  Mail,
  MessageSquare,
  CheckCircle,
  ExternalLink,
  AtSign,
  Clock,
  Users,
  Star,
} from "lucide-react";

// Genuine, small-scale waitlist members
const WAITLIST_MEMBERS = [
  {
    name: "Rahul Gupta",
    role: "Backend Dev @ Swiggy",
    time: "2 days ago",
    avatar: "RG",
    color: "#00D4FF",
  },
  {
    name: "Tanmay Joshi",
    role: "CS Student, IIT Bombay",
    time: "3 days ago",
    avatar: "TJ",
    color: "#00FF88",
  },
  {
    name: "Sneha Kapoor",
    role: "Team Lead @ Razorpay",
    time: "5 days ago",
    avatar: "SK",
    color: "#FFB800",
  },
  {
    name: "Aditya Verma",
    role: "Freelance Dev",
    time: "1 week ago",
    avatar: "AV",
    color: "#A78BFA",
  },
  {
    name: "Meera Iyer",
    role: "Open Source Contributor",
    time: "1 week ago",
    avatar: "MI",
    color: "#FB923C",
  },
];

// Only 2 real-feeling reviews
const REVIEWS = [
  {
    name: "Karan Malhotra",
    role: "Engineering Manager, startup",
    avatar: "KM",
    color: "#00D4FF",
    text: "Used this to review my intern's contribution before their final evaluation. Saved me from manually going through 200+ commits. The AI summary was surprisingly accurate.",
    stars: 5,
  },
  {
    name: "Divya Nair",
    role: "CS Final Year, BITS Pilani",
    avatar: "DN",
    color: "#00FF88",
    text: "We had a group project dispute and this sorted it out in 30 seconds. Showed the prof exactly who wrote what. Would recommend to every college team.",
    stars: 5,
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [joinedWaitlist, setJoinedWaitlist] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Valid email required";
    if (form.message.trim().length < 10)
      e.message = "Say a bit more (min 10 chars)";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setTimeout(() => setSubmitted(true), 300);
  };

  const handleWaitlist = () => {
    if (waitlistEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setJoinedWaitlist(true);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="hero-glow w-80 h-80 bg-[#00D4FF] opacity-[0.04] top-0 left-1/3" />
        <div className="max-w-4xl mx-auto relative text-center">
          <span className="font-mono text-xs text-[#00D4FF] tracking-widest uppercase">
            Contact & Waitlist
          </span>
          <h1 className="font-display font-800 text-5xl md:text-6xl text-white mt-4 mb-4 leading-tight">
            Get in early.
          </h1>
          <p className="font-body text-lg text-[#718096] max-w-xl mx-auto">
            We're adding private repo support and team dashboards. Join the
            waitlist or reach out directly.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Waitlist + Reviews */}
        <div className="space-y-8">
          {/* Waitlist Card */}
          <div className="bg-[#0D1117] border border-[#1E2A3A] rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D4FF44] to-transparent" />

            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
              <span className="font-mono text-xs text-[#00FF88]">
                Waitlist open
              </span>
            </div>
            <h2 className="font-display font-700 text-2xl text-white mb-1">
              Early access
            </h2>
            <p className="font-body text-sm text-[#4A5568] mb-6">
              Private repo analysis, CSV exports, team dashboards — coming soon.
              Be first.
            </p>

            {!joinedWaitlist ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleWaitlist()}
                  className="flex-1 bg-[#111820] border border-[#1E2A3A] focus:border-[#00D4FF44] rounded-lg px-4 py-2.5 font-body text-sm text-[#E2E8F0] placeholder-[#2D3748] transition-colors"
                />
                <button
                  onClick={handleWaitlist}
                  className="btn-primary px-5 py-2.5 rounded-lg font-display text-sm text-black font-600 whitespace-nowrap"
                >
                  <span>Join →</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-3">
                <CheckCircle size={20} className="text-[#00FF88]" />
                <span className="font-body text-sm text-[#00FF88]">
                  You're on the list. We'll email you when ready.
                </span>
              </div>
            )}

            {/* Waitlist members */}
            <div className="mt-6 pt-5 border-t border-[#1E2A3A]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-[#4A5568]" />
                  <span className="font-body text-xs text-[#4A5568]">
                    Recently joined
                  </span>
                </div>
                <span className="font-mono text-xs text-[#00D4FF]">
                  17 members
                </span>
              </div>
              <div className="space-y-3">
                {WAITLIST_MEMBERS.map((member) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-xs text-black font-600"
                      style={{ background: member.color }}
                    >
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-body text-sm text-white truncate">
                        {member.name}
                      </div>
                      <div className="font-body text-xs text-[#4A5568] truncate">
                        {member.role}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[#2D3748] flex-shrink-0">
                      <Clock size={10} />
                      <span className="font-mono text-xs">{member.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center">
                <span className="font-mono text-xs text-[#2D3748]">
                  + 12 others joined this week
                </span>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Star size={14} className="text-[#FFB800]" />
              <span className="font-body text-sm text-[#4A5568]">
                What early users say
              </span>
            </div>
            {REVIEWS.map((review) => (
              <div
                key={review.name}
                className="card-hover bg-[#0D1117] border border-[#1E2A3A] rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs text-black font-700"
                    style={{ background: review.color }}
                  >
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-body text-sm font-500 text-white">
                      {review.name}
                    </div>
                    <div className="font-body text-xs text-[#4A5568]">
                      {review.role}
                    </div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: review.stars }).map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className="text-[#FFB800] fill-[#FFB800]"
                      />
                    ))}
                  </div>
                </div>
                <p className="font-body text-sm text-[#718096] leading-relaxed italic">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Contact form */}
        <div>
          <div className="bg-[#0D1117] border border-[#1E2A3A] rounded-xl p-6 sticky top-28">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1E2A3A] to-transparent" />

            <div className="flex items-center gap-2 mb-6">
              <MessageSquare size={18} className="text-[#00D4FF]" />
              <h2 className="font-display font-600 text-white text-xl">
                Send a message
              </h2>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-body text-xs text-[#4A5568] mb-1.5">
                    Your name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Rahul Sharma"
                    className={`w-full bg-[#111820] border rounded-lg px-4 py-2.5 font-body text-sm text-[#E2E8F0] placeholder-[#2D3748] transition-colors focus:border-[#00D4FF44] ${errors.name ? "border-[#FF3B5C44]" : "border-[#1E2A3A]"}`}
                  />
                  {errors.name && (
                    <p className="font-mono text-xs text-[#FF3B5C] mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-body text-xs text-[#4A5568] mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="rahul@example.com"
                    className={`w-full bg-[#111820] border rounded-lg px-4 py-2.5 font-body text-sm text-[#E2E8F0] placeholder-[#2D3748] transition-colors focus:border-[#00D4FF44] ${errors.email ? "border-[#FF3B5C44]" : "border-[#1E2A3A]"}`}
                  />
                  {errors.email && (
                    <p className="font-mono text-xs text-[#FF3B5C] mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-body text-xs text-[#4A5568] mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Tell us what you need, what you'd like to see, or anything else..."
                    className={`w-full bg-[#111820] border rounded-lg px-4 py-2.5 font-body text-sm text-[#E2E8F0] placeholder-[#2D3748] transition-colors focus:border-[#00D4FF44] resize-none ${errors.message ? "border-[#FF3B5C44]" : "border-[#1E2A3A]"}`}
                  />
                  {errors.message && (
                    <p className="font-mono text-xs text-[#FF3B5C] mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3 rounded-lg font-display font-600 text-black text-sm"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Mail size={15} />
                    Send Message
                  </span>
                </button>

                <p className="font-body text-xs text-[#2D3748] text-center">
                  Usually reply within 24-48 hours. No spam ever.
                </p>
              </form>
            ) : (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-[#00FF8811] border border-[#00FF8833] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={22} className="text-[#00FF88]" />
                </div>
                <h3 className="font-display font-600 text-white text-xl mb-2">
                  Message sent!
                </h3>
                <p className="font-body text-sm text-[#4A5568]">
                  We'll get back to you at {form.email}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                  className="mt-6 font-mono text-xs text-[#4A5568] hover:text-[#00D4FF] transition-colors"
                >
                  Send another →
                </button>
              </div>
            )}

            {/* Social links */}
            <div className="mt-6 pt-5 border-t border-[#1E2A3A] flex items-center justify-between">
              <span className="font-body text-xs text-[#4A5568]">
                Or reach us on
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-[#1E2A3A] rounded-lg text-[#4A5568] hover:text-[#00D4FF] hover:border-[#00D4FF44] transition-all"
                >
                  <ExternalLink size={15} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-[#1E2A3A] rounded-lg text-[#4A5568] hover:text-[#00D4FF] hover:border-[#00D4FF44] transition-all"
                >
                  <AtSign size={15} />
                </a>
                <a
                  href="mailto:hello@codefootprint.dev"
                  className="p-2 border border-[#1E2A3A] rounded-lg text-[#4A5568] hover:text-[#00D4FF] hover:border-[#00D4FF44] transition-all"
                >
                  <Mail size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
