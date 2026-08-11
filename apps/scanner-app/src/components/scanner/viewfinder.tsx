import { View } from 'react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';

const CORNER_LEN = 28;
const CORNER_W = 3.5;

/** Viewfinder with L-shaped corner markers around the camera scan area. */
export function Viewfinder({
  processing,
  frameSize,
}: {
  processing: boolean;
  frameSize: number;
}) {
  const c = processing
    ? nativeTokens.colors.warning
    : nativeTokens.colors.primary;
  return (
    <View style={{ width: frameSize, height: frameSize }}>
      {/* Top-left */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: CORNER_LEN,
          height: CORNER_LEN,
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: CORNER_LEN,
            height: CORNER_W,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: CORNER_W,
            height: CORNER_LEN,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
      </View>
      {/* Top-right */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: CORNER_LEN,
          height: CORNER_LEN,
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: CORNER_LEN,
            height: CORNER_W,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: CORNER_W,
            height: CORNER_LEN,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
      </View>
      {/* Bottom-left */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: CORNER_LEN,
          height: CORNER_LEN,
        }}
      >
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: CORNER_LEN,
            height: CORNER_W,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: CORNER_W,
            height: CORNER_LEN,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
      </View>
      {/* Bottom-right */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: CORNER_LEN,
          height: CORNER_LEN,
        }}
      >
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: CORNER_LEN,
            height: CORNER_W,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: CORNER_W,
            height: CORNER_LEN,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
      </View>
    </View>
  );
}
