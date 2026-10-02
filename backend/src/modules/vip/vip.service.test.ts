import { describe, it, expect, beforeEach, vi } from "vitest";
import { VipService } from "./vip.service.js";

// Mock Fastify instance
function createMockFastify(prisma: unknown) {
  return {
    prisma,
    config: {
      telegramBotToken: "test-token",
      isProduction: false,
    },
  };
}

describe("VipService", () => {
  let service: VipService;
  let mockPrisma: {
    vIPPlan: {
      findMany: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
    };
    user: {
      findUnique: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(() => {
    mockPrisma = {
      vIPPlan: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
      user: {
        findUnique: vi.fn(),
      },
    };
    service = new VipService(createMockFastify(mockPrisma) as never);
  });

  describe("getAllPlans", () => {
    it("returns all active plans ordered by level", async () => {
      const mockPlans = [
        { level: 1, name: "VIP 1", depositAmount: { toString: () => "100.00" }, dailyIncome: { toString: () => "3.00" }, dailyTasksRequired: 2 },
        { level: 2, name: "VIP 2", depositAmount: { toString: () => "250.00" }, dailyIncome: { toString: () => "7.50" }, dailyTasksRequired: 4 },
      ];
      mockPrisma.vIPPlan.findMany.mockResolvedValue(mockPlans);

      const result = await service.getAllPlans();

      expect(result).toHaveLength(2);
      expect(result[0]!.level).toBe(1);
      expect(result[1]!.level).toBe(2);
      expect(mockPrisma.vIPPlan.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { level: "asc" },
      });
    });
  });

  describe("getCurrentVip", () => {
    it("returns null when user has no VIP plan", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        currentVipPlan: null,
      });

      const result = await service.getCurrentVip("user-1");

      expect(result).toBeNull();
    });

    it("returns the plan when user has a VIP", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        currentVipPlan: {
          level: 2,
          name: "VIP 2",
          depositAmount: { toString: () => "250.00" },
          dailyIncome: { toString: () => "7.50" },
          dailyTasksRequired: 4,
        },
      });

      const result = await service.getCurrentVip("user-1");

      expect(result).not.toBeNull();
      expect(result!.level).toBe(2);
      expect(result!.name).toBe("VIP 2");
      expect(result!.depositAmount).toBe("250.00");
      expect(result!.dailyIncome).toBe("7.50");
      expect(result!.dailyTasksRequired).toBe(4);
    });
  });
});
