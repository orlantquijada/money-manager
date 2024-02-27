import { prisma } from "../index"

// BUG: data can't be used because `id` must be synced with clerk user id
async function main() {
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
    },
  })
  const others = await prisma.folder.create({
    data: {
      name: "Others",
      userId: user.id,
    },
  })
  const subscriptions = await prisma.folder.create({
    data: {
      name: "Subscriptions",
      userId: user.id,
    },
  })
  const selfDevelopment = await prisma.folder.create({
    data: {
      name: "Self Development",
      userId: user.id,
    },
  })
  const frequent = await prisma.folder.create({
    data: {
      name: "Frequent",
      userId: user.id,
    },
  })
  const bills = await prisma.folder.create({
    data: {
      name: "Bills",
      userId: user.id,
    },
  })

  await prisma.fund.createMany({
    data: [
      {
        name: "Misc",
        timeMode: "MONTHLY",
        folderId: others.id,
        budgetedAmount: 500,
      },
      {
        name: "Shopping",
        timeMode: "BIMONTHLY",
        folderId: others.id,
        budgetedAmount: 1000,
      },
      {
        name: "Spotify",
        timeMode: "MONTHLY",
        folderId: subscriptions.id,
        budgetedAmount: 150,
      },
      {
        name: "Disney+",
        timeMode: "MONTHLY",
        folderId: subscriptions.id,
        budgetedAmount: 350,
      },
      {
        name: "Books",
        timeMode: "MONTHLY",
        folderId: selfDevelopment.id,
        budgetedAmount: 800,
      },
      {
        name: "Gym",
        timeMode: "MONTHLY",
        folderId: selfDevelopment.id,
        budgetedAmount: 1000,
      },
      {
        name: "Laundry",
        timeMode: "BIMONTHLY",
        folderId: frequent.id,
        budgetedAmount: 275,
      },
      {
        name: "Transportation",
        timeMode: "BIMONTHLY",
        folderId: frequent.id,
        budgetedAmount: 300,
      },
      {
        name: "Eating Out",
        timeMode: "WEEKLY",
        folderId: frequent.id,
        budgetedAmount: 750,
      },
      {
        name: "Dates",
        timeMode: "BIMONTHLY",
        folderId: frequent.id,
        budgetedAmount: 1500,
      },
      {
        name: "Groceries",
        timeMode: "BIMONTHLY",
        folderId: bills.id,
        budgetedAmount: 1500,
      },
      {
        name: "Electric",
        timeMode: "MONTHLY",
        fundType: "NON_NEGOTIABLE",
        folderId: bills.id,
        budgetedAmount: 1500,
      },
      {
        name: "Rent",
        timeMode: "MONTHLY",
        fundType: "NON_NEGOTIABLE",
        folderId: bills.id,
        budgetedAmount: 12000,
      },
      {
        name: "Internet",
        timeMode: "MONTHLY",
        fundType: "NON_NEGOTIABLE",
        folderId: bills.id,
        budgetedAmount: 1700,
      },
      {
        name: "Water",
        timeMode: "MONTHLY",
        fundType: "NON_NEGOTIABLE",
        folderId: bills.id,
        budgetedAmount: 350,
      },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
