import { useRef } from "react";
import { ScrollView, Text, View } from "react-native";

import type { setScreen } from "~/screens/create-fund";
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation";
import { useRootStackRoute } from "~/utils/hooks/useRootStackRoute";
import { trpc } from "~/utils/trpc";
import Footer from "../CreateFooter";
import Presence from "../Presence";
import { CurrencyInput } from "../TextInput";
import Choice from "./Choice";
import { useFormData } from "./context";

export default function NonNegotiableInfo({
  onBackPress,
  setScreen,
}: {
  onBackPress: () => void;
  setScreen: setScreen;
}) {
  const route = useRootStackRoute("CreateFund");
  const currencyInputRef = useRef<CurrencyInput>(null);
  const { setFormValues, formData } = useFormData();
  const createFund = trpc.fund.create.useMutation();
  const navigation = useRootStackNavigation();

  const handleSetFormValues = () => {
    const budgetedAmount = currencyInputRef.current?.getValue() || 0;
    setFormValues({ budgetedAmount, timeMode: "MONTHLY" });
  };
  const utils = trpc.useContext();

  return (
    <>
      <ScrollView
        className="p-4 pt-0"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View className="flex gap-y-8">
          <View className="gap-y-[10px]">
            <Presence delayMultiplier={3}>
              <Text className="font-satoshi-medium text-lg text-mauveDark12">
                How do you intend to budget this fund?
              </Text>
            </Presence>

            <View className="flex w-3/5">
              <Presence delayMultiplier={4}>
                <Choice choiceLabel="A" className="mb-2" selected>
                  Monthly
                </Choice>
              </Presence>
            </View>
          </View>

          <Presence delayMultiplier={6}>
            <View className="gap-[10px]">
              <Text className="font-satoshi-medium text-lg text-mauveDark12">
                How much wil you allocate?
              </Text>
              <CurrencyInput
                defaultValue={formData.budgetedAmount?.toString()}
                ref={currencyInputRef}
              />
            </View>
          </Presence>
        </View>
      </ScrollView>
      <Footer
        onBackPress={onBackPress}
        onContinuePress={() => {
          const folderId = route.params?.folderId;

          if (!folderId) {
            handleSetFormValues();
            setScreen("chooseFolder");
            return;
          }

          const budgetedAmount = currencyInputRef.current?.getValue() || 0;
          createFund.mutate(
            {
              ...formData,
              budgetedAmount,
              folderId,
              timeMode: "MONTHLY",
            },
            {
              onSuccess: () => {
                utils.fund.list.invalidate();
                utils.folder.listWithFunds.invalidate().then(() => {
                  navigation.navigate("Root", {
                    screen: "Home",
                    params: {
                      screen: "Budgets",
                      params: {
                        recentlyAddedToFolderId: folderId,
                      },
                    },
                  });
                });
              },
            }
          );
        }}
      >
        Continue
      </Footer>
    </>
  );
}
