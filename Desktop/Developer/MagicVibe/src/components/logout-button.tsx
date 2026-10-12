import {TouchableOpacity, Text} from "react-native";
import {useUserStore} from "@/store/user-store";

export const LogoutButton = () => {
  const cleanStorage = useUserStore((state) => state.clearStore);
  return (
    <TouchableOpacity onPress={cleanStorage}>
      <Text>Logout</Text>
    </TouchableOpacity>
  )
}
