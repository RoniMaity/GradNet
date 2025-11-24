'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Box, 
  Flex, 
  Image, 
  Text, 
  Button, 
  Stack,
  IconButton,
  useBreakpointValue,
  Spinner,
  Center,
  Badge,
  HStack,
  VStack,
  Heading
} from '@chakra-ui/react'
import { Avatar } from '@/components/ui/avatar'
import { HiDotsHorizontal, HiPencil, HiUserAdd } from 'react-icons/hi'
import LeftSidebar from '@/components/leftSideBar'
import PostCard from '@/components/PostCard'
import EditProfileModal from '@/components/EditProfileModal'
import AddExperienceModal from '@/components/AddExperienceModal'
import { HiBriefcase, HiTrash, HiPencilAlt } from 'react-icons/hi'

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [experiences, setExperiences] = useState([])
  const [isAddExperienceOpen, setIsAddExperienceOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState(null)
  
  const userId = parseInt(params.id)
  const isMobile = useBreakpointValue({ base: true, lg: false })

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/auth/users/${userId}`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch profile')
      }
      
      const data = await response.json()
      setProfileData(data)
      
      // Fetch experiences
      const experiencesResponse = await fetch(`/api/auth/users/${userId}/experiences`, {
        credentials: 'include'
      })
      if (experiencesResponse.ok) {
        const experiencesData = await experiencesResponse.json()
        setExperiences(experiencesData)
      }
      
      // Fetch follow status if not own profile
      if (!data.isOwnProfile) {
        const followResponse = await fetch(`/api/auth/users/${userId}/follow`, {
          credentials: 'include'
        })
        if (followResponse.ok) {
          const followData = await followResponse.json()
          setIsFollowing(followData.isFollowing)
          setFollowersCount(followData.followersCount)
          setFollowingCount(followData.followingCount)
        }
      } else {
        // For own profile, just get the counts
        const followResponse = await fetch(`/api/auth/users/${userId}/follow`, {
          credentials: 'include'
        })
        if (followResponse.ok) {
          const followData = await followResponse.json()
          setFollowersCount(followData.followersCount)
          setFollowingCount(followData.followingCount)
        }
      }
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchProfileData()
  }, [fetchProfileData])

  const handleEditProfile = () => {
    setIsEditModalOpen(true)
  }

  const handleFollowToggle = async () => {
    // Optimistic update
    const previousFollowing = isFollowing
    const previousCount = followersCount
    setIsFollowing(!isFollowing)
    setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1)

    try {
      const response = await fetch(`/api/auth/users/${userId}/follow`, {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setIsFollowing(data.isFollowing)
        setFollowersCount(data.followersCount)
        setFollowingCount(data.followingCount)
      } else {
        // Revert on error
        setIsFollowing(previousFollowing)
        setFollowersCount(previousCount)
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
      // Revert on error
      setIsFollowing(previousFollowing)
      setFollowersCount(previousCount)
    }
  }

  const handleDeleteExperience = async (experienceId) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) {
      return
    }

    try {
      const response = await fetch(`/api/auth/users/${userId}/experiences/${experienceId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        setExperiences(prev => prev.filter(exp => exp.id !== experienceId))
      }
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  const handleEditExperience = (experience) => {
    setEditingExperience(experience)
    setIsAddExperienceOpen(true)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  if (loading) {
    return (
      <Flex minH="100vh" bgGradient="linear(135deg, #041C32 0%, #0F766E 35%, #0EA5E9 90%)">
        <LeftSidebar />
        <Center flex="1" ml={isMobile ? "0" : "250px"}>
          <Spinner size="xl" color="teal.300" thickness="4px" />
        </Center>
      </Flex>
    )
  }

  if (error) {
    return (
      <Flex minH="100vh" bgGradient="linear(135deg, #041C32 0%, #0F766E 35%, #0EA5E9 90%)">
        <LeftSidebar />
        <Center flex="1" ml={isMobile ? "0" : "250px"}>
          <Box 
            p={8} 
            bg="rgba(255, 255, 255, 0.08)" 
            backdropFilter="blur(20px)"
            borderRadius="xl"
            textAlign="center"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.12)"
          >
            <Text color="red.300" fontSize="lg" mb={4}>{error}</Text>
            <Button colorScheme="teal" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </Box>
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
      
      {/* Main Content */}
      <Box
        flex="1"
        ml={isMobile ? "0" : "250px"}
        position="relative"
        zIndex={1}
      >
        {/* Cover Photo Section */}
        <Box position="relative" h={isMobile ? "200px" : "280px"}>
          <Box
            w="full"
            h="full"
            bgGradient="linear(to-r, teal.400, teal.600)"
            position="relative"
          >
              {/* Optional cover image */}
              {profileData.coverPhoto && (
                <Image
                  src={profileData.coverPhoto}
                  alt="Cover photo"
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              )}
            </Box>
            
            {/* Profile Picture */}
            <Avatar
              src={profileData.profilePic}
              name={profileData.name}
              size={isMobile ? "xl" : "2xl"}
              position="absolute"
              bottom={isMobile ? "-50px" : "-60px"}
              left={isMobile ? "20px" : "40px"}
              border="4px solid white"
              shadow="lg"
            />
            
            {/* Action Buttons */}
            <HStack
              position="absolute"
              bottom="20px"
              right="20px"
              spacing={3}
            >
              {profileData.isOwnProfile ? (
                <Button
                  leftIcon={<HiPencil />}
                  colorScheme="teal"
                  size={isMobile ? "sm" : "md"}
                  onClick={handleEditProfile}
                  shadow="md"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    leftIcon={<HiUserAdd />}
                    colorScheme={isFollowing ? "gray" : "teal"}
                    variant={isFollowing ? "outline" : "solid"}
                    size={isMobile ? "sm" : "md"}
                    onClick={handleFollowToggle}
                    shadow="md"
                    bg={isFollowing ? "white" : undefined}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <IconButton
                    icon={<HiDotsHorizontal />}
                    bg="white"
                    variant="outline"
                    size={isMobile ? "sm" : "md"}
                    aria-label="More options"
                    shadow="md"
                  />
                </>
              )}
            </HStack>
          </Box>
          
          {/* Profile Content */}
          <Box px={isMobile ? "20px" : "40px"} pt={isMobile ? "60px" : "80px"} pb="40px">
            {/* Name and Basic Info */}
            <Stack spacing={5} mb={6}>
              <VStack align="start" spacing={2}>
                <Heading fontSize={isMobile ? "2xl" : "3xl"} fontWeight="bold" color="rgba(255, 255, 255, 0.9)">
                  {profileData.name}
                </Heading>
                <HStack spacing={3} flexWrap="wrap">
                  <Badge colorScheme="teal" variant="subtle" px={3} py={1} borderRadius="full">
                    {profileData.role === 'student' ? 'Student' : 'Alumni'}
                  </Badge>
                  {profileData.branch && (
                    <Text color="rgba(255, 255, 255, 0.7)" fontSize="md" fontWeight="medium">
                      {profileData.branch}
                    </Text>
                  )}
                  {profileData.graduationYear && (
                    <Text color="rgba(255, 255, 255, 0.7)" fontSize="md">
                      Class of {profileData.graduationYear}
                    </Text>
                  )}
                </HStack>
              </VStack>
              
              {/* Followers/Following */}
              <Box 
                p={5} 
                bg="rgba(255, 255, 255, 0.08)" 
                backdropFilter="blur(20px)"
                shadow="0 8px 32px rgba(0, 0, 0, 0.3)" 
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.12)"
              >
                <HStack spacing={8} justify="center">
                  <VStack spacing={1} align="center">
                    <Text fontSize="2xl" fontWeight="bold" color="rgba(255, 255, 255, 0.9)">
                      {followersCount}
                    </Text>
                    <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)" fontWeight="medium">
                      Followers
                    </Text>
                  </VStack>
                  <Box width="1px" h="50px" bg="rgba(255, 255, 255, 0.1)" />
                  <VStack spacing={1} align="center">
                    <Text fontSize="2xl" fontWeight="bold" color="rgba(255, 255, 255, 0.9)">
                      {followingCount}
                    </Text>
                    <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)" fontWeight="medium">
                      Following
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </Stack>
            
            {/* Bio/Details Card */}
            {(profileData.bio || profileData.college) && (
              <Box 
                p={6} 
                mb={6} 
                bg="rgba(255, 255, 255, 0.08)" 
                backdropFilter="blur(20px)"
                shadow="0 8px 32px rgba(0, 0, 0, 0.3)" 
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.12)"
              >
                <VStack align="start" spacing={4}>
                  {profileData.bio && (
                    <>
                      <Text fontSize="lg" fontWeight="semibold" color="rgba(255, 255, 255, 0.9)">
                        About
                      </Text>
                      <Text color="rgba(255, 255, 255, 0.7)" lineHeight="1.7" fontSize="md">
                        {profileData.bio}
                      </Text>
                    </>
                  )}
                  
                  {profileData.college && (
                    <>
                      {profileData.bio && <Box height="1px" bg="rgba(255, 255, 255, 0.1)" />}
                      <HStack spacing={2}>
                        <Text fontWeight="semibold" color="rgba(255, 255, 255, 0.9)">College:</Text>
                        <Text color="rgba(255, 255, 255, 0.7)">
                          {profileData.college.name}
                          {profileData.college.location && `, ${profileData.college.location}`}
                        </Text>
                      </HStack>
                    </>
                  )}
                </VStack>
              </Box>
            )}
            
            {/* Experience Section */}
            <Box mb={6}>
              <HStack justify="space-between" mb={4}>
                <Heading size="lg" color="rgba(255, 255, 255, 0.9)">
                  Experience
                </Heading>
                {profileData.isOwnProfile && (
                  <Button
                    size="sm"
                    colorScheme="teal"
                    leftIcon={<HiBriefcase />}
                    onClick={() => {
                      setEditingExperience(null)
                      setIsAddExperienceOpen(true)
                    }}
                  >
                    Add Experience
                  </Button>
                )}
              </HStack>

              {experiences.length === 0 ? (
                <Box 
                  p={8} 
                  textAlign="center" 
                  bg="rgba(255, 255, 255, 0.08)" 
                  backdropFilter="blur(20px)"
                  shadow="0 8px 32px rgba(0, 0, 0, 0.3)" 
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.12)"
                >
                  <Text color="rgba(255, 255, 255, 0.6)" fontSize="md">
                    No work experience added yet
                  </Text>
                </Box>
              ) : (
                <VStack spacing={4} align="stretch">
                  {experiences.map((exp) => (
                    <Box
                      key={exp.id}
                      p={5}
                      bg="rgba(255, 255, 255, 0.08)"
                      backdropFilter="blur(20px)"
                      shadow="0 8px 32px rgba(0, 0, 0, 0.3)"
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.12)"
                      position="relative"
                    >
                      {profileData.isOwnProfile && (
                        <HStack position="absolute" top={4} right={4} spacing={2}>
                          <IconButton
                            icon={<HiPencilAlt />}
                            size="sm"
                            variant="ghost"
                            colorScheme="teal"
                            onClick={() => handleEditExperience(exp)}
                            aria-label="Edit experience"
                          />
                          <IconButton
                            icon={<HiTrash />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleDeleteExperience(exp.id)}
                            aria-label="Delete experience"
                          />
                        </HStack>
                      )}
                      
                      <VStack align="start" spacing={2}>
                        <Heading size="md" color="rgba(255, 255, 255, 0.9)">
                          {exp.title}
                        </Heading>
                        <Text fontSize="lg" fontWeight="semibold" color="teal.300">
                          {exp.company}
                        </Text>
                        <HStack spacing={2} color="rgba(255, 255, 255, 0.6)" fontSize="sm">
                          <Text>
                            {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                          </Text>
                          {exp.location && (
                            <>
                              <Text>•</Text>
                              <Text>{exp.location}</Text>
                            </>
                          )}
                        </HStack>
                        {exp.description && (
                          <Text color="rgba(255, 255, 255, 0.7)" mt={2} lineHeight="1.6">
                            {exp.description}
                          </Text>
                        )}
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
            
            {/* Posts Section */}
            <Box>
              <Heading size="lg" mb={5} color="rgba(255, 255, 255, 0.9)">
                Posts ({profileData.posts.length})
              </Heading>
              
              {profileData.posts.length === 0 ? (
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
                  <Text color="rgba(255, 255, 255, 0.7)" fontSize="lg">
                    No posts yet
                  </Text>
                </Box>
              ) : (
                <Stack spacing={4}>
                  {profileData.posts.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={{
                        ...post,
                        user: {
                          id: profileData.id,
                          name: profileData.name,
                          profilePic: profileData.profilePic
                        }
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </Box>
        </Box>
      
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profileData={profileData}
          onSave={fetchProfileData}
        />
      )}

      {/* Add/Edit Experience Modal */}
      <AddExperienceModal
        isOpen={isAddExperienceOpen}
        onClose={() => {
          setIsAddExperienceOpen(false)
          setEditingExperience(null)
        }}
        userId={userId}
        experience={editingExperience}
        onSaved={fetchProfileData}
      />
    </Flex>
  )
}
