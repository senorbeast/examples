import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { CameraView, scanFromURLAsync, type BarcodeScanningResult } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { styles } from "../styles";
import type { ScanResult } from "../types";
import { createScannableImageUrl } from "../utils/qrImage";
import { parseTicketPayload } from "../utils/ticket";

type ScanScreenProps = {
  onTicketScanned: (result: ScanResult) => void;
  onCameraError: (message: string) => void;
};

export function ScanScreen({ onTicketScanned, onCameraError }: ScanScreenProps) {
  const hasScanned = useRef(false);
  const objectUrl = useRef<string | null>(null);
  const [scanMessage, setScanMessage] = useState("Ready to scan");

  useEffect(() => {
    return () => {
      if (objectUrl.current) {
        URL.revokeObjectURL(objectUrl.current);
      }
    };
  }, []);

  const handleDetectedPayload = (rawPayload: string) => {
    if (hasScanned.current) {
      return;
    }

    hasScanned.current = true;
    onTicketScanned(parseTicketPayload(rawPayload));
  };

  const handleBarcodeScanned = (event: BarcodeScanningResult) => {
    handleDetectedPayload(event.data);
  };

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];

      if (!file || hasScanned.current) {
        return;
      }

      if (objectUrl.current) {
        URL.revokeObjectURL(objectUrl.current);
      }

      setScanMessage("Reading QR image...");

      try {
        objectUrl.current = await createScannableImageUrl(file);
        const scans = await scanFromURLAsync(objectUrl.current, ["qr"]);
        const qrScan = scans[0];

        if (!qrScan?.data) {
          setScanMessage("No QR detected. Try a clearer image with a white border.");
          return;
        }

        handleDetectedPayload(qrScan.data);
      } catch {
        setScanMessage("Could not read QR image. Try camera scan or a clearer PNG.");
      }
    };

    input.click();
  };

  return (
    <View style={styles.scanLayout}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarcodeScanned}
        onMountError={(event) => onCameraError(event.message)}
      />

      <View style={styles.cameraShade} />

      <View style={styles.scanOverlay}>
        <View style={styles.scanHeader}>
          <View style={styles.scanStatusDot} />
          <Text style={styles.scanStatus}>{scanMessage}</Text>
        </View>

        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <MaterialCommunityIcons name="qrcode-scan" size={96} color="#ecfeff" />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>

        <Text style={styles.scanInstruction}>Align QR inside frame</Text>
      </View>

      <View style={styles.scanActions}>
        <PrimaryButton
          label="Upload QR Image"
          variant="secondary"
          onPress={handleImageUpload}
          icon={<Ionicons name="image-outline" size={30} color="#0f172a" />}
        />
      </View>
    </View>
  );
}
