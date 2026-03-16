import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { AiChatPanel } from '../../../components/AiChatPanel';

export default function AiScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'GateAI Assistant',
          headerTitleAlign: 'center',
        }} 
      />
      <AiChatPanel />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
