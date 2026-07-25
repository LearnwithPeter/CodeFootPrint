import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { Card, Badge, Spinner, EmptyState } from "../components/ui.jsx";
import Button from "../components/Button.jsx";
import { getStatsRequest } from "../api/dashboardApi.js";
import { getAnalysisHistoryRequest } from "../api/analysisApi.js";

// Turns a list of analyses into "how many were run per day" for the chart.
// This is a small pure function - kept outside the component so it's easy
// to read and doesn't get recreated on every render.
const buildWeeklyChartData = (analyses) => {
  const countsByDay = {};

  for (const analysis of analyses) {
    const day = new Date(analysis.createdAt).toLocaleDateString("en-US", {
      weekday: "short",
    });
    countsByDay[day] = (countsByDay[day] || 0) + 1;
  }

  return Object.entries(countsByDay).map(([day, count]) => ({ day, count }));
};

const formatDuration = (ms) => {
  if (!ms) return "—";
  return `${(ms / 1000).toFixed(1)}s`;
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsResponse, historyResponse] = await Promise.all([
          getStatsRequest(),
          getAnalysisHistoryRequest(),
        ]);
        setStats(statsResponse.data.stats);
        setAnalyses(historyResponse.data.analyses);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { label: "Total Analyses", value: stats?.totalAnalyses ?? 0 },
    { label: "Repositories Analyzed", value: stats?.repositoriesAnalyzed ?? 0 },
    { label: "Avg. Analysis Time", value: formatDuration(stats?.averageAnalysisTimeMs) },
    {
      label: "Last Analysis",
      value: stats?.lastAnalysis ? new Date(stats.lastAnalysis.date).toLocaleDateString() : "—",
    },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-h3 mb-6">Dashboard</h1>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <Card key={card.label}>
            <p className="text-text-muted text-sm mb-1">{card.label}</p>
            <p className="text-2xl font-semibold text-text-primary">{card.value}</p>
          </Card>
        ))}
      </div>

      {analyses.length === 0 ? (
        <Card>
          <EmptyState
            title="No analyses yet"
            description="Run your first GitHub contribution analysis to see your dashboard come to life."
            action={
              <Link to="/dashboard/new-analysis">
                <Button>New Analysis</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <>
          {/* Weekly analyses chart */}
          <Card className="mb-6">
            <h2 className="font-semibold mb-4">Analyses This Week</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={buildWeeklyChartData(analyses)}>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 8 }}
                  labelStyle={{ color: "#F8FAFC" }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent activity table */}
          <Card>
            <h2 className="font-semibold mb-4">Recent Activity</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-muted border-b border-slate-800">
                    <th className="pb-3 font-medium">Repository</th>
                    <th className="pb-3 font-medium">Username</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {analyses.slice(0, 5).map((analysis) => (
                    <tr key={analysis.id} className="border-b border-slate-800/60 last:border-0">
                      <td className="py-3 text-text-primary truncate max-w-[200px]">
                        {analysis.repositoryUrl.replace("https://github.com/", "")}
                      </td>
                      <td className="py-3 text-text-secondary">{analysis.githubUsername}</td>
                      <td className="py-3">
                        <Badge variant={analysis.status === "completed" ? "success" : "error"}>
                          {analysis.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-text-muted">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <Link to={`/dashboard/report/${analysis.id}`} className="text-primary hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
