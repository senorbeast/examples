import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { styles } from "../styles";

function TopNav({ stationName, today }: { stationName: string; today: string }) {
  return (
    <View style={styles.topNav}>
      <View style={styles.navGroup}>
        <View style={styles.navIcon}>
          <FontAwesome6 name="train-subway" size={24} color="#d9f99d" />
        </View>
        <View>
          <Text style={styles.navLabel}>Current station</Text>
          <Text style={styles.navTitle}>{stationName}</Text>
        </View>
      </View>

      <View style={styles.navGroup}>
        <View style={styles.navIcon}>
          <Ionicons name="calendar-clear-outline" size={24} color="#d9f99d" />
        </View>
        <View>
          <Text style={styles.navLabel}>Today</Text>
          <Text style={styles.navTitle}>{today}</Text>
        </View>
      </View>
    </View>
  );
}

export function AppShell({
  stationName,
  today,
  children,
}: {
  stationName: string;
  today: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.app}>
      <TopNav stationName={stationName} today={today} />
      <View style={styles.screen}>{children}</View>
    </View>
  );
}
