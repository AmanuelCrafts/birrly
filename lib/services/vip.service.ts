import { connectToDatabase } from "../mongodb";
import { VIPPlan } from "@/models/VIPPlan";
import { User } from "@/models/User";

export interface VIPPlanResponse {
  level: number;
  name: string;
  depositAmount: number;
  dailyIncome: number;
  dailyTasksRequired: number;
}

export interface CurrentVIPResponse {
  hasVip: boolean;
  vip: VIPPlanResponse | null;
}

export async function getAllVIPPlans(): Promise<VIPPlanResponse[]> {
  await connectToDatabase();

  const plans = await VIPPlan.find({ isActive: true })
    .sort({ level: 1 })
    .lean();

  return plans.map((plan) => ({
    level: plan.level,
    name: plan.name,
    depositAmount: plan.depositAmount,
    dailyIncome: plan.dailyIncome,
    dailyTasksRequired: plan.dailyTasksRequired,
  }));
}

export async function getCurrentVIP(userId: string): Promise<CurrentVIPResponse> {
  await connectToDatabase();

  const user = await User.findById(userId).populate("currentVipPlan").lean() as {
    currentVipPlan: {
      level: number;
      name: string;
      depositAmount: number;
      dailyIncome: number;
      dailyTasksRequired: number;
    } | null;
  } | null;

  if (!user?.currentVipPlan) {
    return { hasVip: false, vip: null };
  }

  const plan = user.currentVipPlan;

  return {
    hasVip: true,
    vip: {
      level: plan.level,
      name: plan.name,
      depositAmount: plan.depositAmount,
      dailyIncome: plan.dailyIncome,
      dailyTasksRequired: plan.dailyTasksRequired,
    },
  };
}
