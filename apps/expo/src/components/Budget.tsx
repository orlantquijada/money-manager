import type { Folder } from "api";
import { useEffect } from "react";
import type { PressableProps } from "react-native";
import { useSharedValue } from "react-native-reanimated";
// import * as ContextMenu from "zeego/context-menu";
import type { FundWithMeta } from "~/types";
import { pink } from "~/utils/colors";
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation";
import useToggle from "~/utils/hooks/useToggle";

const overspentColor = pink.pink8;

type Props = {
  folderId: Folder["id"];
  folderName: Folder["name"];
  amountLeft: number;
  funds: FundWithMeta[];
  defaultOpen?: boolean;
  /*
   * prop for animation —
   * open recently added folder, close everything else
   */
  isRecentlyAdded?: boolean | undefined;
};

export default function Budget({
  folderId,
  folderName,
  amountLeft,
  funds,
  defaultOpen = false,
  isRecentlyAdded,
  ...rest
}: PressableProps & Props) {
  const navigation = useRootStackNavigation();

  const open = useSharedValue(defaultOpen);

  useEffect(() => {
    if (isRecentlyAdded !== undefined) {
      open.value = isRecentlyAdded;
    }
  }, [open, isRecentlyAdded]);

  const didOverspend = amountLeft === 0;

  // TODO: save option on local storage
  const [show, { toggle }] = useToggle(true);

  const handleToggle = () => {
    open.value = !open.value;
    toggle();
  };

  return null;

  // return (
  //   <View className="overflow-visible">
  //     <ContextMenu.Root>
  //       <ContextMenu.Trigger style={{ borderRadius: 16 }}>
  //         <Pressable
  //           {...rest}
  //           className="rounded-2xl"
  //           onPress={(...args) => {
  //             open.value = !open.value;
  //             rest.onPress?.(...args);
  //           }}
  //         >
  //           {/* bg is mauve12 with 2% opacity */}
  //           <View className="flex-row items-center justify-between rounded-2xl bg-[#1a152307] p-4">
  //             <View className="flex-row items-center">
  //               <View className="relative h-4 w-4">
  //                 <StyledMotiView
  //                   animate={useDerivedValue(() => ({
  //                     opacity: open.value ? 1 : 0,
  //                   }))}
  //                   className="absolute inset-0"
  //                   transition={transitions.noTransition}
  //                 >
  //                   <FolderOpen height={16} width={16} />
  //                 </StyledMotiView>
  //                 <StyledMotiView
  //                   animate={useDerivedValue(() => ({
  //                     opacity: open.value ? 0 : 1,
  //                   }))}
  //                   className="absolute inset-0"
  //                   transition={transitions.noTransition}
  //                 >
  //                   <FolderClosed height={16} width={16} />
  //                 </StyledMotiView>
  //               </View>
  //               <Text className="ml-3 font-satoshi-medium text-base text-mauve12">
  //                 {folderName}
  //               </Text>
  //             </View>

  //             <StyledMotiView
  //               animate={useDerivedValue(() => ({
  //                 opacity: open.value ? 0 : 1,
  //               }))}
  //               className="flex-row items-end"
  //               transition={transitions.snappy}
  //             >
  //               <Text
  //                 className="font-satoshi text-sm"
  //                 style={{
  //                   // TODO: overspending for targets and non negotiable does not make sense na i-error ang color
  //                   color: didOverspend ? overspentColor : violet.violet12,
  //                 }}
  //               >
  //                 <Text className="font-nunito-semibold">
  //                   {toCurrencyNarrow(amountLeft)}{" "}
  //                 </Text>
  //                 <Text>left</Text>
  //               </Text>
  //             </StyledMotiView>
  //           </View>
  //         </Pressable>
  //       </ContextMenu.Trigger>

  //       <ContextMenu.Content>
  //         {/* <ContextMenu.Label>Label</ContextMenu.Label> */}
  //         <ContextMenu.Item
  //           destructive
  //           key="item 2"
  //           onSelect={() => {
  //             navigation.navigate("CreateFund", { folderId });
  //           }}
  //         >
  //           <ContextMenu.ItemTitle>Add</ContextMenu.ItemTitle>

  //           <ContextMenu.ItemIcon
  //             ios={{
  //               // name: "trash", // required
  //               name: "plus", // required
  //               scale: "small",
  //             }}
  //           />
  //         </ContextMenu.Item>
  //         {show ? (
  //           <ContextMenu.Item destructive key="item 1" onSelect={handleToggle}>
  //             <ContextMenu.ItemTitle>Show</ContextMenu.ItemTitle>

  //             <ContextMenu.ItemIcon
  //               ios={{
  //                 // name: "trash", // required
  //                 name: "eye", // required
  //                 scale: "small",
  //               }}
  //             />
  //           </ContextMenu.Item>
  //         ) : (
  //           <ContextMenu.Item destructive key="item 1" onSelect={handleToggle}>
  //             <ContextMenu.ItemTitle>Hide</ContextMenu.ItemTitle>

  //             <ContextMenu.ItemIcon
  //               ios={{
  //                 // name: "trash", // required
  //                 name: "eye.slash", // required
  //                 scale: "small",
  //               }}
  //             />
  //           </ContextMenu.Item>
  //         )}
  //       </ContextMenu.Content>
  //     </ContextMenu.Root>

  //     {funds.length ? (
  //       <AnimateHeight
  //         defaultOpen
  //         initalHeight={CATEGORY_HEIGHT * funds.length}
  //         open={open}
  //       >
  //         {funds.map((fund) => (
  //           <Category fund={fund} key={fund.id} />
  //         ))}
  //       </AnimateHeight>
  //     ) : (
  //       <AnimateHeight defaultOpen initalHeight={48} open={open}>
  //         <ScaleDownPressable
  //           className="h-12 w-full items-center justify-center"
  //           onPress={() => {
  //             navigation.navigate("CreateFund", { folderId });
  //           }}
  //         >
  //           <Text className="font-satoshi text-mauve11 text-sm">
  //             Add a fund to this folder
  //           </Text>
  //         </ScaleDownPressable>
  //       </AnimateHeight>
  //     )}
  //   </View>
  // );
}
