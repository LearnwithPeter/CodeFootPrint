import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { Card, Badge, Spinner, EmptyState } from "../components/ui.jsx";
import Button from "../components/Button.jsx";
import { getAnalysisByIdRequest } from "../api/analysisApi.js";

// Maps qualitative level words to a badge color, so "Expert" always reads
// as more significant than "Beginner" without needing a number anywhere.
const LEVEL_BADGE_VARIANT = {
  Beginner: "neutral",
  Weak: "neutral",
  Intermediate: "info",
  Moderate: "info",
  Advanced: "success",
  Strong: "success",
  Expert: "success",
  Excellent: "success",
};

const LevelBadge = ({ level }) => (
  <Badge variant={LEVEL_BADGE_VARIANT[level] || "neutral"}>{level}</Badge>
);

// A short list of evidence bullets, reused for reasoning/evidence/strengths-
// style lists throughout the report.
const EvidenceList = ({ items }) => (
  <ul className="space-y-1.5">
    {items.map((item) => (
      <li key={item} className="flex gap-2 text-sm text-text-secondary">
        <CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" />
        {item}
      </li>
    ))}
  </ul>
);

// One collapsible interview question. Kept as its own small component so
// ReportViewer itself doesn't have to manage which question is open.
const InterviewQuestionItem = ({ question }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-800 last:border-0">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="w-full flex items-center justify-between py-3.5 text-left text-sm text-text-primary"
      >
        {question}
        <ChevronDown
          size={16}
          className={`text-text-muted transition-transform shrink-0 ml-3 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <p className="text-text-muted text-sm pb-3.5">
          Think through a real example from your work that answers this.
        </p>
      )}
    </div>
  );
};

const ReportViewer = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        const response = await getAnalysisByIdRequest(id);
        setAnalysis(response.data.analysis);
      } catch (err) {
        setLoadError(err.response?.data?.message || "Could not load this report.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalysis();
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  if (loadError || !analysis) {
    return (
      <DashboardLayout>
        <Card>
          <EmptyState
            title="Report not found"
            description={loadError || "This analysis could not be found."}
            action={
              <Link to="/dashboard/history">
                <Button>Back to History</Button>
              </Link>
            }
          />
        </Card>
      </DashboardLayout>
    );
  }

  const { report } = analysis;
  const ai = report.aiReport;
  const stats = report.contributionStats;
  const evidence = report.evidenceSummary;

  const statCards = [
    { label: "Total Commits", value: stats.totalCommits },
    { label: "Lines Added", value: stats.totalLinesAdded },
    { label: "Lines Removed", value: stats.totalLinesRemoved },
    { label: "Files Modified", value: stats.uniqueFilesCount },
    { label: "Functions Detected", value: stats.uniqueFunctionsCount },
  ];

  // Contribution breakdown now comes from the backend's own directory-based
  // calculation (stats.contributionAreas), not from the AI - these
  // percentages are real, not guessed.
  const contributionAreas = stats.contributionAreas || [];

  const codeQualityRows = ["naming", "modularity", "errorHandling", "testing", "documentation"]
    .filter((key) => ai.codeQuality?.[key])
    .map((key) => ({ label: key, value: ai.codeQuality[key] }));

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Candidate Overview */}
        <Card>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-h3">{analysis.githubUsername}</h1>
              <p className="text-text-muted text-sm">{report.repository?.name}</p>
            </div>
            <LevelBadge level={ai.candidateOverview?.experienceLevel} />
          </div>
          <p className="text-text-secondary text-sm mb-2">
            <span className="text-text-muted">Primary expertise: </span>
            {ai.candidateOverview?.primaryExpertise}
          </p>
          <p className="text-text-secondary text-sm mb-4">{ai.candidateOverview?.summary}</p>
          {ai.candidateOverview?.reasoning?.length > 0 && (
            <EvidenceList items={ai.candidateOverview.reasoning} />
          )}
        </Card>

        {/* Contribution Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statCards.map((card) => (
            <Card key={card.label}>
              <p className="text-text-muted text-xs mb-1">{card.label}</p>
              <p className="text-xl font-semibold text-text-primary">{card.value}</p>
            </Card>
          ))}
        </div>

        {/* Technical Skills - level + evidence, no invented percentages */}
        {ai.technicalSkills?.length > 0 && (
          <Card>
            <h2 className="font-semibold mb-4">Technical Skills</h2>
            <div className="space-y-5">
              {ai.technicalSkills.map((skill) => (
                <div key={skill.skill}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-primary text-sm font-medium">{skill.skill}</span>
                    <LevelBadge level={skill.level} />
                  </div>
                  {skill.evidence?.length > 0 && <EvidenceList items={skill.evidence} />}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Contribution Breakdown - real, backend-calculated percentages */}
        {contributionAreas.length > 0 && (
          <Card>
            <h2 className="font-semibold mb-1">Contribution Breakdown</h2>
            <p className="text-text-muted text-xs mb-4">
              Calculated from the directories of every file modified
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {contributionAreas.map((area) => (
                <div key={area.area} className="text-center p-4 rounded-lg bg-bg-secondary">
                  <p className="text-xl font-semibold text-primary">{area.percentage}%</p>
                  <p className="text-text-muted text-xs mt-1">{area.area}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Key Contributions */}
        {ai.keyContributions?.length > 0 && (
          <Card>
            <h2 className="font-semibold mb-4">Key Contributions</h2>
            <div className="space-y-4">
              {ai.keyContributions.map((contribution) => (
                <div key={contribution.title} className="p-4 rounded-lg bg-bg-secondary">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-medium text-text-primary text-sm">{contribution.title}</h3>
                    <Badge
                      variant={
                        contribution.complexity === "High"
                          ? "error"
                          : contribution.complexity === "Medium"
                          ? "warning"
                          : "success"
                      }
                    >
                      {contribution.complexity}
                    </Badge>
                  </div>
                  <p className="text-text-muted text-sm mb-2">{contribution.description}</p>
                  <p className="text-text-muted text-xs">{contribution.files?.join(", ")}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Code Quality - qualitative observations, no arbitrary scores */}
        {ai.codeQuality && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Code Quality</h2>
              <LevelBadge level={ai.codeQuality.overall} />
            </div>
            <div className="space-y-2.5">
              {codeQualityRows.map((row) => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-text-muted capitalize">{row.label}</span>
                  <span className="text-text-primary">{row.value}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Strengths & Areas for Improvement */}
        <div className="grid md:grid-cols-2 gap-4">
          {ai.strengths?.length > 0 && (
            <Card>
              <h2 className="font-semibold mb-3">Strengths</h2>
              <ul className="space-y-2 text-sm text-text-secondary">
                {ai.strengths.map((strength) => (
                  <li key={strength} className="flex gap-2">
                    <span className="text-success">•</span> {strength}
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {ai.areasForImprovement?.length > 0 && (
            <Card>
              <h2 className="font-semibold mb-3">Areas for Improvement</h2>
              <ul className="space-y-2 text-sm text-text-secondary">
                {ai.areasForImprovement.map((area) => (
                  <li key={area} className="flex gap-2">
                    <span className="text-warning">•</span> {area}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Interview Questions */}
        {ai.interviewQuestions?.length > 0 && (
          <Card>
            <h2 className="font-semibold mb-2">Interview Questions</h2>
            <div>
              {ai.interviewQuestions.map((question) => (
                <InterviewQuestionItem key={question} question={question} />
              ))}
            </div>
          </Card>
        )}

        {/* Hiring Recommendation - with reasons, not just a verdict */}
        {ai.hiringRecommendation && (
          <Card className="border-primary/30 bg-primary/5">
            <h2 className="font-semibold mb-3">Hiring Recommendation</h2>
            <p className="text-lg font-semibold text-primary mb-1">
              {ai.hiringRecommendation.verdict}
            </p>
            <p className="text-text-secondary text-sm mb-3">
              Best fit role: {ai.hiringRecommendation.bestFitRole}
            </p>
            {ai.hiringRecommendation.reasons?.length > 0 && (
              <EvidenceList items={ai.hiringRecommendation.reasons} />
            )}
          </Card>
        )}

        {/* Evidence Used - entirely backend-computed, builds trust in the report */}
        {evidence && (
          <Card>
            <h2 className="font-semibold mb-1">Evidence Used</h2>
            <p className="text-text-muted text-xs mb-4">
              What this report is based on - calculated directly from the repository
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-text-muted">Commits analyzed: </span>
                <span className="text-text-primary">{evidence.commitsAnalyzed}</span>
              </div>
              <div>
                <span className="text-text-muted">Files modified: </span>
                <span className="text-text-primary">{evidence.filesModified}</span>
              </div>
              <div className="col-span-2">
                <span className="text-text-muted">Major directories: </span>
                <span className="text-text-primary">{evidence.majorDirectories.join(", ") || "N/A"}</span>
              </div>
              <div className="col-span-2">
                <span className="text-text-muted">Representative files: </span>
                <span className="text-text-primary">{evidence.representativeFiles.join(", ") || "N/A"}</span>
              </div>
              <div className="col-span-2">
                <span className="text-text-muted">Technologies detected: </span>
                <span className="text-text-primary">{evidence.technologiesDetected.join(", ") || "N/A"}</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReportViewer;
