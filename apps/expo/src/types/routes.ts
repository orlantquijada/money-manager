import type { NavigatorScreenParams } from "@react-navigation/native";
import type { Folder, Fund } from "api";

export type HomeTabsParamList = {
  Budgets?: { recentlyAddedToFolderId?: Folder["id"] };
  Transactions: undefined;
};

export type RootBottomTabParamList = {
  Home?: NavigatorScreenParams<HomeTabsParamList>;
  AddTransaction?: {
    fundId?: Fund["id"] | undefined;
    amount?: number | undefined;
  };
  Transactions: undefined;
};

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootBottomTabParamList>;
  CreateFund?: { folderId: Folder["id"] };
  CreateFolder: undefined;
  TransactionsList: { fundId: Fund["id"]; fundName: Fund["name"] };
  // FolderDetail: { folder: Folder }
  Welcome: undefined;
  Onboarding: undefined;
};
