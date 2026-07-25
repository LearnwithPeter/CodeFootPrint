import { Link } from "react-router-dom";
import { GitBranch, Sparkles, FileText, ArrowRight } from "lucide-react";
import Button from "../components/Button.jsx";
import { Card } from "../components/ui.jsx";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Contribution Analysis",
    description: "Real commits and diffs, read by AI, turned into a clear picture of what you actually built.",
  },
  {
    icon: GitBranch,
    title: "GitHub Repository Insights",
    description: "See exactly which files, functions, and areas of a codebase you contributed to.",
  },
  {
    icon: FileText,
    title: "Interview Ready Reports",
    description: "Skills, strengths, and likely interview questions, generated from your real work.",
  },
];

const STEPS = [
  { title: "Enter Repository", description: "Paste a GitHub repo URL and your username." },
  { title: "AI Analysis", description: "We fetch your commits and let AI study the real code." },
  { title: "Receive Report", description: "Get a structured, interview-ready contribution report." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="font-semibold text-lg">CodeFootPrint</span>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary px-3 py-2">
            Login
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-h1 mb-5">
            Understand Your Real{" "}
            <span className="text-primary">GitHub Contributions</span> with AI.
          </h1>
          <p className="text-text-secondary text-lg mb-8 max-w-lg">
            CodeFootPrint reads your actual commits and code, not just contribution
            graphs, and turns them into a report you can bring to an interview.
          </p>
          <div className="flex gap-3">
            <Link to="/register">
              <Button className="flex items-center gap-2">
                Get Started <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">View Demo</Button>
            </Link>
          </div>
        </div>

        <Card className="hidden md:block">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-slate-700 rounded" />
            <div className="h-20 bg-bg-secondary rounded-lg border border-slate-800" />
            <div className="grid grid-cols-3 gap-2">
              <div className="h-14 bg-bg-secondary rounded-lg border border-slate-800" />
              <div className="h-14 bg-bg-secondary rounded-lg border border-slate-800" />
              <div className="h-14 bg-bg-secondary rounded-lg border border-slate-800" />
            </div>
          </div>
        </Card>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <Icon className="text-primary mb-4" size={24} />
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-text-muted text-sm">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-h3 text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 font-semibold text-sm">
                {index + 1}
              </div>
              <h3 className="font-semibold mb-1.5">{step.title}</h3>
              <p className="text-text-muted text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-6 flex justify-between text-sm text-text-muted">
          <span>© 2026 CodeFootPrint</span>
          <div className="flex gap-6">
            <a href="https://github.com" className="hover:text-text-primary">GitHub</a>
            <span>Privacy</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
