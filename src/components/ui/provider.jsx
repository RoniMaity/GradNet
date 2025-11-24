'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { gradSystem } from '@/theme/system'
import { ColorModeProvider } from './color-mode'

export function Provider(props) {
  return (
    <ChakraProvider value={gradSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
