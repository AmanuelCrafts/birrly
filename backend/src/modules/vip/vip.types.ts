export interface VipPlanResponse {
  level: number;
  name: string;
  depositAmount: string;
  dailyIncome: string;
  dailyTasksRequired: number;
}

export interface CurrentVipResponse {
  plan: VipPlanResponse | null;
}
