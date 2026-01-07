import {
  Button,
  ContextMenu,
  Host,
  HStack,
  Image,
  VStack,
} from "@expo/ui/swift-ui";
import { frame, glassEffect, padding } from "@expo/ui/swift-ui/modifiers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert } from "react-native";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";
import { toCurrencyNarrow } from "@/utils/format";

// TODO: Remove this toggle after deciding on final design
const EMPHASIZE_AMOUNT = false;

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const menuColor = useThemeColor("muted");
  const iconColor = useThemeColor("muted-foreground");

  const { data: transaction, isLoading } = useQuery(
    trpc.transaction.retrieve.queryOptions(id)
  );

  const deleteMutation = useMutation(
    trpc.transaction.delete.mutationOptions({
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        queryClient.invalidateQueries();
        router.back();
      },
    })
  );

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Edit", "Edit functionality coming soon");
  };

  const handleDuplicate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/(app)/(tabs)/add-expense",
      params: {
        fundId: transaction?.fundId,
        amount: transaction?.amount,
      },
    });
  };

  const handleViewFund = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/fund/${transaction?.fundId}`);
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMutation.mutate(id),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <StyledLeanView className="flex-1 items-center justify-center">
        <StyledLeanText className="text-foreground-muted">
          Loading...
        </StyledLeanText>
      </StyledLeanView>
    );
  }

  if (!transaction) {
    return (
      <StyledLeanView className="flex-1 items-center justify-center">
        <StyledLeanText className="text-foreground-muted">
          Transaction not found
        </StyledLeanText>
      </StyledLeanView>
    );
  }

  const amount = Number(transaction.amount);
  const date = transaction.date ? new Date(transaction.date) : null;
  const { fund, store } = transaction;
  const title = store?.name ?? fund.name;

  const menuPadding = 16;

  return (
    <StyledLeanView className="flex-1 pt-4">
      {/* Header */}
      <StyledLeanView className="relative flex-row items-center justify-between pb-6 pl-4">
        <StyledLeanText
          className="flex-1 font-satoshi-medium text-foreground text-xl"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {title}
        </StyledLeanText>
        <Host
          matchContents
          style={{
            paddingRight: menuPadding,
          }}
        >
          <ContextMenu>
            <ContextMenu.Items>
              <Button onPress={handleEdit} systemImage="pencil">
                Edit
              </Button>
              <Button onPress={handleDuplicate} systemImage="doc.on.doc">
                Duplicate
              </Button>
              <Button onPress={handleViewFund} systemImage="folder">
                View Fund
              </Button>
              <Button
                onPress={handleDelete}
                role="destructive"
                systemImage="trash"
              >
                Delete
              </Button>
            </ContextMenu.Items>
            <ContextMenu.Trigger>
              <VStack
                alignment="trailing"
                modifiers={[
                  padding({
                    vertical: menuPadding / 2,
                    horizontal: menuPadding,
                  }),
                ]}
              >
                <HStack
                  modifiers={[
                    frame({ width: 40, height: 40 }),
                    glassEffect({
                      glass: {
                        variant: "regular",
                        interactive: true,
                        tint: menuColor,
                      },
                      shape: "circle",
                    }),
                  ]}
                >
                  <Image color={iconColor} size={18} systemName="ellipsis" />
                </HStack>
              </VStack>
            </ContextMenu.Trigger>
          </ContextMenu>
        </Host>
      </StyledLeanView>

      {/* Emphasized Amount */}
      {EMPHASIZE_AMOUNT && (
        <StyledLeanView className="items-center py-6">
          <StyledLeanText className="font-nunito-bold text-4xl text-foreground">
            {toCurrencyNarrow(amount)}
          </StyledLeanText>
        </StyledLeanView>
      )}

      {/* Details */}
      <StyledLeanView className="gap-2.5 px-4">
        {!EMPHASIZE_AMOUNT && (
          <DetailRow isAmount label="Amount" value={toCurrencyNarrow(amount)} />
        )}
        {date && (
          <DetailRow
            label="Created at"
            value={format(date, "MMMM d, h:mm a")}
          />
        )}
        {fund.name && <DetailRow label="Fund" value={fund.name} />}
        {store && <DetailRow label="Store" value={store.name} />}
        {transaction.note && (
          <DetailRow label="Note" value={transaction.note} />
        )}
      </StyledLeanView>
    </StyledLeanView>
  );
}

function DetailRow({
  label,
  value,
  isAmount = false,
}: {
  label: string;
  value: string;
  isAmount?: boolean;
}) {
  return (
    <StyledLeanView className="flex-row items-center justify-between">
      <StyledLeanText className="font-satoshi-semibold text-base text-foreground-muted">
        {label}
      </StyledLeanText>
      <StyledLeanText
        className={cn(
          "max-w-50 font-satoshi-semibold text-base text-foreground",
          isAmount && "font-nunito-semibold"
        )}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {value}
      </StyledLeanText>
    </StyledLeanView>
  );
}
