import {StyleSheet, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useIntl} from "react-intl";
import {Input} from "@/components/text-input";
import {useState} from "react";
import {ThemedLinkButton} from "@/components/themed-button";
import {GradientBackground} from "@/components/gradient-background";
import {useUserStore} from "@/store/user-store";

export const Welcome = () => {
  const {top, bottom} = useSafeAreaInsets();
  const [name, setName] = useState<string>("");
  const saveName = useUserStore((state) => state.setName);
  const intl = useIntl();

  const onContinue = () => saveName(name);

  return (
    <GradientBackground style={[styles.container,
      {paddingTop: top, paddingBottom: bottom}]}>
      <View style={styles.innerContainer}>
      <Input value={name} setValue={setName} title={intl.formatMessage({
        id: 'welcome.nameLabel',
        defaultMessage: 'Set your name',
        description: 'Label above the name field on the first-run welcome screen',
      })} />
      </View>
      <ThemedLinkButton title={intl.formatMessage({
                          id: 'welcome.continue',
                          defaultMessage: 'Navigate to main screen',
                          description: 'Button that stores the entered name and enters the app',
                        })}
                        disabled={name.trim().length === 0}
                        onPress={onContinue} />
    </GradientBackground>
  )
}

const styles = StyleSheet.create(({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "90%",
    width: "100%",
  }
}))
