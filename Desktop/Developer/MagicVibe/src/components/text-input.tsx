import {Text, View, TextInput, StyleSheet} from "react-native";
import {useTheme} from "@/hooks/use-theme";
import {ComponentSize} from "@/constants/theme";

type Props = {
  title: string;
  setValue: (value: string) => void;
  value: string;
  placeholder?: string;
  size?: ComponentSize;
}

export const Input = ({title, setValue, value, placeholder, size = 'medium'}: Props) => {
  const {buttonBackground, text} = useTheme()
  const variant = variants[size];
  return (
    <View style={[styles.container, variant.container]}>
      <Text style={[styles.title, variant.title, {color: text}]}>{title}</Text>
      <View style={[styles.inputContainer, variant.inputContainer, {backgroundColor: buttonBackground,}]}>
        <TextInput
          style={[styles.input, variant.input, {color: text}]}
          placeholder={placeholder}
          value={value}
          onChangeText={setValue}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  containerSmall: {
    gap: 4,
  },
  containerMedium: {
    gap: 5,
  },
  containerLarge: {
    gap: 8,
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
  },
  inputContainer: {
    justifyContent: 'center',
  },
  inputContainerSmall: {
    borderRadius: 4,
    minHeight: 40,
    paddingHorizontal: 12,
  },
  inputContainerMedium: {
    borderRadius: 5,
    minHeight: 60,
    paddingHorizontal: 20,
  },
  inputContainerLarge: {
    borderRadius: 8,
    minHeight: 76,
    paddingHorizontal: 24,
  },
  input: {
    fontWeight: '300',
  },
  inputSmall: {
    fontSize: 13,
  },
  inputMedium: {
    fontSize: 15,
  },
  inputLarge: {
    fontSize: 18,
  }
})

const variants = {
  small: {
    container: styles.containerSmall,
    title: styles.titleSmall,
    inputContainer: styles.inputContainerSmall,
    input: styles.inputSmall,
  },
  medium: {
    container: styles.containerMedium,
    title: styles.titleMedium,
    inputContainer: styles.inputContainerMedium,
    input: styles.inputMedium,
  },
  large: {
    container: styles.containerLarge,
    title: styles.titleLarge,
    inputContainer: styles.inputContainerLarge,
    input: styles.inputLarge,
  },
} as const;
