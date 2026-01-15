/**
 * Seed script for Money Manager database
 *
 * IMPORTANT: This seed uses Clerk for authentication.
 * Set SEED_USER_ID environment variable to your Clerk user ID before running.
 *
 * Usage:
 *   SEED_USER_ID=user_xxx pnpm seed
 *
 * All dates are relative to the current date when the seed is run.
 */

import {
  addDays,
  getDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import type { InferEnum } from "drizzle-orm";
import { db } from "./client";
import {
  folders,
  funds,
  type fundTypeEnum,
  stores,
  type timeModeEnum,
  transactions,
  users,
} from "./schema";

type FundType = InferEnum<typeof fundTypeEnum>;
type TimeMode = InferEnum<typeof timeModeEnum>;

// ============================================================================
// Configuration
// ============================================================================

const SEED_USER_ID = process.env.SEED_USER_ID;
const SEED_USER_NAME = process.env.SEED_USER_NAME ?? "Orlan";

if (!SEED_USER_ID) {
  console.error(
    "❌ SEED_USER_ID environment variable is required.\n" +
      "   Get your Clerk user ID from the Clerk dashboard or your app's auth context.\n" +
      "   Usage: SEED_USER_ID=user_xxx pnpm seed"
  );
  process.exit(1);
}

// ============================================================================
// Helper Functions
// ============================================================================

/** Get start of current week (Monday) */
function getCurrentWeekStart(): Date {
  return startOfWeek(new Date(), { weekStartsOn: 1 });
}

/** Get start of current month */
function getCurrentMonthStart(): Date {
  return startOfMonth(new Date());
}

/** Get start of current bi-monthly period (1st or 16th) */
function getCurrentBimonthlyStart(): Date {
  const now = new Date();
  const day = now.getDate();
  const month = startOfMonth(now);
  return day >= 16 ? addDays(month, 15) : month;
}

/** Get a random date within a period */
function randomDateInRange(start: Date, end: Date): Date {
  const startMs = start.getTime();
  const endMs = end.getTime();
  return new Date(startMs + Math.random() * (endMs - startMs));
}

/** Get a random amount between min and max */
function randomAmount(min: number, max: number): string {
  return (Math.random() * (max - min) + min).toFixed(2);
}

/** Pick a random element from an array */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

// ============================================================================
// Seed Data Definitions
// ============================================================================

type FundSeed = {
  name: string;
  timeMode: TimeMode;
  budgetedAmount: number;
  fundType?: FundType;
  dueDay?: number; // For NON_NEGOTIABLE funds
};

type FolderSeed = {
  name: string;
  funds: FundSeed[];
};

const folderSeeds: FolderSeed[] = [
  {
    name: "Bills",
    funds: [
      {
        name: "Rent",
        timeMode: "MONTHLY",
        budgetedAmount: 12_000,
        fundType: "NON_NEGOTIABLE",
        dueDay: 5, // Due on the 5th
      },
      {
        name: "Electric",
        timeMode: "MONTHLY",
        budgetedAmount: 2000,
        fundType: "NON_NEGOTIABLE",
        dueDay: 15,
      },
      {
        name: "Water",
        timeMode: "MONTHLY",
        budgetedAmount: 400,
        fundType: "NON_NEGOTIABLE",
        dueDay: 20,
      },
      {
        name: "Internet",
        timeMode: "MONTHLY",
        budgetedAmount: 1700,
        fundType: "NON_NEGOTIABLE",
        dueDay: 25,
      },
      { name: "Groceries", timeMode: "BIMONTHLY", budgetedAmount: 3000 },
    ],
  },
  {
    name: "Frequent",
    funds: [
      { name: "Transportation", timeMode: "WEEKLY", budgetedAmount: 500 },
      { name: "Eating Out", timeMode: "WEEKLY", budgetedAmount: 1000 },
      { name: "Laundry", timeMode: "BIMONTHLY", budgetedAmount: 300 },
      { name: "Dates", timeMode: "BIMONTHLY", budgetedAmount: 2000 },
    ],
  },
  {
    name: "Self-development",
    funds: [
      { name: "Books", timeMode: "MONTHLY", budgetedAmount: 800 },
      {
        name: "Gym",
        timeMode: "MONTHLY",
        budgetedAmount: 2500,
        fundType: "NON_NEGOTIABLE",
        dueDay: 1,
      },
      {
        name: "Online Courses",
        timeMode: "EVENTUALLY",
        budgetedAmount: 5000,
      },
    ],
  },
  {
    name: "Subscriptions",
    funds: [
      {
        name: "Spotify",
        timeMode: "MONTHLY",
        budgetedAmount: 194,
        fundType: "NON_NEGOTIABLE",
        dueDay: 10,
      },
      {
        name: "Netflix",
        timeMode: "MONTHLY",
        budgetedAmount: 549,
        fundType: "NON_NEGOTIABLE",
        dueDay: 12,
      },
      {
        name: "iCloud",
        timeMode: "MONTHLY",
        budgetedAmount: 49,
        fundType: "NON_NEGOTIABLE",
        dueDay: 8,
      },
      {
        name: "YouTube Premium",
        timeMode: "MONTHLY",
        budgetedAmount: 279,
        fundType: "NON_NEGOTIABLE",
        dueDay: 18,
      },
    ],
  },
  {
    name: "Fun & Personal",
    funds: [
      { name: "Coffee", timeMode: "WEEKLY", budgetedAmount: 400 },
      { name: "Shopping", timeMode: "MONTHLY", budgetedAmount: 2000 },
      { name: "Entertainment", timeMode: "BIMONTHLY", budgetedAmount: 1500 },
      { name: "Gifts", timeMode: "EVENTUALLY", budgetedAmount: 5000 },
    ],
  },
  {
    name: "Health",
    funds: [
      { name: "Medicine", timeMode: "MONTHLY", budgetedAmount: 500 },
      { name: "Vitamins", timeMode: "MONTHLY", budgetedAmount: 300 },
    ],
  },
];

const storeSeeds = [
  // Food & Restaurants
  "Jollibee",
  "McDonald's",
  "Starbucks",
  "Tim Hortons",
  "Yellow Cab",
  "Shakey's",
  "Chowking",
  "7-Eleven",
  "Ministop",
  "Food Panda",
  "GrabFood",
  // Groceries
  "SM Supermarket",
  "Robinsons Supermarket",
  "Puregold",
  "Landers",
  // Shopping
  "Lazada",
  "Shopee",
  "Uniqlo",
  "SM Department Store",
  // Transport
  "Grab",
  "Angkas",
  "LRT/MRT",
  "Petron",
  "Shell",
  // Bills
  "Meralco",
  "Manila Water",
  "Globe",
  "PLDT",
  // Subscriptions
  "Spotify",
  "Netflix",
  "Apple",
  "Google",
  // Health & Fitness
  "Anytime Fitness",
  "Mercury Drug",
  "Watsons",
  // Others
  "Fully Booked",
  "National Bookstore",
];

// ============================================================================
// Transaction Generation
// ============================================================================

type TransactionSeed = {
  fundName: string;
  storeName: string | null;
  amount: string;
  note: string | null;
  date: Date;
};

function generateTransactions(
  fundIdMap: Map<string, number>,
  today: Date
): TransactionSeed[] {
  const txns: TransactionSeed[] = [];

  // Current period starts
  const thisWeekStart = getCurrentWeekStart();
  const thisMonthStart = getCurrentMonthStart();
  const thisBimonthlyStart = getCurrentBimonthlyStart();

  // Previous periods for historical data
  const lastWeekStart = subWeeks(thisWeekStart, 1);
  const twoWeeksAgoStart = subWeeks(thisWeekStart, 2);
  const lastMonthStart = subMonths(thisMonthStart, 1);

  // -------------------------------------------------------------------------
  // BILLS - NON_NEGOTIABLES (some paid, some pending based on due date)
  // -------------------------------------------------------------------------

  // Rent - Due 5th (paid early this month)
  const rentDueDate = new Date(
    thisMonthStart.getFullYear(),
    thisMonthStart.getMonth(),
    5
  );
  if (today >= rentDueDate) {
    txns.push({
      fundName: "Rent",
      storeName: null,
      amount: "12000.00",
      note: "Monthly rent",
      date: subDays(rentDueDate, 1), // Paid day before due
    });
  }

  // Electric - Due 15th
  const electricDueDate = new Date(
    thisMonthStart.getFullYear(),
    thisMonthStart.getMonth(),
    15
  );
  if (today >= electricDueDate) {
    txns.push({
      fundName: "Electric",
      storeName: "Meralco",
      amount: randomAmount(1600, 2100),
      note: "Monthly bill",
      date: subDays(electricDueDate, 2),
    });
  }

  // Water - Due 20th
  const waterDueDate = new Date(
    thisMonthStart.getFullYear(),
    thisMonthStart.getMonth(),
    20
  );
  if (today >= waterDueDate) {
    txns.push({
      fundName: "Water",
      storeName: "Manila Water",
      amount: randomAmount(300, 450),
      note: null,
      date: subDays(waterDueDate, 3),
    });
  }

  // Internet - Due 25th
  const internetDueDate = new Date(
    thisMonthStart.getFullYear(),
    thisMonthStart.getMonth(),
    25
  );
  if (today >= internetDueDate) {
    txns.push({
      fundName: "Internet",
      storeName: "Globe",
      amount: "1699.00",
      note: "Fiber plan",
      date: subDays(internetDueDate, 1),
    });
  }

  // -------------------------------------------------------------------------
  // GROCERIES - Bimonthly (1-2 trips per period)
  // -------------------------------------------------------------------------
  // Current bi-monthly period
  txns.push({
    fundName: "Groceries",
    storeName: pickRandom([
      "SM Supermarket",
      "Robinsons Supermarket",
      "Puregold",
    ]),
    amount: randomAmount(1200, 1800),
    note: "Weekly groceries",
    date: randomDateInRange(thisBimonthlyStart, today),
  });

  // If we're past day 7 of bi-monthly, add another trip
  if (today.getDate() >= 7 || today.getDate() >= 22) {
    txns.push({
      fundName: "Groceries",
      storeName: pickRandom([
        "SM Supermarket",
        "Robinsons Supermarket",
        "Landers",
      ]),
      amount: randomAmount(800, 1400),
      note: null,
      date: randomDateInRange(addDays(thisBimonthlyStart, 5), today),
    });
  }

  // -------------------------------------------------------------------------
  // TRANSPORTATION - Weekly (daily commute pattern)
  // -------------------------------------------------------------------------
  // Current week - simulate work days
  const dayOfWeek = getDay(today);
  const workdaysPassed = Math.min(dayOfWeek === 0 ? 5 : dayOfWeek, 5);

  for (let i = 0; i < workdaysPassed; i++) {
    const txnDate = addDays(thisWeekStart, i);
    if (txnDate > today) break;

    // Morning commute
    txns.push({
      fundName: "Transportation",
      storeName: pickRandom(["Grab", "Angkas", "LRT/MRT"]),
      amount: randomAmount(45, 150),
      note: pickRandom(["To office", "Work", null]),
      date: txnDate,
    });

    // Sometimes evening commute (if not WFH)
    if (Math.random() > 0.3) {
      txns.push({
        fundName: "Transportation",
        storeName: pickRandom(["Grab", "LRT/MRT"]),
        amount: randomAmount(45, 120),
        note: pickRandom(["Going home", null]),
        date: addDays(txnDate, 0.5), // Same day, later
      });
    }
  }

  // Last week's transportation (fully spent)
  for (let i = 0; i < 5; i++) {
    const txnDate = addDays(lastWeekStart, i);
    txns.push({
      fundName: "Transportation",
      storeName: pickRandom(["Grab", "LRT/MRT", "Angkas"]),
      amount: randomAmount(80, 180),
      note: null,
      date: txnDate,
    });
  }

  // -------------------------------------------------------------------------
  // EATING OUT - Weekly (lunches and occasional dinners)
  // -------------------------------------------------------------------------
  // Current week meals
  for (let i = 0; i < workdaysPassed; i++) {
    const txnDate = addDays(thisWeekStart, i);
    if (txnDate > today) break;

    // Lunch (most days)
    if (Math.random() > 0.2) {
      txns.push({
        fundName: "Eating Out",
        storeName: pickRandom([
          "Jollibee",
          "McDonald's",
          "Chowking",
          "Yellow Cab",
        ]),
        amount: randomAmount(120, 280),
        note: pickRandom(["Lunch", null]),
        date: txnDate,
      });
    }
  }

  // Weekend dinner (if applicable)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    txns.push({
      fundName: "Eating Out",
      storeName: pickRandom(["Shakey's", "Yellow Cab", "Food Panda"]),
      amount: randomAmount(400, 700),
      note: "Weekend dinner",
      date: today,
    });
  }

  // Last week eating out
  for (let i = 0; i < 4; i++) {
    txns.push({
      fundName: "Eating Out",
      storeName: pickRandom([
        "Jollibee",
        "McDonald's",
        "Starbucks",
        "GrabFood",
      ]),
      amount: randomAmount(150, 350),
      note: null,
      date: randomDateInRange(lastWeekStart, thisWeekStart),
    });
  }

  // -------------------------------------------------------------------------
  // COFFEE - Weekly treats
  // -------------------------------------------------------------------------
  const coffeeShops = ["Starbucks", "Tim Hortons", "7-Eleven"];
  for (let i = 0; i < 3; i++) {
    const txnDate = addDays(
      thisWeekStart,
      Math.floor(Math.random() * (workdaysPassed + 1))
    );
    if (txnDate <= today) {
      txns.push({
        fundName: "Coffee",
        storeName: pickRandom(coffeeShops),
        amount: randomAmount(80, 200),
        note: null,
        date: txnDate,
      });
    }
  }

  // -------------------------------------------------------------------------
  // LAUNDRY - Bimonthly
  // -------------------------------------------------------------------------
  txns.push({
    fundName: "Laundry",
    storeName: null,
    amount: randomAmount(250, 320),
    note: "Laundry shop",
    date: randomDateInRange(thisBimonthlyStart, today),
  });

  // -------------------------------------------------------------------------
  // DATES - Bimonthly
  // -------------------------------------------------------------------------
  txns.push({
    fundName: "Dates",
    storeName: pickRandom(["Shakey's", "Yellow Cab", null]),
    amount: randomAmount(800, 1500),
    note: pickRandom(["Date night", "Dinner", null]),
    date: randomDateInRange(thisBimonthlyStart, today),
  });

  // -------------------------------------------------------------------------
  // SUBSCRIPTIONS - NON_NEGOTIABLES (auto-charged)
  // -------------------------------------------------------------------------
  // Spotify - Due 10th
  if (today.getDate() >= 10) {
    txns.push({
      fundName: "Spotify",
      storeName: "Spotify",
      amount: "194.00",
      note: "Premium",
      date: new Date(
        thisMonthStart.getFullYear(),
        thisMonthStart.getMonth(),
        10
      ),
    });
  }

  // Netflix - Due 12th
  if (today.getDate() >= 12) {
    txns.push({
      fundName: "Netflix",
      storeName: "Netflix",
      amount: "549.00",
      note: "Standard",
      date: new Date(
        thisMonthStart.getFullYear(),
        thisMonthStart.getMonth(),
        12
      ),
    });
  }

  // iCloud - Due 8th
  if (today.getDate() >= 8) {
    txns.push({
      fundName: "iCloud",
      storeName: "Apple",
      amount: "49.00",
      note: "50GB plan",
      date: new Date(
        thisMonthStart.getFullYear(),
        thisMonthStart.getMonth(),
        8
      ),
    });
  }

  // YouTube Premium - Due 18th
  if (today.getDate() >= 18) {
    txns.push({
      fundName: "YouTube Premium",
      storeName: "Google",
      amount: "279.00",
      note: "Family plan",
      date: new Date(
        thisMonthStart.getFullYear(),
        thisMonthStart.getMonth(),
        18
      ),
    });
  }

  // -------------------------------------------------------------------------
  // GYM - NON_NEGOTIABLE Monthly (Due 1st)
  // -------------------------------------------------------------------------
  if (today.getDate() >= 1) {
    txns.push({
      fundName: "Gym",
      storeName: "Anytime Fitness",
      amount: "2500.00",
      note: "Monthly membership",
      date: new Date(
        thisMonthStart.getFullYear(),
        thisMonthStart.getMonth(),
        1
      ),
    });
  }

  // -------------------------------------------------------------------------
  // BOOKS - Monthly (occasional purchase)
  // -------------------------------------------------------------------------
  if (Math.random() > 0.4) {
    txns.push({
      fundName: "Books",
      storeName: pickRandom(["Fully Booked", "National Bookstore", "Lazada"]),
      amount: randomAmount(300, 700),
      note: pickRandom(["New release", "Programming book", "Self-help", null]),
      date: randomDateInRange(thisMonthStart, today),
    });
  }

  // -------------------------------------------------------------------------
  // MEDICINE & VITAMINS - Monthly
  // -------------------------------------------------------------------------
  txns.push({
    fundName: "Medicine",
    storeName: pickRandom(["Mercury Drug", "Watsons"]),
    amount: randomAmount(200, 450),
    note: null,
    date: randomDateInRange(thisMonthStart, today),
  });

  txns.push({
    fundName: "Vitamins",
    storeName: pickRandom(["Mercury Drug", "Watsons", "Lazada"]),
    amount: randomAmount(250, 350),
    note: "Monthly vitamins",
    date: randomDateInRange(thisMonthStart, today),
  });

  // -------------------------------------------------------------------------
  // SHOPPING - Monthly (occasional purchases)
  // -------------------------------------------------------------------------
  const shoppingItems = [
    { amount: randomAmount(500, 1200), note: "Clothes" },
    { amount: randomAmount(200, 600), note: "Phone accessories" },
    { amount: randomAmount(300, 800), note: null },
  ];
  // Pick 1-2 shopping transactions
  const numShopping = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < numShopping; i++) {
    const item = shoppingItems[i]!;
    txns.push({
      fundName: "Shopping",
      storeName: pickRandom([
        "Lazada",
        "Shopee",
        "Uniqlo",
        "SM Department Store",
      ]),
      amount: item.amount,
      note: item.note,
      date: randomDateInRange(thisMonthStart, today),
    });
  }

  // -------------------------------------------------------------------------
  // ENTERTAINMENT - Bimonthly
  // -------------------------------------------------------------------------
  txns.push({
    fundName: "Entertainment",
    storeName: pickRandom(["SM Cinema", "Lazada", null]),
    amount: randomAmount(400, 900),
    note: pickRandom(["Movie", "Games", "Concert", null]),
    date: randomDateInRange(thisBimonthlyStart, today),
  });

  // -------------------------------------------------------------------------
  // ONLINE COURSES - Eventually (rare, large purchase)
  // -------------------------------------------------------------------------
  if (Math.random() > 0.7) {
    txns.push({
      fundName: "Online Courses",
      storeName: null,
      amount: randomAmount(1000, 3000),
      note: pickRandom(["Udemy course", "Frontend Masters", "Pluralsight"]),
      date: randomDateInRange(subMonths(today, 2), today),
    });
  }

  // -------------------------------------------------------------------------
  // GIFTS - Eventually (occasional)
  // -------------------------------------------------------------------------
  if (Math.random() > 0.6) {
    txns.push({
      fundName: "Gifts",
      storeName: pickRandom(["Lazada", "Shopee", "SM Department Store"]),
      amount: randomAmount(500, 2000),
      note: pickRandom(["Birthday gift", "Present", null]),
      date: randomDateInRange(subMonths(today, 1), today),
    });
  }

  // -------------------------------------------------------------------------
  // HISTORICAL DATA - Last month transactions for trends
  // -------------------------------------------------------------------------

  // Last month's bills (all paid)
  txns.push(
    {
      fundName: "Rent",
      storeName: null,
      amount: "12000.00",
      note: "Monthly rent",
      date: new Date(
        lastMonthStart.getFullYear(),
        lastMonthStart.getMonth(),
        4
      ),
    },
    {
      fundName: "Electric",
      storeName: "Meralco",
      amount: randomAmount(1500, 2000),
      note: "Monthly bill",
      date: new Date(
        lastMonthStart.getFullYear(),
        lastMonthStart.getMonth(),
        13
      ),
    },
    {
      fundName: "Water",
      storeName: "Manila Water",
      amount: randomAmount(280, 400),
      note: null,
      date: new Date(
        lastMonthStart.getFullYear(),
        lastMonthStart.getMonth(),
        18
      ),
    },
    {
      fundName: "Internet",
      storeName: "Globe",
      amount: "1699.00",
      note: "Fiber plan",
      date: new Date(
        lastMonthStart.getFullYear(),
        lastMonthStart.getMonth(),
        24
      ),
    }
  );

  // Last month subscriptions
  txns.push(
    {
      fundName: "Gym",
      storeName: "Anytime Fitness",
      amount: "2500.00",
      note: "Monthly membership",
      date: new Date(
        lastMonthStart.getFullYear(),
        lastMonthStart.getMonth(),
        1
      ),
    },
    {
      fundName: "Spotify",
      storeName: "Spotify",
      amount: "194.00",
      note: "Premium",
      date: new Date(
        lastMonthStart.getFullYear(),
        lastMonthStart.getMonth(),
        10
      ),
    },
    {
      fundName: "Netflix",
      storeName: "Netflix",
      amount: "549.00",
      note: "Standard",
      date: new Date(
        lastMonthStart.getFullYear(),
        lastMonthStart.getMonth(),
        12
      ),
    },
    {
      fundName: "iCloud",
      storeName: "Apple",
      amount: "49.00",
      note: "50GB plan",
      date: new Date(
        lastMonthStart.getFullYear(),
        lastMonthStart.getMonth(),
        8
      ),
    },
    {
      fundName: "YouTube Premium",
      storeName: "Google",
      amount: "279.00",
      note: "Family plan",
      date: new Date(
        lastMonthStart.getFullYear(),
        lastMonthStart.getMonth(),
        18
      ),
    }
  );

  return txns;
}

