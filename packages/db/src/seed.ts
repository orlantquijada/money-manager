import { addDays, differenceInDays, startOfMonth, subDays } from "date-fns";
import { db } from "./client";
import { folders, funds, stores, transactions, users } from "./schema";

type FundType = "SPENDING" | "NON_NEGOTIABLE" | "TARGET";
type TimeMode = "WEEKLY" | "MONTHLY" | "BIMONTHLY" | "EVENTUALLY";

type FundSeed = {
  name: string;
  timeMode: TimeMode;
  budgetedAmount: number;
  fundType?: FundType;
};

type FolderSeed = {
  name: string;
  funds: FundSeed[];
};

// Seed data matching the UI screenshot
const folderSeeds: FolderSeed[] = [
  {
    name: "Bills",
    funds: [
      {
        name: "Rent",
        timeMode: "MONTHLY",
        budgetedAmount: 12_000,
        fundType: "NON_NEGOTIABLE",
      },
      {
        name: "Electric",
        timeMode: "MONTHLY",
        budgetedAmount: 1500,
        fundType: "NON_NEGOTIABLE",
      },
      {
        name: "Water",
        timeMode: "MONTHLY",
        budgetedAmount: 350,
        fundType: "NON_NEGOTIABLE",
      },
      {
        name: "Internet",
        timeMode: "MONTHLY",
        budgetedAmount: 1700,
        fundType: "NON_NEGOTIABLE",
      },
      { name: "Groceries", timeMode: "BIMONTHLY", budgetedAmount: 1500 },
    ],
  },
  {
    name: "Frequent",
    funds: [
      { name: "Transportation", timeMode: "WEEKLY", budgetedAmount: 300 },
      { name: "Eating Out", timeMode: "WEEKLY", budgetedAmount: 750 },
      { name: "Laundry", timeMode: "BIMONTHLY", budgetedAmount: 275 },
      { name: "Dates", timeMode: "BIMONTHLY", budgetedAmount: 1500 },
    ],
  },
  {
    name: "Self-development",
    funds: [
      { name: "Books", timeMode: "MONTHLY", budgetedAmount: 800 },
      { name: "Gym", timeMode: "MONTHLY", budgetedAmount: 1000 },
      {
        name: "Online Courses",
        timeMode: "EVENTUALLY",
        budgetedAmount: 2000,
        // TODO: re-enable when TARGET fundtype is restored
        // fundType: "TARGET",
      },
    ],
  },
  {
    name: "Subscriptions",
    funds: [
      { name: "Spotify", timeMode: "MONTHLY", budgetedAmount: 150 },
      { name: "Netflix", timeMode: "MONTHLY", budgetedAmount: 350 },
      { name: "iCloud", timeMode: "MONTHLY", budgetedAmount: 50 },
    ],
  },
  {
    name: "Others",
    funds: [
      { name: "Misc", timeMode: "MONTHLY", budgetedAmount: 500 },
      { name: "Shopping", timeMode: "BIMONTHLY", budgetedAmount: 1000 },
      {
        name: "Gifts",
        timeMode: "EVENTUALLY",
        budgetedAmount: 2000,
        // TODO: re-enable when TARGET fundtype is restored
        // fundType: "TARGET",
      },
    ],
  },
];

const storeSeeds = [
  "Grab",
  "Jollibee",
  "McDonald's",
  "7-Eleven",
  "SM Supermarket",
  "Lazada",
  "Shopee",
  "Globe",
  "Meralco",
  "Manila Water",
  "Spotify",
  "Netflix",
  "Apple",
  "Anytime Fitness",
  "National Bookstore",
  "Starbucks",
  "Food Panda",
];

// Generate random amount within a range
function randomAmount(min: number, max: number): string {
  return (Math.floor(Math.random() * (max - min + 1)) + min).toFixed(2);
}

// Generate random date within current month
function randomDateThisMonth(): Date {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const daysElapsed = differenceInDays(now, monthStart);
  const randomDays = Math.floor(Math.random() * (daysElapsed + 1));
  return addDays(monthStart, randomDays);
}

// Generate random date in the past N days
function randomDateInPast(days: number): Date {
  const randomDays = Math.floor(Math.random() * days);
  return subDays(new Date(), randomDays);
}

