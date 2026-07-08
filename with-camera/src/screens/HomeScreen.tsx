import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { styles } from "../styles";

export function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <View style={styles.homeLayout}>
      <View style={styles.homeCopy}>
        <View style={styles.heroIcon}>
          <MaterialCommunityIcons name="qrcode-scan" size={88} color="#0f766e" />
        </View>
        <Text style={styles.homeTitle}>Ticket Scanner</Text>
        <Text style={styles.homeSubtitle}>Ready for passenger QR verification.</Text>
      </View>

      <PrimaryButton
        label="Scan Now"
        onPress={onStart}
        icon={<MaterialCommunityIcons name="qrcode-scan" size={42} color="#ecfeff" />}
      />
    </View>
  );
}