// ============================================================================
// Main Seed Function
// ============================================================================

async function seed() {
  const today = new Date();
  console.log("🌱 Starting seed...");
  console.log(`📅 Running date: ${today.toISOString()}`);
  console.log(`👤 User ID: ${SEED_USER_ID}`);

  // Clear existing data (order matters for foreign keys)
  console.log("\n🧹 Clearing existing data...");
  await db.delete(transactions);
  await db.delete(stores);
  await db.delete(funds);
  await db.delete(folders);
  await db.delete(users);

  // Create user with Clerk ID
  console.log("\n👤 Creating user...");
  const [user] = await db
    .insert(users)
    .values({
      id: SEED_USER_ID, // Clerk user ID
      name: SEED_USER_NAME,
    })
    .returning();

  if (!user) {
    throw new Error("Failed to create user");
  }

  // Create folders and funds
  console.log("\n📁 Creating folders and funds...");
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
      const fundType = fundSeed.fundType ?? "SPENDING";

      // Determine paidAt for NON_NEGOTIABLE funds
      let paidAt: Date | null = null;
      if (fundType === "NON_NEGOTIABLE" && fundSeed.dueDay) {
        const thisMonthDue = new Date(
          today.getFullYear(),
          today.getMonth(),
          fundSeed.dueDay
        );
        // If we're past the due date, mark as paid
        if (today >= thisMonthDue) {
          paidAt = subDays(thisMonthDue, Math.floor(Math.random() * 3) + 1);
        }
      }

      const [fund] = await db
        .insert(funds)
        .values({
          name: fundSeed.name,
          budgetedAmount: fundSeed.budgetedAmount.toString(),
          fundType,
          timeMode: fundSeed.timeMode,
          dueDay: fundSeed.dueDay,
          paidAt,
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
  console.log("\n🏪 Creating stores...");
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

  // Generate and insert transactions
  console.log("\n💳 Creating transactions...");
  const transactionSeeds = generateTransactions(fundIdMap, today);

  let txnCount = 0;
  for (const txn of transactionSeeds) {
    const fundId = fundIdMap.get(txn.fundName);
    if (!fundId) {
      console.warn(`⚠️  Fund not found: ${txn.fundName}, skipping transaction`);
      continue;
    }

    const storeId = txn.storeName ? storeIdMap.get(txn.storeName) : null;

    await db.insert(transactions).values({
      fundId,
      storeId: storeId ?? null,
      userId: user.id,
      amount: txn.amount,
      date: txn.date,
      note: txn.note,
    });

    txnCount++;
  }

  console.log("\n✅ Seed completed!");
  console.log("   Summary:");
  console.log(`   - 1 user (Clerk ID: ${SEED_USER_ID})`);
  console.log(`   - ${folderSeeds.length} folders`);
  console.log(`   - ${fundIdMap.size} funds`);
  console.log(`   - ${storeSeeds.length} stores`);
  console.log(`   - ${txnCount} transactions`);

  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
