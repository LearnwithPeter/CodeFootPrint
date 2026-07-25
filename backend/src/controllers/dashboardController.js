// Controllers stay thin: read the request, call a service, send a response.

import { getUserProfile, getDashboardStats } from "../services/dashboardService.js";

export const getProfile = async (req, res, next) => {
  try {
    const profile = await getUserProfile(req.userId);

    res.status(200).json({
      success: true,
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStats(req.userId);

    res.status(200).json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};
