import {Image} from "expo-image";
import {FormattedMessage, FormattedNumber, useIntl} from "react-intl";
import {Platform, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {BottomTabInset, MaxContentWidth, Spacing} from "@/constants/theme";
import {useTheme} from "@/hooks/use-theme";
import {ThemedView} from "@/components/themed-view";
import {WebBadge} from "@/components/web-badge";
import {ThemedText} from "@/components/themed-text";
import {WATCHES} from "@/models/watch";
import {useUserStore} from "@/store/user-store";

export const Profile = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();
  const text = theme.text;
  const intl = useIntl();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  const balance = useUserStore((state) => state.balance);
  const name = useUserStore((state) => state.name);
  const ownedWatchIds = useUserStore((state) => state.ownedWatchIds);
  const sellWatch = useUserStore((state) => state.sellWatch);

  const owned = ownedWatchIds.map((id) => WATCHES[id]);
  const portfolioValue = owned.reduce((total, watch) => total + watch.price, 0);

  return (
    <ScrollView
      style={[styles.scrollView, {backgroundColor: theme.background}]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <Text style={[styles.title, {color: text}]}>
          <FormattedMessage
            id="profile.name"
            defaultMessage="Name: {name}"
            description="Label and value for the player's chosen name"
            values={{name}}
          />
        </Text>
        <Text style={[styles.title, {color: text}]}>
          {/* `number` inside the message so the amount follows the locale's
              digit grouping without splitting the sentence in two. */}
          <FormattedMessage
            id="profile.balance"
            defaultMessage="Balance: {balance, number}"
            description="Label and value for the player's spendable balance"
            values={{balance}}
          />
        </Text>
        {owned.length === 0 ? (
          <ThemedText themeColor="textSecondary">
            <FormattedMessage
              id="profile.empty"
              defaultMessage="No watches yet — open a box to win one."
              description="Shown on the profile when the player owns no watches"
            />
          </ThemedText>
        ) : (
          <View style={styles.collection}>
            {owned.map((watch, index) => (
              <ThemedView key={`${watch.id}-${index}`} type="backgroundElement" style={styles.row}>
                <Image source={watch.image} style={styles.thumbnail} contentFit="contain"/>
                <ThemedText style={styles.rowName}>{watch.name}</ThemedText>
                <ThemedText themeColor="textSecondary">
                  <FormattedNumber value={watch.price}/>
                </ThemedText>
                <Pressable
                  onPress={() => sellWatch(index)}
                  style={({pressed}) => [styles.sell, pressed && styles.pressed]}>
                  <ThemedView type="backgroundSelected" style={styles.sellInner}>
                    <ThemedText type="smallBold">
                      {intl.formatMessage({
                        id: "profile.sell",
                        defaultMessage: "Sell",
                        description: "Button that trades an owned watch back for its price",
                      })}
                    </ThemedText>
                  </ThemedView>
                </Pressable>
              </ThemedView>
            ))}

            <View style={styles.row}>
              <ThemedText style={styles.rowName}>
                <FormattedMessage
                  id="profile.total"
                  defaultMessage="Total"
                  description="Label on the row summing the value of every owned watch"
                />
              </ThemedText>
              <ThemedText>
                <FormattedNumber value={portfolioValue}/>
              </ThemedText>
            </View>
          </View>
        )}

        {Platform.OS === 'web' && <WebBadge/>}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
  },
  collection: {
    alignSelf: 'stretch',
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  thumbnail: {
    width: 40,
    height: 56,
  },
  rowName: {
    // Pushes the price and the sell button to the far edge of the row.
    flex: 1,
  },
  sell: {
    borderRadius: Spacing.two,
    overflow: 'hidden',
  },
  sellInner: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  pressed: {
    opacity: 0.6,
  },
});
