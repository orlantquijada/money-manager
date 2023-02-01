import { NavigatorScreenParams } from "@react-navigation/native"

export type RootBottomTabParamList = {
  Home: undefined
  AddTransaction: undefined
  Transactions: undefined
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootBottomTabParamList>
  CreateFund: undefined
  CreateFolder: undefined
}
