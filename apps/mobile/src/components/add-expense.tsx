import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Button from "@/components/button";
import ModalCloseBtn from "@/components/modal-close-btn";
import { ScalePressable } from "@/components/scale-pressable";
import TextInput, { CurrencyInput } from "@/components/text-input";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";
import { mauveDark } from "@/utils/colors";
import { toCurrencyNarrow } from "@/utils/format";

export default function AddExpense() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedFundId, setSelectedFundId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const { data: funds, isLoading } = useQuery(trpc.fund.list.queryOptions());

  const createTransaction = useMutation(
    trpc.transaction.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries();
        router.replace({ pathname: "/(app)/(tabs)/(dashboard)" });
      },
    })
  );

  const parsedAmount = Number.parseFloat(amount) || 0;
  const canSubmit = selectedFundId !== null && parsedAmount > 0;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    createTransaction.mutate({
      fundId: selectedFundId,
      amount: parsedAmount,
      note: note.trim() || undefined,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-mauveDark1 pt-4"
      keyboardVerticalOffset={100}
    >
      <Link asChild href={{ pathname: "/" }} replace>
        <ModalCloseBtn className="mb-6 ml-4" />
      </Link>

      <View className="flex-1 px-4">
        {/* Amount Input */}
        <View className="mb-8 gap-2.5">
          <Text className="font-satoshi-medium text-lg text-mauveDark12">
            How much did you spend?
          </Text>
          <CurrencyInput
            autoFocus
            onChangeText={setAmount}
            placeholder="0.00"
            value={amount}
          />
        </View>

        {/* Fund Selection */}
        <View className="mb-8 flex-1 gap-2.5">
          <Text className="font-satoshi-medium text-lg text-mauveDark12">
            From which fund?
          </Text>

          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color={mauveDark.mauve11} />
            </View>
          ) : (
            <ScrollView
              className="flex-1"
              contentContainerClassName="gap-2 pb-4"
              showsVerticalScrollIndicator={false}
            >
              {funds?.map((fund) => {
                const remaining = fund.budgetedAmount - fund.totalSpent;
                const isSelected = selectedFundId === fund.id;

                return (
                  <ScalePressable
                    className={cn(
                      "flex-row items-center justify-between rounded-xl px-4 py-3",
                      isSelected ? "bg-violet4" : "bg-mauveDark4"
                    )}
                    key={fund.id}
                    onPress={() => setSelectedFundId(fund.id)}
                    scaleValue={0.98}
                    style={{ borderCurve: "continuous" }}
                  >
                    <View className="flex-1">
                      <Text
                        className={cn(
                          "font-satoshi-medium text-base",
                          isSelected ? "text-violet11" : "text-mauveDark12"
                        )}
                      >
                        {fund.name}
                      </Text>
                      <Text
                        className={cn(
                          "font-inter text-sm",
                          isSelected ? "text-violet10" : "text-mauveDark10"
                        )}
                      >
                        {toCurrencyNarrow(remaining)} remaining
                      </Text>
                    </View>

                    {isSelected && (
                      <View
                        className="h-5 w-5 items-center justify-center rounded-full bg-violet9"
                        style={{ borderCurve: "continuous" }}
                      >
                        <View className="h-2 w-2 rounded-full bg-white" />
                      </View>
                    )}
                  </ScalePressable>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Note Input */}
        <View className="mb-6 gap-2.5">
          <Text className="font-satoshi-medium text-lg text-mauveDark12">
            Note{" "}
            <Text className="font-inter text-mauveDark10 text-sm">
              (optional)
            </Text>
          </Text>
          <TextInput
            onChangeText={setNote}
            placeholder="What was this for?"
            value={note}
          />
        </View>
      </View>

      {/* Submit Button */}
      <View className="border-mauveDark4 border-t px-4 py-4">
        <Button
          className="h-12 w-full"
          disabled={!canSubmit || createTransaction.isPending}
          onPress={handleSubmit}
        >
          <Text
            className={cn(
              "font-satoshi-medium text-base",
              !canSubmit || createTransaction.isPending
                ? "text-mauveDark8"
                : "text-mauveDark1"
            )}
          >
            {createTransaction.isPending ? "Adding..." : "Add Expense"}
          </Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
