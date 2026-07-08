import type { ReactNode } from "react";
import { Pressable, Text } from "react-native";

import { styles } from "../styles";

type PrimaryButtonProps = {
  label: string;
  icon: ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

export function PrimaryButton({ label, icon, onPress, variant = "primary" }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "secondary" && styles.secondaryButton,
        pressed && styles.buttonPressed,
      ]}
    >
      {icon}
      <Text style={[styles.buttonText, variant === "secondary" && styles.secondaryButtonText]}>
        {label}
      </Text>
    </Pressable>
  );
}
