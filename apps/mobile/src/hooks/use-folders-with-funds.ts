import { useQuery } from "@tanstack/react-query";
import { endOfMonth, startOfMonth } from "date-fns";
import { fundWithMeta } from "@/lib/fund";
import { trpc } from "@/utils/api";

export function useFoldersWithFunds() {
  const now = new Date();

  return useQuery(
    trpc.folder.listWithFunds.queryOptions(
      { startDate: startOfMonth(now), endDate: endOfMonth(now) },
      {
        select: (folders) =>
          folders.map((folder) => ({
            ...folder,
            funds: folder.funds.map(fundWithMeta),
          })),
      }
    )
  );
}
