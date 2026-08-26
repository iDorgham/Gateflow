import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, type BarcodeScanningResult } from 'expo-camera';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';
import { getScannerTranslations, type SupportedLocale } from '../../lib/i18n';
import type { ScanResult } from '../../lib/scanner';
import type { SelectedGate } from '../GateSelector';
import { Viewfinder } from '../scanner/viewfinder';
import { DecisionDialog } from '../scanner/decision-dialog';
import { ResultOverlay } from '../scanner/result-overlay';
import { feedbackStyles } from '../scanner/feedback-styles';
import { IDCaptureModal } from '../IDCaptureModal';

export type ScannerPhase =
  | { phase: 'scanning' }
  | { phase: 'processing' }
  | { phase: 'id_capture'; result: ScanResult }
  | { phase: 'decision'; result: ScanResult }
  | { phase: 'result'; result: ScanResult };

export interface CameraScannerViewProps {
  canScan: boolean;
  uiPhase: ScannerPhase;
  selectedGate: SelectedGate | null;
  onBarcodeScanned: (result: BarcodeScanningResult) => void;
  onPass: (result: ScanResult) => void;
  onDeny: (result: ScanResult) => void;
  onScanAgain: () => void;
  onRequestOverride?: () => void;
  onReportIssue?: () => void;
  onIdCaptured: (result: ScanResult) => void;
  locale?: SupportedLocale;
}

const { width } = Dimensions.get('window');
const FRAME_SIZE = width * 0.65;
const TOP_OFFSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 20 : 60;

export function CameraScannerView({
  canScan,
  uiPhase,
  selectedGate,
  onBarcodeScanned,
  onPass,
  onDeny,
  onScanAgain,
  onRequestOverride,
  onReportIssue,
  onIdCaptured,
  locale = 'en',
}: CameraScannerViewProps) {
  const t = getScannerTranslations(locale).scanner;

  return (
    <>
      {/* Live camera stream */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={
          canScan && uiPhase.phase === 'scanning' ? onBarcodeScanned : undefined
        }
      />

      {/* Decorative overlay */}
      <View style={styles.overlay} pointerEvents="none">
        <Text style={styles.scannerHeader}>{t.header}</Text>
        <Viewfinder
          frameSize={FRAME_SIZE}
          processing={
            uiPhase.phase === 'processing' ||
            uiPhase.phase === 'decision' ||
            uiPhase.phase === 'id_capture'
          }
        />
        <Text style={styles.scannerHint}>
          {!selectedGate
            ? t.selectGateHint
            : !canScan
              ? t.startShiftHint
              : `${selectedGate.name} · ${t.onDutyHint}`}
        </Text>
      </View>

      {/* ID capture modal for strict identity checkpoints */}
      {uiPhase.phase === 'id_capture' && (
        <IDCaptureModal
          visible
          scanLogId={uiPhase.result.scanId!}
          onSuccess={() => onIdCaptured(uiPhase.result)}
          required
        />
      )}

      {/* Processing spinner layer */}
      {uiPhase.phase === 'processing' && (
        <View style={feedbackStyles.feedbackLayer}>
          <ActivityIndicator
            size="large"
            color={nativeTokens.colors.textInverse}
          />
          <Text style={feedbackStyles.feedbackTitle}>{t.verifying}</Text>
        </View>
      )}

      {/* Pass / Deny decision dialog */}
      {uiPhase.phase === 'decision' && (
        <DecisionDialog
          result={uiPhase.result}
          onPass={() => onPass(uiPhase.result)}
          onDeny={() => onDeny(uiPhase.result)}
        />
      )}

      {/* Decision outcome result overlay */}
      {uiPhase.phase === 'result' && (
        <ResultOverlay
          result={uiPhase.result}
          onScanAgain={onScanAgain}
          onRequestOverride={onRequestOverride}
          onReportIssue={onReportIssue}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: TOP_OFFSET,
    paddingBottom: 108,
  },
  scannerHeader: {
    fontSize: 20,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textHeading,
    letterSpacing: nativeTokens.typography.headerTracking,
    textTransform: 'uppercase',
    textShadowColor: nativeTokens.colors.backdropGlass,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  scannerHint: {
    fontSize: 14,
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 24,
    textShadowColor: nativeTokens.colors.backdropGlass,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
