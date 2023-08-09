import { NavigatorScreenParams } from "@react-navigation/native"

import { Folder } from ".prisma/client"

export type HomeTabsParamList = {
  Budgets?: { recentlyAddedToFolderId?: Folder["id"] }
  Transactions: undefined
}

export type RootBottomTabParamList = {
  Home?: NavigatorScreenParams<HomeTabsParamList>
  AddTransaction: undefined
  Transactions: undefined
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootBottomTabParamList>
  CreateFund?: { folderId: Folder["id"] }
  CreateFolder: undefined
  // FolderDetail: { folder: Folder }
}
