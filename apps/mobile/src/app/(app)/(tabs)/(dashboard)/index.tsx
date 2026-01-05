import { ScrollView, Text } from "react-native";
import Budget from "@/components/budgets/budget";
import FadingEdge, { useOverflowFadeEdge } from "@/components/fading-edge";
import { TAB_BAR_HEIGHT } from "@/components/tab-bar";
import { useTheme } from "@/components/theme-provider";
import { useFoldersWithFunds } from "@/hooks/use-folders-with-funds";
import { theme, themeDark } from "@/utils/colors";

export default function BudgetsScreen() {
  const { isDark } = useTheme();
  const { data: foldersWithFunds, isLoading } = useFoldersWithFunds();
  const { fadeProps, handleScroll } = useOverflowFadeEdge({
    offset: { end: 0 },
  });

  return (
    <FadingEdge
      fadeColor={
        isDark ? themeDark.background.DEFAULT : theme.background.DEFAULT
      }
      {...fadeProps}
      style={{ marginBottom: TAB_BAR_HEIGHT }}
    >
      <ScrollView
        className="flex-1 bg-violet1/0 px-4"
        contentContainerClassName="gap-3 py-4"
        onScroll={handleScroll}
      >
        {/* {isLoading && ( */}
        {/*   <Text className="text-center text-mauveDark3">Loading...</Text> */}
        {/* )} */}

        {foldersWithFunds?.map((folder) => (
          <Budget
            folderId={folder.id}
            folderName={folder.name}
            funds={folder.funds}
            key={folder.id}
          />
        ))}

        {/* {foldersWithFunds?.map((folder) => ( */}
        {/*   <View className="gap-3" key={folder.id}> */}
        {/*     <Text className="font-satoshi-medium text-lg text-mauveDark3"> */}
        {/*       {folder.name} */}
        {/*     </Text> */}
        {/**/}
        {/*     <View className="gap-2"> */}
        {/*       {folder.funds.map((fund) => ( */}
        {/*         <View className="rounded-xl bg-mauveDark10 p-4" key={fund.id}> */}
        {/*           <View className="flex-row items-center justify-between"> */}
        {/*             <Text className="font-satoshi-medium text-base text-mauveDark1"> */}
        {/*               {fund.name} */}
        {/*             </Text> */}
        {/*             <View className="rounded-full bg-mauveDark6 px-2 py-0.5"> */}
        {/*               <Text className="font-satoshi-medium text-mauveDark2 text-xs"> */}
        {/*                 {fund.fundType} */}
        {/*               </Text> */}
        {/*             </View> */}
        {/*           </View> */}
        {/**/}
        {/*           <View className="mt-2 flex-row justify-between"> */}
        {/*             <Text className="font-satoshi-medium text-mauveDark3 text-sm"> */}
        {/*               Budget: ₱{fund.budgetedAmount.toLocaleString()} */}
        {/*             </Text> */}
        {/*             <Text className="font-satoshi-medium text-mauveDark3 text-sm"> */}
        {/*               Spent: ₱{fund.totalSpent.toLocaleString()} */}
        {/*             </Text> */}
        {/*           </View> */}
        {/**/}
        {/*           <View className="mt-2 h-2 overflow-hidden rounded-full bg-mauveDark5"> */}
        {/*             <View */}
        {/*               className="h-full rounded-full bg-mauveDark1" */}
        {/*               style={{ */}
        {/*                 width: `${Math.min((fund.totalSpent / fund.budgetedAmount) * 100, 100)}%`, */}
        {/*               }} */}
        {/*             /> */}
        {/*           </View> */}
        {/*         </View> */}
        {/*       ))} */}
        {/**/}
        {/*       {folder.funds.length === 0 && ( */}
        {/*         <Text className="text-center text-mauveDark4 text-sm"> */}
        {/*           No funds in this folder */}
        {/*         </Text> */}
        {/*       )} */}
        {/*     </View> */}
        {/*   </View> */}
        {/* ))} */}

        {!isLoading && foldersWithFunds?.length === 0 && (
          <Text className="text-center text-mauveDark3">
            No folders yet. Create a fund to get started!
          </Text>
        )}
      </ScrollView>
    </FadingEdge>
  );
}
