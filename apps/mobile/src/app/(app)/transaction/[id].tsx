import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import GlassIconButton from "@/components/glass-icon-button";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";
import { toCurrencyNarrow, toDateTime } from "@/utils/format";

// TODO: Remove this toggle after deciding on final design
const EMPHASIZE_AMOUNT = false;

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

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

        <Menu
          handleDelete={handleDelete}
          handleDuplicate={handleDuplicate}
          handleEdit={handleEdit}
          handleViewFund={handleViewFund}
        />
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
        {date && <DetailRow label="Created at" value={toDateTime(date)} />}
        {fund.name && <DetailRow label="Fund" value={fund.name} />}
        {store && <DetailRow label="Store" value={store.name} />}
        {transaction.note && (
          <DetailRow label="Note" value={transaction.note} />
        )}
      </StyledLeanView>
    </StyledLeanView>
  );
}

type MenuProps = {
  handleDelete: () => void;
  handleDuplicate: () => void;
  handleEdit: () => void;
  handleViewFund: () => void;
};

function Menu({
  handleDelete,
  handleDuplicate,
  handleEdit,
  handleViewFund,
}: MenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <StyledLeanView className="px-4 py-2">
          <GlassIconButton icon="ellipsis" />
        </StyledLeanView>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item key="edit" onSelect={handleEdit}>
          <DropdownMenu.ItemTitle>Edit</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon ios={{ name: "pencil" }} />
        </DropdownMenu.Item>
        <DropdownMenu.Item key="duplicate" onSelect={handleDuplicate}>
          <DropdownMenu.ItemTitle>Duplicate</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon ios={{ name: "doc.on.doc" }} />
        </DropdownMenu.Item>
        <DropdownMenu.Item key="view-fund" onSelect={handleViewFund}>
          <DropdownMenu.ItemTitle>View Fund</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon ios={{ name: "folder" }} />
        </DropdownMenu.Item>
        <DropdownMenu.Item destructive key="delete" onSelect={handleDelete}>
          <DropdownMenu.ItemTitle>Delete</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon ios={{ name: "trash" }} />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
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
