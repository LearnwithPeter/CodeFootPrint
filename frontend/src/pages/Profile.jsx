import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { Card, Spinner } from "../components/ui.jsx";
import { getProfileRequest } from "../api/dashboardApi.js";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const response = await getProfileRequest();
      setProfile(response.data.profile);
      setIsLoading(false);
    };

    loadProfile();
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

  return (
    <DashboardLayout>
      <h1 className="text-h3 mb-6">Profile</h1>

      <div className="max-w-lg space-y-4">
        <Card>
          <h2 className="font-semibold mb-4">User Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Name</span>
              <span className="text-text-primary">{profile.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Email</span>
              <span className="text-text-primary">{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Member Since</span>
              <span className="text-text-primary">
                {new Date(profile.memberSince).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold mb-4">Statistics</h2>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Total Analyses Run</span>
            <span className="text-text-primary font-semibold">{profile.totalAnalyses}</span>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
