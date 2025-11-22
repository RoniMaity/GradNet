'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  IconButton
} from '@chakra-ui/react'
import { HiArrowLeft, HiUserAdd, HiUsers } from 'react-icons/hi'
import LeftSidebar from '@/components/leftSideBar'
import PostCard from '@/components/PostCard'
import { Avatar } from '@/components/ui/avatar'
import { toaster } from '@/components/ui/toaster'
import CreatePostModal from '@/components/CreatePostModal'

export default function CircleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [circle, setCircle] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)

  const circleId = parseInt(params.id)

  useEffect(() => {
    fetchCircleData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circleId])

  const fetchCircleData = async () => {
    try {
      setLoading(true)
      
      // Fetch circle details
      const circleResponse = await fetch(`/api/auth/circles/${circleId}`, {
        credentials: 'include'
      })

      if (!circleResponse.ok) {
        throw new Error('Failed to fetch circle')
      }

      const circleData = await circleResponse.json()
      setCircle(circleData)

      // Check if user is a member
      const memberResponse = await fetch(`/api/auth/circles/${circleId}/join`, {
        credentials: 'include'
      })

      if (memberResponse.ok) {
        const memberData = await memberResponse.json()
        setIsMember(memberData.isMember)
      }

      // Fetch circle posts
      const postsResponse = await fetch(`/api/auth/circles/${circleId}/posts`, {
        credentials: 'include'
      })

      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setPosts(postsData)
      }

    } catch (error) {
      toaster.create({
        title: 'Error',
        description: error.message,
        type: 'error',
        duration: 3000,
      })
      router.push('/circles')
    } finally {
      setLoading(false)
    }
  }

  const handlePostCreated = (newPost) => {
    // Refetch posts to get the updated list from database
    fetchCirclePosts()
  }

  const fetchCirclePosts = async () => {
    try {
      const postsResponse = await fetch(`/api/auth/circles/${circleId}/posts`, {
        credentials: 'include'
      })

      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setPosts(postsData)
      }
    } catch (error) {
      console.error('Error fetching circle posts:', error)
    }
  }

  const handleJoinCircle = async () => {
    // Optimistic update
    const previousMember = isMember
    setIsMember(!isMember)

    try {
      const response = await fetch(`/api/auth/circles/${circleId}/join`, {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setIsMember(data.isMember)
        
        // Update circle member count
        setCircle(prev => ({
          ...prev,
          _count: {
            ...prev._count,
            members: data.memberCount
          }
        }))

        toaster.create({
          title: 'Success',
          description: data.message,
          type: 'success',
          duration: 3000,
        })
      } else {
        // Revert on error
        setIsMember(previousMember)
        throw new Error('Failed to update membership')
      }
    } catch (error) {
      // Revert on error
      setIsMember(previousMember)
      toaster.create({
        title: 'Error',
        description: error.message,
        type: 'error',
        duration: 3000,
      })
    }
  }

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

  if (!circle) {
    return (
      <Flex minH="100vh" bgGradient="linear(135deg, #041C32 0%, #0F766E 35%, #0EA5E9 90%)">
        <LeftSidebar />
        <Center flex="1" ml={{ base: "0", lg: "250px" }}>
          <VStack spacing={4}>
            <Text fontSize="xl" color="white">Circle not found</Text>
            <Button 
              onClick={() => router.push('/circles')}
              bg="black"
              color="white"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.3)"
              borderRadius="full"
              _hover={{
                bg: 'gray.900',
                borderColor: 'rgba(255, 255, 255, 0.5)'
              }}
            >
              Back to Circles
            </Button>
          </VStack>
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
        <Box maxW="900px" mx="auto">
          {/* Back Button */}
          <Button
            leftIcon={<HiArrowLeft />}
            variant="ghost"
            mb={4}
            onClick={() => router.push('/circles')}
          >
            Back to Circles
          </Button>

          {/* Circle Header */}
          <Box
            p={8}
            bg="rgba(255, 255, 255, 0.08)"
            backdropFilter="blur(20px)"
            shadow="0 8px 32px rgba(0, 0, 0, 0.3)"
            borderRadius="xl"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.12)"
            mb={6}
          >
            <Flex gap={6} align="start" direction={{ base: 'column', md: 'row' }}>
              <Avatar
                size="2xl"
                name={circle.name}
                bg="teal.500"
                color="white"
              />
              
              <Box flex="1">
                <HStack spacing={3} mb={2} wrap="wrap">
                  <Heading size="xl" color="rgba(255, 255, 255, 0.9)">
                    {circle.name}
                  </Heading>
                  <Badge colorScheme="teal" fontSize="sm">
                    {circle._count?.members || 0} members
                  </Badge>
                </HStack>

                {circle.description && (
                  <Text color="rgba(255, 255, 255, 0.7)" mb={4} fontSize="lg">
                    {circle.description}
                  </Text>
                )}

                <HStack spacing={4} mb={4}>
                  <HStack spacing={2}>
                    <Avatar
                      size="sm"
                      name={circle.createdBy?.name}
                      src={circle.createdBy?.profilePic}
                    />
                    <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                      Created by {circle.createdBy?.name || 'Unknown'}
                    </Text>
                  </HStack>
                  {circle.createdAt && (
                    <>
                      <Text fontSize="sm" color="rgba(255, 255, 255, 0.4)">•</Text>
                      <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                        {new Date(circle.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Text>
                    </>
                  )}
                </HStack>

                <Button
                  leftIcon={<HiUserAdd />}
                  colorScheme={isMember ? "gray" : "teal"}
                  variant={isMember ? "outline" : "solid"}
                  onClick={handleJoinCircle}
                >
                  {isMember ? 'Leave Circle' : 'Join Circle'}
                </Button>
              </Box>
            </Flex>
          </Box>

          {/* Circle Posts */}
          <Box>
            <HStack justify="space-between" mb={4}>
              <Heading size="lg" color="white">
                Posts
              </Heading>
              {isMember && (
                <Button
                  size="sm"
                  colorScheme="teal"
                  onClick={() => setIsCreatePostOpen(true)}
                >
                  Create Post
                </Button>
              )}
            </HStack>

            {posts.length === 0 ? (
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
                    No posts yet
                  </Heading>
                  <Text color="rgba(255, 255, 255, 0.6)">
                    Be the first to post in this circle
                  </Text>
                </VStack>
              </Box>
            ) : (
              <VStack spacing={4} align="stretch">
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={{
                      ...post,
                      likesCount: post._count?.likes || 0,
                      commentsCount: post._count?.comments || 0
                    }} 
                  />
                ))}
              </VStack>
            )}
          </Box>

          {/* Create Post Modal */}
          <CreatePostModal
            isOpen={isCreatePostOpen}
            onClose={() => setIsCreatePostOpen(false)}
            circleId={circleId}
            circleName={circle?.name}
            onPostCreated={handlePostCreated}
          />
        </Box>
      </Box>
    </Flex>
  )
}
