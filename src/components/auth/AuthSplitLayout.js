'use client'

import { Box, Container, Flex, Grid } from '@chakra-ui/react'
import { Spotlight } from '@/components/ui/spotlight-new'

export default function AuthSplitLayout({
  leftPanel,
  formPanel,
  containerProps = {},
  formWrapperProps = {},
  backgroundGradient = 'linear(135deg, #041C32 0%, #0F766E 35%, #0EA5E9 90%)',
}) {
  return (
    <Box position="relative" minH="100vh" bgGradient={backgroundGradient} overflow="hidden">
      <Box position="absolute" inset="0" zIndex={0} pointerEvents="none">
        <Spotlight
          gradientFirst="radial-gradient(70% 75% at 50% 30%, rgba(14,165,233,0.35) 0%, rgba(14,165,233,0.08) 50%, transparent 85%)"
          gradientSecond="radial-gradient(50% 55% at 50% 50%, rgba(32,212,177,0.25) 0%, rgba(32,212,177,0.05) 70%, transparent 100%)"
          gradientThird="radial-gradient(45% 50% at 50% 50%, rgba(15,118,110,0.15) 0%, rgba(15,118,110,0.03) 70%, transparent 100%)"
          translateY={-320}
          width={720}
          height={1600}
          smallWidth={320}
          duration={9}
          xOffset={160}
        />
      </Box>
      <Box
        position="absolute"
        inset="0"
        opacity={0.35}
        backgroundImage="linear-gradient(120deg, rgba(255,255,255,0.08) 0%, transparent 45%), linear-gradient(300deg, rgba(15,118,110,0.25) 0%, transparent 60%)"
        mixBlendMode="screen"
        pointerEvents="none"
      />

      <Container
        maxW="7xl"
        py={{ base: 12, md: 16 }}
        px={{ base: 6, md: 10 }}
        position="relative"
        zIndex={1}
        {...containerProps}
      >
        <Grid
          templateColumns={{ base: '1fr', lg: 'repeat(12, minmax(0, 1fr))' }}
          columnGap={{ base: 8, lg: 12 }}
          rowGap={{ base: 10, md: 12 }}
          alignItems={{ base: 'flex-start', lg: 'center' }}
        >
          <Box
            order={{ base: 2, lg: 1 }}
            gridColumn={{ base: '1 / -1', lg: 'span 5' }}
            pr={{ base: 0, lg: 6 }}
          >
            {leftPanel}
          </Box>

          <Flex
            order={{ base: 1, lg: 2 }}
            gridColumn={{ base: '1 / -1', lg: 'span 7' }}
            justify={{ base: 'flex-start', lg: 'center' }}
            align="stretch"
          >
            <Box
              w="full"
              maxW={{ base: 'full', md: '520px', lg: '560px' }}
              {...formWrapperProps}
            >
              {formPanel}
            </Box>
          </Flex>
        </Grid>
      </Container>
    </Box>
  )
}
