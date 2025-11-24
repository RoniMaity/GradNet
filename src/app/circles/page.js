'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Spinner,
  Center,
  Input
} from '@chakra-ui/react'
import { HiSearch, HiPlus, HiUsers } from 'react-icons/hi'
import LeftSidebar from '@/components/leftSideBar'
import { toaster } from '@/components/ui/toaster'
import { Avatar } from '@/components/ui/avatar'

export default function CirclesPage() {
  const router = useRouter()
  const [circles, setCircles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchCircles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/circles', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch circles')
      }

      const data = await response.json()
      setCircles(data)
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: error.message,
        type: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCircles()
  }, [])

  const handleCreateCircle = () => {
    // Navigate to create circle page (to be implemented)
    toaster.create({
      title: 'Feature Coming Soon',
      description: 'Circle creation will be available soon',
      type: 'info',
      duration: 3000,
    })
  }

  const handleCircleClick = (circleId) => {
    router.push(`/circles/${circleId}`)
  }

  const filteredCircles = circles.filter(circle =>
    circle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    circle.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <Flex minH="100vh" bgGradient="linear(135deg, #041C32 0%, #0F766E 35%, #0EA5E9 90%)">
        <LeftSidebar />
        <Center flex="1" ml={{ base: "0", lg: "250px" }}>
          <Spinner size="xl" color="teal.300" thickness="4px" />
        </Center>
      </Flex>
    )
  }

  return (
    <Flex minH="100vh" bgGradient="linear(135deg, #041C32 0%, #0F766E 35%, #0EA5E9 90%)" position="relative">
      {/* Gradient Overlay */}
      <Box
        position="absolute"
        inset="0"
        opacity={0.2}
        backgroundImage="linear-gradient(120deg, rgba(255,255,255,0.08) 0%, transparent 45%), linear-gradient(300deg, rgba(15,118,110,0.15) 0%, transparent 60%)"
        mixBlendMode="screen"
        pointerEvents="none"
      />
      
      <LeftSidebar />

      {/* Main Content Area */}
      <Box
        flex="1"
        ml={{ base: "0", lg: "250px" }}
        p={{ base: 4, md: 6 }}
        position="relative"
        zIndex={1}
      >
        <Box maxW="1200px" mx="auto">
          {/* Header */}
          <Flex justify="space-between" align="center" mb={6}>
            <Heading 
              size="xl" 
              bgGradient="linear(120deg, #22D3EE, #14B8A6)"
              bgClip="text"
            >
              Circles
            </Heading>
            <Button
              leftIcon={<HiPlus />}
              bg="black"
              color="white"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.3)"
              borderRadius="full"
              px={6}
              _hover={{
                bg: 'gray.900',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.4)'
              }}
              onClick={handleCreateCircle}
            >
              Create Circle
            </Button>
          </Flex>

          {/* Search Bar */}
          <Box mb={6} position="relative">
            <Input
              placeholder="Search circles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="rgba(255, 255, 255, 0.08)"
              backdropFilter="blur(20px)"
              borderRadius="lg"
              paddingLeft="40px"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.12)"
              color="white"
              _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
              _focus={{
                borderColor: 'rgba(20, 184, 166, 0.5)',
                boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.5)'
              }}
            />
            <Box
              position="absolute"
              left="12px"
              top="50%"
              transform="translateY(-50%)"
              pointerEvents="none"
              color="rgba(255, 255, 255, 0.5)"
            >
              <HiSearch size={20} />
            </Box>
          </Box>

          {/* Circles Grid */}
          {filteredCircles.length === 0 ? (
            <Box
              p={12}
              textAlign="center"
              bg="rgba(255, 255, 255, 0.08)"
              backdropFilter="blur(20px)"
              shadow="0 8px 32px rgba(0, 0, 0, 0.3)"
              borderRadius="xl"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.12)"
            >
              <VStack spacing={4}>
                <Box
                  p={4}
                  bg="rgba(255, 255, 255, 0.05)"
                  borderRadius="full"
                >
                  <HiUsers size={48} color="rgba(255, 255, 255, 0.5)" />
                </Box>
                <Heading size="md" color="rgba(255, 255, 255, 0.9)">
                  {searchQuery ? 'No circles found' : 'No circles yet'}
                </Heading>
                <Text color="rgba(255, 255, 255, 0.6)">
                  {searchQuery
                    ? 'Try adjusting your search'
                    : 'Create your first circle to get started'}
                </Text>
              </VStack>
            </Box>
          ) : (
            <VStack spacing={4} align="stretch">
              {filteredCircles.map((circle) => (
                <Box
                  key={circle.id}
                  p={6}
                  bg="rgba(255, 255, 255, 0.08)"
                  backdropFilter="blur(20px)"
                  shadow="0 8px 32px rgba(0, 0, 0, 0.3)"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.12)"
                  cursor="pointer"
                  transition="all 0.3s"
                  _hover={{
                    shadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                    transform: 'translateY(-4px)',
                    borderColor: 'rgba(20, 184, 166, 0.4)',
                    bg: 'rgba(255, 255, 255, 0.12)'
                  }}
                  onClick={() => handleCircleClick(circle.id)}
                >
                  <Flex gap={4} align="start">
                    <Avatar
                      size="lg"
                      name={circle.name}
                      bg="teal.500"
                      color="white"
                    />
                    <Box flex="1">
                      <HStack spacing={3} mb={2}>
                        <Heading size="md" color="rgba(255, 255, 255, 0.9)">
                          {circle.name}
                        </Heading>
                        <Badge colorScheme="teal" fontSize="xs">
                          {circle._count?.members || 0} members
                        </Badge>
                      </HStack>
                      {circle.description && (
                        <Text color="rgba(255, 255, 255, 0.7)" mb={3} noOfLines={2}>
                          {circle.description}
                        </Text>
                      )}
                      <HStack spacing={2}>
                        <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                          Created by {circle.createdBy?.name || 'Unknown'}
                        </Text>
                        {circle.createdAt && (
                          <>
                            <Text fontSize="sm" color="rgba(255, 255, 255, 0.4)">•</Text>
                            <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                              {new Date(circle.createdAt).toLocaleDateString()}
                            </Text>
                          </>
                        )}
                      </HStack>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </Box>
    </Flex>
  )
}
