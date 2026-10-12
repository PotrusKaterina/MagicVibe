import {Pressable, StyleSheet, Text} from "react-native";
import {Icon, IconName} from "@expo/ui";
import {useTheme} from "@/hooks/use-theme";
import {ComponentSize} from "@/constants/theme";

type ThemedButtonProps = {
  title?: string;
  icon?: IconName;
  size?: ComponentSize;
  disabled?: boolean;
  onPress?: () => void;
}

export const ThemedLinkButton = ({title, icon, size = 'medium', disabled, onPress}: ThemedButtonProps) => {
  const {buttonBackground, text} = useTheme();
  const variant = variants[size];
  return (
    <Pressable onPress={onPress}
               disabled={disabled}
               style={({pressed}) =>
                 [styles.container, variant.container, {backgroundColor: buttonBackground},
                   pressed && styles.pressedButton, disabled && styles.disabledButton]}
    >
      {title && <Text style={[styles.title, variant.title, {color: text}]}>{title}</Text>}
      {icon && <Icon name={icon} size={variant.icon}/>}
    </Pressable>)
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerSmall: {
    padding: 8,
    minHeight: 40,
    borderRadius: 8,
  },
  containerMedium: {
    padding: 10,
    minHeight: 60,
    borderRadius: 10,
  },
  containerLarge: {
    padding: 14,
    minHeight: 76,
    borderRadius: 14,
  },
  pressedButton: {
    opacity: 0.5
  },
  disabledButton: {
    opacity: 0.4
  },
  title: {
    fontWeight: '200',
  },
  titleSmall: {
    fontSize: 14,
  },
  titleMedium: {
    fontSize: 18,
  },
  titleLarge: {
    fontSize: 22,
  }
})

const variants = {
  small: {container: styles.containerSmall, title: styles.titleSmall, icon: 16},
  medium: {container: styles.containerMedium, title: styles.titleMedium, icon: 20},
  large: {container: styles.containerLarge, title: styles.titleLarge, icon: 24},
} as const;
