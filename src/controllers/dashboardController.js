import { getDashboardData } from '../services/dashboardService.js';
import { ok } from '../utils/response.js';

export const getDashboard = async (req, res, next) => {
  try {
    const now   = new Date();
    const year  = Number(req.query.year)  || now.getFullYear();
    const month = Number(req.query.month) || now.getMonth() + 1;

    const data = await getDashboardData(req.user.id, year, month);
    return ok(res, data);
  } catch (error) {
    next(error);
  }
};
