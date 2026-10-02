export interface VipPlan {
  level: number;
  name: string;
  depositAmount: string;
  dailyIncome: string;
  dailyTasksRequired: number;
}

export interface VipPlansResponse {
  success: boolean;
  data?: {
    plans: VipPlan[];
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface CurrentVipResponse {
  success: boolean;
  data?: {
    plan: VipPlan | null;
  };
  error?: {
    code: string;
    message: string;
  };
}

export async function getVipPlans(): Promise<VipPlansResponse> {
  const response = await fetch("/api/vip/plans", {
    credentials: "include",
  });
  return response.json() as Promise<VipPlansResponse>;
}

export async function getCurrentVip(): Promise<CurrentVipResponse> {
  const response = await fetch("/api/vip/current", {
    credentials: "include",
  });
  return response.json() as Promise<CurrentVipResponse>;
}
