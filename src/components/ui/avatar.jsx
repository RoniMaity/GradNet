'use client'

import { Avatar as ChakraAvatar } from '@chakra-ui/react'

export function Avatar({ src, name, size = "md", ...props }) {
  return (
    <ChakraAvatar.Root size={size} {...props}>
      {src && <ChakraAvatar.Image src={src} alt={name} />}
      <ChakraAvatar.Fallback>{name?.charAt(0) || '?'}</ChakraAvatar.Fallback>
    </ChakraAvatar.Root>
  )
}
