import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  CameraView,
  scanFromURLAsync,
  type BarcodeScanningResult,
} from "expo-camera";
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
  const camera = useRef<CameraView>(null);
  const hasScanned = useRef(false);
  const isSnapshotScanning = useRef(false);
  const objectUrl = useRef<string | null>(null);
  const scanAttempts = useRef(0);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [scanMessage, setScanMessage] = useState("Starting camera...");

  useEffect(() => {
    return () => {
      if (objectUrl.current) {
        URL.revokeObjectURL(objectUrl.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isCameraReady) {
      return;
    }

    setScanMessage("Scanning camera feed...");

    const intervalId = setInterval(() => {
      void scanCameraSnapshot();
    }, 900);

    void scanCameraSnapshot();

    return () => clearInterval(intervalId);
  }, [isCameraReady]);

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

  const scanCameraSnapshot = async () => {
    if (hasScanned.current || isSnapshotScanning.current || !camera.current) {
      return;
    }

    isSnapshotScanning.current = true;

    try {
      const photo = await camera.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      if (!photo?.uri || hasScanned.current) {
        return;
      }

      const scans = await scanFromURLAsync(photo.uri, ["qr"]);
      const qrScan = scans[0];

      if (qrScan?.data) {
        handleDetectedPayload(qrScan.data);
        return;
      }

      scanAttempts.current += 1;

      if (scanAttempts.current >= 5) {
        setScanMessage("Still scanning. Center the QR, hold steady, and keep a white border visible.");
      }
    } catch {
      scanAttempts.current += 1;

      if (scanAttempts.current >= 3) {
        setScanMessage("Camera is on. Hold the QR steady or use Upload QR Image.");
      }
    } finally {
      isSnapshotScanning.current = false;
    }
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
        ref={camera}
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarcodeScanned}
        onCameraReady={() => setIsCameraReady(true)}
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