async function seed() {
  console.log("🌱 Starting seed...");

  // Clear existing data (order matters for foreign keys)
  console.log("🧹 Clearing existing data...");
  await db.delete(transactions);
  await db.delete(stores);
  await db.delete(funds);
  await db.delete(folders);
  await db.delete(users);

  // Create user
  console.log("👤 Creating user...");
  const [user] = await db
    .insert(users)
    .values({ name: "John Doe" })
    .returning();

  if (!user) {
    throw new Error("Failed to create user");
  }

  // Create folders and funds
  console.log("📁 Creating folders and funds...");
  const fundIdMap = new Map<string, number>();

  for (const folderSeed of folderSeeds) {
    const [folder] = await db
      .insert(folders)
      .values({
        name: folderSeed.name,
        userId: user.id,
      })
      .returning();

    if (!folder) {
      throw new Error(`Failed to create folder: ${folderSeed.name}`);
    }

    for (const fundSeed of folderSeed.funds) {
      const [fund] = await db
        .insert(funds)
        .values({
          name: fundSeed.name,
          budgetedAmount: fundSeed.budgetedAmount.toString(),
          fundType: fundSeed.fundType ?? "SPENDING",
          timeMode: fundSeed.timeMode,
          folderId: folder.id,
        })
        .returning();

      if (!fund) {
        throw new Error(`Failed to create fund: ${fundSeed.name}`);
      }
      fundIdMap.set(fundSeed.name, fund.id);
    }
  }

  // Create stores
  console.log("🏪 Creating stores...");
  const storeIdMap = new Map<string, number>();

  for (const storeName of storeSeeds) {
    const [store] = await db
      .insert(stores)
      .values({
        name: storeName,
        userId: user.id,
      })
      .returning();

    if (!store) {
      throw new Error(`Failed to create store: ${storeName}`);
    }
    storeIdMap.set(storeName, store.id);
  }

  // Create realistic transactions
  console.log("💳 Creating transactions...");

  const transactionSeeds = [
    // Bills - mostly paid in full
    {
      fund: "Rent",
      store: null,
      amount: "12000",
      note: "Monthly rent",
      daysAgo: 1,
    },
    {
      fund: "Electric",
      store: "Meralco",
      amount: "1450.50",
      note: "November bill",
      daysAgo: 5,
    },
    {
      fund: "Water",
      store: "Manila Water",
      amount: "320",
      note: null,
      daysAgo: 7,
    },
    {
      fund: "Internet",
      store: "Globe",
      amount: "1699",
      note: "Fiber plan",
      daysAgo: 3,
    },
    {
      fund: "Groceries",
      store: "SM Supermarket",
      amount: "850",
      note: "Weekly groceries",
      daysAgo: 2,
    },
    {
      fund: "Groceries",
      store: "SM Supermarket",
      amount: "425.75",
      note: null,
      daysAgo: 10,
    },

    // Frequent - multiple small transactions
    {
      fund: "Transportation",
      store: "Grab",
      amount: "85",
      note: "To office",
      daysAgo: 0,
    },
    {
      fund: "Transportation",
      store: "Grab",
      amount: "120",
      note: "Airport",
      daysAgo: 3,
    },
    {
      fund: "Transportation",
      store: null,
      amount: "50",
      note: "Jeep + MRT",
      daysAgo: 1,
    },
    {
      fund: "Eating Out",
      store: "Jollibee",
      amount: "189",
      note: "Lunch",
      daysAgo: 0,
    },
    {
      fund: "Eating Out",
      store: "McDonald's",
      amount: "245",
      note: "Dinner with friends",
      daysAgo: 2,
    },
    {
      fund: "Eating Out",
      store: "Starbucks",
      amount: "195",
      note: "Coffee meeting",
      daysAgo: 4,
    },
    {
      fund: "Eating Out",
      store: "Food Panda",
      amount: "320",
      note: "Late night delivery",
      daysAgo: 6,
    },
    {
      fund: "Laundry",
      store: null,
      amount: "275",
      note: "Laundry shop",
      daysAgo: 8,
    },
    {
      fund: "Dates",
      store: null,
      amount: "1200",
      note: "Anniversary dinner",
      daysAgo: 12,
    },

    // Self-development
    {
      fund: "Books",
      store: "National Bookstore",
      amount: "450",
      note: "Atomic Habits",
      daysAgo: 15,
    },
    {
      fund: "Gym",
      store: "Anytime Fitness",
      amount: "1000",
      note: "Monthly membership",
      daysAgo: 1,
    },

    // Subscriptions - exact amounts
    {
      fund: "Spotify",
      store: "Spotify",
      amount: "149",
      note: "Premium",
      daysAgo: 2,
    },
    {
      fund: "Netflix",
      store: "Netflix",
      amount: "349",
      note: "Standard",
      daysAgo: 5,
    },
    {
      fund: "iCloud",
      store: "Apple",
      amount: "49",
      note: "50GB plan",
      daysAgo: 10,
    },

    // Others - sporadic
    { fund: "Misc", store: "7-Eleven", amount: "85", note: null, daysAgo: 1 },
    { fund: "Misc", store: "7-Eleven", amount: "120", note: null, daysAgo: 4 },
    {
      fund: "Shopping",
      store: "Lazada",
      amount: "890",
      note: "Phone case",
      daysAgo: 8,
    },
    {
      fund: "Shopping",
      store: "Shopee",
      amount: "450",
      note: "Kitchen stuff",
      daysAgo: 14,
    },
  ];

  for (const txn of transactionSeeds) {
    const fundId = fundIdMap.get(txn.fund);
    if (!fundId) {
      throw new Error(`Fund not found: ${txn.fund}`);
    }

    const storeId = txn.store ? storeIdMap.get(txn.store) : null;

    await db.insert(transactions).values({
      fundId,
      storeId,
      userId: user.id,
      amount: txn.amount,
      date: subDays(new Date(), txn.daysAgo),
      note: txn.note,
    });
  }

  // Add some random transactions for variety
  const randomFunds = ["Transportation", "Eating Out", "Misc"];
  for (let i = 0; i < 10; i++) {
    const fundName =
      randomFunds[Math.floor(Math.random() * randomFunds.length)]!;
    const fundId = fundIdMap.get(fundName);
    if (!fundId) {
      continue;
    }

    await db.insert(transactions).values({
      fundId,
      userId: user.id,
      amount: randomAmount(50, 300),
      date: randomDateThisMonth(),
      note: null,
    });
  }

  console.log("✅ Seed completed!");
  console.log("   - 1 user");
  console.log(`   - ${folderSeeds.length} folders`);
  console.log(`   - ${fundIdMap.size} funds`);
  console.log(`   - ${storeSeeds.length} stores`);
  console.log(`   - ${transactionSeeds.length + 10} transactions`);

  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
