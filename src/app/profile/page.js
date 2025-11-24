'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex, Spinner, Center } from '@chakra-ui/react'
import LeftSidebar from '@/components/leftSideBar'

export default function ProfileRedirect() {
  const router = useRouter()

  useEffect(() => {
    const redirectToUserProfile = async () => {
      try {
        // Get current user from cookie/session
        const response = await fetch('/api/auth/users/me', {
          credentials: 'include'
        })

        if (response.ok) {
          const userData = await response.json()
          router.replace(`/profile/${userData.id}`)
        } else {
          // If not authenticated, redirect to signin
          router.replace('/signin')
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        router.replace('/signin')
      }
    }

    redirectToUserProfile()
  }, [router])

  return (
    <Flex minH="100vh" bg="gray.50">
      <LeftSidebar />
      <Center flex="1" ml={{ base: "0", lg: "250px" }}>
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Center>
    </Flex>
  )
}
