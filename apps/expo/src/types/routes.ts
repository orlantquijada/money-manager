import { NavigatorScreenParams } from "@react-navigation/native"

import { Folder } from ".prisma/client"

export type RootBottomTabParamList = {
  Home: undefined
  AddTransaction: undefined
  Transactions: undefined
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootBottomTabParamList>
  CreateFund: { folderId?: Folder["id"] }
  CreateFolder: undefined
  // FolderDetail: { folder: Folder }
}
