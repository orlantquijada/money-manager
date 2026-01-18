import { useCallback, useRef } from "react";
import { ScrollView, Text } from "react-native";
import { makeMutable, type SharedValue } from "react-native-reanimated";
import Budget from "@/components/budgets/budget";
import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText } from "@/config/interop";
import { useFabHeight } from "@/hooks/use-fab-height";
import { useFoldersWithFunds } from "@/hooks/use-folders-with-funds";

function useOpenStates() {
  const statesRef = useRef<Map<number, SharedValue<boolean>>>(new Map());

  const getOpenState = useCallback((id: number): SharedValue<boolean> => {
    const existing = statesRef.current.get(id);
    if (existing) return existing;

    // makeMutable creates a real SharedValue outside of hooks
    const sharedValue = makeMutable(true);
    statesRef.current.set(id, sharedValue);

    return sharedValue;
  }, []);

  const collapseAll = useCallback(() => {
    for (const state of statesRef.current.values()) {
      state.value = false;
    }
  }, []);

  return { getOpenState, collapseAll };
}

export default function BudgetsScreen() {
  const { data: foldersWithFunds, isLoading } = useFoldersWithFunds();
  const { getOpenState, collapseAll } = useOpenStates();
  const fabHeight = useFabHeight();

  return (
    <ScrollView
      className="flex-1 px-4"
      contentContainerClassName="gap-3 pt-4 min-h-full"
      contentContainerStyle={{ paddingBottom: fabHeight + 16 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      {foldersWithFunds && foldersWithFunds.length > 0 && (
        <ScalePressable
          className="self-end rounded-lg px-3 py-1.5"
          onPress={collapseAll}
          scaleValue={0.95}
        >
          <StyledLeanText className="font-satoshi-medium text-foreground-muted text-sm">
            Collapse all
          </StyledLeanText>
        </ScalePressable>
      )}

      {foldersWithFunds?.map((folder) => (
        <Budget
          folderId={folder.id}
          folderName={folder.name}
          funds={folder.funds}
          key={folder.id}
          open={getOpenState(folder.id)}
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
  );
}
