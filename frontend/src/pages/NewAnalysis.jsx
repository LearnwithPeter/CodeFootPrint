import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { Card, Spinner } from "../components/ui.jsx";
import { runAnalysisRequest } from "../api/analysisApi.js";

// The steps shown on the loading screen, per the design doc.
// We don't get real progress events from the backend (that would need
// WebSockets - listed as a future enhancement in the architecture doc),
// so we advance through these visually while the one real API call runs.
const LOADING_STEPS = [
  "Fetching Commits",
  "Parsing Diffs",
  "Analyzing Code",
  "Generating Report",
];

const NewAnalysis = () => {
  const navigate = useNavigate();

  const [repoUrl, setRepoUrl] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    setCurrentStep(0);

    // Advances the visual step indicator every 1.5s while the real
    // request is in flight, purely so the user sees progress instead
    // of a single frozen spinner during a request that can take a while.
    const stepInterval = setInterval(() => {
      setCurrentStep((step) => Math.min(step + 1, LOADING_STEPS.length - 1));
    }, 1500);

    try {
      const response = await runAnalysisRequest(repoUrl, githubUsername);
      clearInterval(stepInterval);
      navigate(`/dashboard/report/${response.data.id}`);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.response?.data?.message || "Analysis failed. Please try again.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <Card className="w-full max-w-md text-center">
            <Spinner size={32} className="mx-auto mb-6" />
            <h2 className="font-semibold mb-6">Analyzing {repoUrl.replace("https://github.com/", "")}</h2>
            <div className="space-y-3 text-left">
              {LOADING_STEPS.map((step, index) => (
                <div key={step} className="flex items-center gap-3 text-sm">
                  {index < currentStep ? (
                    <span className="w-5 h-5 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </span>
                  ) : index === currentStep ? (
                    <Spinner />
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className={index <= currentStep ? "text-text-primary" : "text-text-muted"}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-lg">
          <h1 className="text-h3 mb-1">New Analysis</h1>
          <p className="text-text-muted text-sm mb-6">
            Enter a public GitHub repository and a username to analyze their contributions.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Repository URL"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              required
            />
            <Input
              label="GitHub Username"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="octocat"
              required
            />

            {error && <p className="text-sm text-error">{error}</p>}

            <Button type="submit" className="w-full">
              Analyze
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewAnalysis;
