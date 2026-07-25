import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { Card, Badge, Spinner, EmptyState } from "../components/ui.jsx";
import Button from "../components/Button.jsx";
import { getAnalysisHistoryRequest, deleteAnalysisRequest } from "../api/analysisApi.js";

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadHistory = async () => {
    setIsLoading(true);
    const response = await getAnalysisHistoryRequest();
    setAnalyses(response.data.analyses);
    setIsLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteAnalysisRequest(id);
      setAnalyses((current) => current.filter((analysis) => analysis.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-h3 mb-6">Analysis History</h1>

      <Card>
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : analyses.length === 0 ? (
          <EmptyState
            title="No analyses yet"
            description="You haven't run any analyses yet. Start one to see it here."
            action={
              <Link to="/dashboard/new-analysis">
                <Button>New Analysis</Button>
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-muted border-b border-slate-800">
                  <th className="pb-3 font-medium">Repository</th>
                  <th className="pb-3 font-medium">GitHub User</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((analysis) => (
                  <tr key={analysis.id} className="border-b border-slate-800/60 last:border-0">
                    <td className="py-3.5 text-text-primary">
                      {analysis.repositoryUrl.replace("https://github.com/", "")}
                    </td>
                    <td className="py-3.5 text-text-secondary">{analysis.githubUsername}</td>
                    <td className="py-3.5 text-text-muted">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5">
                      <Badge variant={analysis.status === "completed" ? "success" : "error"}>
                        {analysis.status}
                      </Badge>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          to={`/dashboard/report/${analysis.id}`}
                          className="text-primary hover:underline"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(analysis.id)}
                          disabled={deletingId === analysis.id}
                          className="text-text-muted hover:text-error transition-colors disabled:opacity-50"
                          aria-label="Delete analysis"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default History;
