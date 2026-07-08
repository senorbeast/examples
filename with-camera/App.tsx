import { useCameraPermissions } from "expo-camera";
import { useMemo, useState } from "react";

import { AppShell } from "./src/components/AppShell";
import { NoticeScreen } from "./src/components/NoticeScreen";
import { FALLBACK_STATION } from "./src/constants";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ResultScreen } from "./src/screens/ResultScreen";
import { ScanScreen } from "./src/screens/ScanScreen";
import type { ScanResult, Screen } from "./src/types";
import { formatToday } from "./src/utils/date";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [screen, setScreen] = useState<Screen>("home");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const today = useMemo(formatToday, []);
  const stationName = scanResult?.source ?? FALLBACK_STATION;

  const startScan = async () => {
    setCameraError(null);
    setScanResult(null);

    if (!permission?.granted) {
      await requestPermission();
    }

    setScreen("scan");
  };

  const retryScan = () => {
    setCameraError(null);
    setScanResult(null);
    setScreen("home");
  };

  const handleTicketScanned = (result: ScanResult) => {
    setScanResult(result);
    setScreen("result");
  };

  const renderContent = () => {
    if (screen === "home") {
      return <HomeScreen onStart={startScan} />;
    }

    if (!permission?.granted) {
      return (
        <NoticeScreen
          title="Camera Permission Needed"
          message="Allow camera access to scan ticket QR codes."
          actionLabel="Grant Permission"
          iconName="camera-outline"
          actionIconName="camera"
          onAction={requestPermission}
        />
      );
    }

    if (cameraError) {
      return (
        <NoticeScreen
          title="Camera Unavailable"
          message={cameraError}
          actionLabel="Retry Scan"
          iconName="warning-outline"
          actionIconName="refresh"
          onAction={retryScan}
          tone="error"
        />
      );
    }

    if (screen === "scan") {
      return <ScanScreen onTicketScanned={handleTicketScanned} onCameraError={setCameraError} />;
    }

    if (scanResult) {
      return <ResultScreen result={scanResult} onRetry={retryScan} />;
    }

    return <HomeScreen onStart={startScan} />;
  };

  return (
    <AppShell stationName={stationName} today={today}>
      {renderContent()}
    </AppShell>
  );
}
