/**
 * Type stubs for expo-local-authentication.
 * Replace when the package is installed via: pnpm install
 */
declare module 'expo-local-authentication' {
  export enum AuthenticationType {
    FINGERPRINT = 1,
    FACIAL_RECOGNITION = 2,
    IRIS = 3,
  }

  export interface LocalAuthenticationOptions {
    promptMessage?: string;
    cancelLabel?: string;
    disableDeviceFallback?: boolean;
    fallbackLabel?: string;
    requireConfirmation?: boolean;
  }

  export interface LocalAuthenticationResult {
    success: boolean;
    error?: string;
    warning?: string;
  }

  export function hasHardwareAsync(): Promise<boolean>;
  export function isEnrolledAsync(): Promise<boolean>;
  export function supportedAuthenticationTypesAsync(): Promise<
    AuthenticationType[]
  >;
  export function authenticateAsync(
    options?: LocalAuthenticationOptions
  ): Promise<LocalAuthenticationResult>;
  export function getEnrolledLevelAsync(): Promise<number>;
}
