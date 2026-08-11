import * as Haptics from 'expo-haptics';

export async function haptic(
  type: Haptics.NotificationFeedbackType
): Promise<void> {
  try {
    await Haptics.notificationAsync(type);
  } catch {
    /* simulators don't support haptics */
  }
}
