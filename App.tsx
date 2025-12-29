import React from 'react';
import { StatusBar } from 'react-native';
import { ChatProvider } from './src/context/ChatContext';
import { ChatScreen } from './src/screens/ChatScreen';

function App() {
  return (
    <ChatProvider>
      <StatusBar barStyle="dark-content" />
      <ChatScreen />
    </ChatProvider>
  );
}

export default App;
