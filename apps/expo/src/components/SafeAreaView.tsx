import { View, ViewProps } from "react-native"
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context"
import { styled } from "nativewind"

import { totalContentInset } from "~/navigation/TabBar"

type Props = {
  insets?: EdgeInsets
} & ViewProps

// NOTE: use this instead of react-native's `SafeAreaView`
function SafeAreaView(props: Props) {
  const { insets: insetsProp } = props
  const insets = useSafeAreaInsets()

  const _insets =
    insetsProp === undefined
      ? { ...insets, bottom: totalContentInset }
      : insetsProp

  return (
    <View
      {...props}
      style={[
        {
          paddingTop: _insets.top,
          paddingLeft: _insets.left,
          paddingRight: _insets.right,
          paddingBottom: _insets.bottom,
        },
        props.style,
      ]}
    />
  )
}

export default styled(SafeAreaView)
