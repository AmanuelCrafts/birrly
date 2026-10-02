import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthService } from "./auth.service.js";

function createMockFastify(prisma: unknown) {
  return {
    prisma,
    config: {
      telegramBotToken: "test-token",
      isProduction: false,
    },
  };
}

describe("AuthService", () => {
  let service: AuthService;
  let mockPrisma: {
    user: {
      findUnique: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };
    service = new AuthService(createMockFastify(mockPrisma) as never);
  });

  describe("getUserById", () => {
    it("returns null when user not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await service.getUserById("nonexistent");

      expect(result).toBeNull();
    });

    it("returns user with null currentVip when no VIP plan", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        telegramId: "12345",
        username: "testuser",
        firstName: "Test",
        lastName: null,
        avatarUrl: null,
        status: "ACTIVE",
        createdAt: new Date("2025-01-01"),
        currentVipPlan: null,
      });

      const result = await service.getUserById("user-1");

      expect(result).not.toBeNull();
      expect(result!.id).toBe("user-1");
      expect(result!.currentVip).toBeNull();
    });

    it("returns user with currentVip when VIP plan exists", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        telegramId: "12345",
        username: "testuser",
        firstName: "Test",
        lastName: null,
        avatarUrl: null,
        status: "ACTIVE",
        createdAt: new Date("2025-01-01"),
        currentVipPlan: {
          level: 3,
          name: "VIP 3",
          depositAmount: { toString: () => "500.00" },
          dailyIncome: { toString: () => "15.00" },
          dailyTasksRequired: 6,
        },
      });

      const result = await service.getUserById("user-1");

      expect(result).not.toBeNull();
      expect(result!.currentVip).not.toBeNull();
      expect(result!.currentVip!.level).toBe(3);
      expect(result!.currentVip!.name).toBe("VIP 3");
      expect(result!.currentVip!.depositAmount).toBe("500.00");
      expect(result!.currentVip!.dailyIncome).toBe("15.00");
      expect(result!.currentVip!.dailyTasksRequired).toBe(6);
    });
  });
});
