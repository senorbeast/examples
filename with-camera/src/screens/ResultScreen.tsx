import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { styles } from "../styles";
import type { ScanResult } from "../types";

export function ResultScreen({ result, onRetry }: { result: ScanResult; onRetry: () => void }) {
  const route =
    result.source && result.destination ? `${result.source} -> ${result.destination}` : "Route unavailable";
  const isValid = result.isValid;

  return (
    <View style={[styles.resultLayout, isValid ? styles.validResult : styles.invalidResult]}>
      <View style={[styles.resultIcon, isValid ? styles.validIcon : styles.invalidIcon]}>
        {isValid ? (
          <Ionicons name="checkmark-circle" size={128} color="#16a34a" />
        ) : (
          <Ionicons name="close-circle" size={128} color="#dc2626" />
        )}
      </View>

      <View style={styles.resultCopy}>
        <Text style={[styles.resultTitle, isValid ? styles.validText : styles.invalidText]}>
          {isValid ? "Ticket Valid" : "Invalid Ticket"}
        </Text>
        <Text style={styles.resultSubtitle}>{isValid ? "Admit Passenger" : "Manual Review"}</Text>
        <Text style={styles.routeText}>{route}</Text>
      </View>

      <PrimaryButton
        label="Retry Scan"
        variant="secondary"
        onPress={onRetry}
        icon={<Ionicons name="refresh" size={34} color="#0f172a" />}
      />
    </View>
  );
}
