// src/components/ui/provider.jsx
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';

export const UIProvider = ({ children }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
