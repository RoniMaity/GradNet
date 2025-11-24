'use client'

import { Box, VStack, Text, Button, Icon } from '@chakra-ui/react'
import { useRouter, usePathname } from 'next/navigation'
import { HiHome, HiUser, HiUsers, HiLogout } from 'react-icons/hi'
import Image from 'next/image'

const sidebarItems = [
  { label: 'Dashboard', icon: HiHome, path: '/dashboard' },
  { label: 'Profile', icon: HiUser, path: '/profile' },
  { label: 'Circles', icon: HiUsers, path: '/circles' }
]

export default function LeftSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      // Clear the auth cookie by calling logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always redirect to signin even if API call fails
      router.push('/signin')
    }
  }

  return (
    <Box
      w="250px"
      minH="100vh"
      bg="rgba(4, 28, 50, 0.95)"
      backdropFilter="blur(10px)"
      borderRight="1px"
      borderColor="rgba(255, 255, 255, 0.1)"
      position="fixed"
      left="0"
      top="0"
      zIndex="10"
      boxShadow="0 0 40px rgba(0, 0, 0, 0.3)"
      display={{ base: "none", lg: "block" }}
    >
      <VStack spacing="0" align="stretch" h="full">
        {/* Logo/Brand */}
        <Box p="6" borderBottom="1px" borderColor="rgba(255, 255, 255, 0.1)">
          <Box position="relative" width="180px" height="56px" mb={2}>
            <Image 
              src="/logo.png" 
              alt="GradNet" 
              fill 
              style={{ objectFit: 'contain', objectPosition: 'left' }} 
              priority
            />
          </Box>
          <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">
            Connect. Grow. Succeed.
          </Text>
        </Box>
        
        {/* Navigation Items */}
        <VStack spacing="1" p="4" flex="1">
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(item.path)
            return (
              <Button
                key={item.path}
                w="full"
                justifyContent="flex-start"
                leftIcon={<Icon as={item.icon} boxSize={5} />}
                bg={isActive ? 'rgba(20, 184, 166, 0.2)' : 'transparent'}
                color={isActive ? '#14B8A6' : 'rgba(255, 255, 255, 0.7)'}
                border="1px solid"
                borderColor={isActive ? 'rgba(20, 184, 166, 0.3)' : 'transparent'}
                onClick={() => router.push(item.path)}
                fontSize="md"
                fontWeight={isActive ? "semibold" : "normal"}
                h="12"
                borderRadius="lg"
                _hover={{
                  bg: isActive ? 'rgba(20, 184, 166, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  borderColor: isActive ? 'rgba(20, 184, 166, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                  color: isActive ? '#14B8A6' : 'white'
                }}
              >
                {item.label}
              </Button>
            )
          })}
        </VStack>

        {/* Logout Section */}
        <Box p="4" borderTop="1px" borderColor="rgba(255, 255, 255, 0.1)">
          <Button
            w="full"
            justifyContent="flex-start"
            leftIcon={<Icon as={HiLogout} boxSize={5} />}
            bg="transparent"
            color="rgba(239, 68, 68, 0.9)"
            border="1px solid"
            borderColor="rgba(239, 68, 68, 0.2)"
            onClick={handleLogout}
            fontSize="md"
            h="12"
            borderRadius="lg"
            _hover={{
              bg: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              color: '#EF4444'
            }}
          >
            Logout
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}