import {FormattedNumber} from "react-intl";

import {useUserStore} from "@/store/user-store";
import {StyleSheet, Text, View} from "react-native";

export const ThemedBalance = () => {
  const balance = useUserStore((state) => state.balance);

  return (
    <View style={styles.container}>
    <Text style={styles.text}>
      <FormattedNumber value={balance}/>
    </Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  }
})
