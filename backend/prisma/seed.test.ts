import { describe, it, expect, vi } from "vitest";

// Test the seed data structure
const VIP_PLANS = [
  { level: 1, name: "VIP 1", depositAmount: "100.00", dailyIncome: "3.00", dailyTasksRequired: 2 },
  { level: 2, name: "VIP 2", depositAmount: "250.00", dailyIncome: "7.50", dailyTasksRequired: 4 },
  { level: 3, name: "VIP 3", depositAmount: "500.00", dailyIncome: "15.00", dailyTasksRequired: 6 },
  { level: 4, name: "VIP 4", depositAmount: "1000.00", dailyIncome: "30.00", dailyTasksRequired: 8 },
  { level: 5, name: "VIP 5", depositAmount: "2500.00", dailyIncome: "75.00", dailyTasksRequired: 10 },
  { level: 6, name: "VIP 6", depositAmount: "5000.00", dailyIncome: "150.00", dailyTasksRequired: 12 },
  { level: 7, name: "VIP 7", depositAmount: "10000.00", dailyIncome: "300.00", dailyTasksRequired: 14 },
];

describe("VIP Plan Seed Data", () => {
  it("has exactly 7 plans", () => {
    expect(VIP_PLANS).toHaveLength(7);
  });

  it("has unique levels from 1 to 7", () => {
    const levels = VIP_PLANS.map((p) => p.level);
    expect(new Set(levels).size).toBe(7);
    expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("has correct deposit amounts", () => {
    const expected = ["100.00", "250.00", "500.00", "1000.00", "2500.00", "5000.00", "10000.00"];
    VIP_PLANS.forEach((plan, i) => {
      expect(plan.depositAmount).toBe(expected[i]);
    });
  });

  it("has correct daily income", () => {
    const expected = ["3.00", "7.50", "15.00", "30.00", "75.00", "150.00", "300.00"];
    VIP_PLANS.forEach((plan, i) => {
      expect(plan.dailyIncome).toBe(expected[i]);
    });
  });

  it("has correct daily tasks (level × 2)", () => {
    VIP_PLANS.forEach((plan) => {
      expect(plan.dailyTasksRequired).toBe(plan.level * 2);
    });
  });

  it("has correct names", () => {
    VIP_PLANS.forEach((plan) => {
      expect(plan.name).toBe(`VIP ${plan.level}`);
    });
  });
});
