import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const VIP_PLANS = [
  { level: 1, name: "VIP 1", depositAmount: "100.00", dailyIncome: "3.00", dailyTasksRequired: 2 },
  { level: 2, name: "VIP 2", depositAmount: "250.00", dailyIncome: "7.50", dailyTasksRequired: 4 },
  { level: 3, name: "VIP 3", depositAmount: "500.00", dailyIncome: "15.00", dailyTasksRequired: 6 },
  { level: 4, name: "VIP 4", depositAmount: "1000.00", dailyIncome: "30.00", dailyTasksRequired: 8 },
  { level: 5, name: "VIP 5", depositAmount: "2500.00", dailyIncome: "75.00", dailyTasksRequired: 10 },
  { level: 6, name: "VIP 6", depositAmount: "5000.00", dailyIncome: "150.00", dailyTasksRequired: 12 },
  { level: 7, name: "VIP 7", depositAmount: "10000.00", dailyIncome: "300.00", dailyTasksRequired: 14 },
];

async function main() {
  console.log("Seeding VIP plans...");

  for (const plan of VIP_PLANS) {
    const existing = await prisma.vIPPlan.findUnique({
      where: { level: plan.level },
    });

    if (existing) {
      // Update if changed
      await prisma.vIPPlan.update({
        where: { level: plan.level },
        data: {
          name: plan.name,
          depositAmount: plan.depositAmount,
          dailyIncome: plan.dailyIncome,
          dailyTasksRequired: plan.dailyTasksRequired,
          isActive: true,
        },
      });
      console.log(`  Updated ${plan.name}`);
    } else {
      await prisma.vIPPlan.create({
        data: plan,
      });
      console.log(`  Created ${plan.name}`);
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
