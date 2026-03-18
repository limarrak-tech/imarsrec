import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WordsProvider } from './src/hooks/useWords';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <WordsProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </WordsProvider>
    </SafeAreaProvider>
  );
}
