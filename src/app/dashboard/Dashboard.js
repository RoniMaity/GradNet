"use client"

import { Box, Flex, Heading, Text, VStack, Spinner, Center, Button } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { HiPlus } from "react-icons/hi"
import LeftSidebar from "@/components/leftSideBar"
import PostCard from "@/components/PostCard"
import CreatePostModal from "@/components/CreatePostModal"

export default function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const [postsLoading, setPostsLoading] = useState(false)
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
    const [stats, setStats] = useState({ connections: 0, circles: 0, posts: 0 })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        setPostsLoading(true)
        
        try {
            const userRes = await fetch('/api/auth/users/me', { credentials: 'include' })
            
            if (userRes.ok) {
                const user = await userRes.json()
                const profileRes = await fetch(`/api/auth/users/${user.id}`, { credentials: 'include' })

                if (profileRes.ok) {
                    const profile = await profileRes.json()
                    const totalConnections = (profile.connections?.asStudent?.length || 0) + 
                                           (profile.connections?.asAlumni?.length || 0)
                    
                    setStats({
                        connections: totalConnections,
                        circles: profile.circlesJoined?.length || 0,
                        posts: profile.posts?.length || 0
                    })
                }
            }

            const postsRes = await fetch('/api/auth/posts?sortBy=likes&limit=20&includeCirclePosts=true')
            if (postsRes.ok) {
                const data = await postsRes.json()
                setPosts(data)
            }
        } catch (err) {
            console.error('Failed to load data:', err)
        } finally {
            setLoading(false)
            setPostsLoading(false)
        }
    }

    const handlePostCreated = async () => {
        try {
            const res = await fetch('/api/auth/posts?sortBy=likes&limit=20&includeCirclePosts=true')
            if (res.ok) {
                const data = await res.json()
                setPosts(data.reverse())
            }
        } catch (err) {
            console.error('Failed to refresh posts:', err)
        }
    }

    const bgGradient = 'linear(135deg, #041C32 0%, #0F766E 35%, #0EA5E9 90%)'

    if (loading) {
        return (
            <Flex minH="100vh" bgGradient={bgGradient}>
                <LeftSidebar />
                <Center flex="1" ml={{ base: "0", lg: "250px" }}>
                    <Spinner size="xl" color="teal.300" thickness="4px" />
                </Center>
            </Flex>
        )
    }

    return (
        <Flex minH="100vh" bgGradient={bgGradient} position="relative">
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
                    <VStack spacing={6} align="stretch">
                        {/* Welcome Section */}
                        <Box 
                            p={8} 
                            bg="rgba(255, 255, 255, 0.08)" 
                            backdropFilter="blur(20px)"
                            shadow="0 8px 32px rgba(0, 0, 0, 0.3)" 
                            borderRadius="xl"
                            border="1px solid"
                            borderColor="rgba(255, 255, 255, 0.12)"
                        >
                            <VStack spacing={4} align="start">
                                <Heading 
                                    size="2xl" 
                                    color="white"
                                    letterSpacing="tight"
                                >
                                    Welcome to GradNet
                                </Heading>
                                <Text fontSize="lg" color="rgba(255, 255, 255, 0.8)">
                                    Your professional network for students and alumni
                                </Text>
                            </VStack>
                        </Box>

                        {/* Quick Stats or Info Cards */}
                        <Flex gap={4} wrap="wrap">
                            <Box 
                                flex="1" 
                                minW="200px" 
                                p={6} 
                                bg="rgba(255, 255, 255, 0.08)" 
                                backdropFilter="blur(20px)"
                                shadow="0 8px 32px rgba(0, 0, 0, 0.3)" 
                                borderRadius="xl"
                                border="1px solid"
                                borderColor="rgba(255, 255, 255, 0.12)"
                            >
                                <VStack align="start" spacing={2}>
                                    <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)" fontWeight="medium">
                                        Connections
                                    </Text>
                                    <Heading 
                                        size="xl" 
                                        color="rgba(255, 255, 255, 0.95)"
                                    >
                                        {stats.connections}
                                    </Heading>
                                </VStack>
                            </Box>
                            
                            <Box 
                                flex="1" 
                                minW="200px" 
                                p={6} 
                                bg="rgba(255, 255, 255, 0.08)" 
                                backdropFilter="blur(20px)"
                                shadow="0 8px 32px rgba(0, 0, 0, 0.3)" 
                                borderRadius="xl"
                                border="1px solid"
                                borderColor="rgba(255, 255, 255, 0.12)"
                            >
                                <VStack align="start" spacing={2}>
                                    <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)" fontWeight="medium">
                                        Circles
                                    </Text>
                                    <Heading 
                                        size="xl" 
                                        color="rgba(255, 255, 255, 0.95)"
                                    >
                                        {stats.circles}
                                    </Heading>
                                </VStack>
                            </Box>
                            
                            <Box 
                                flex="1" 
                                minW="200px" 
                                p={6} 
                                bg="rgba(255, 255, 255, 0.08)" 
                                backdropFilter="blur(20px)"
                                shadow="0 8px 32px rgba(0, 0, 0, 0.3)" 
                                borderRadius="xl"
                                border="1px solid"
                                borderColor="rgba(255, 255, 255, 0.12)"
                            >
                                <VStack align="start" spacing={2}>
                                    <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)" fontWeight="medium">
                                        Posts
                                    </Text>
                                    <Heading 
                                        size="xl" 
                                        color="rgba(255, 255, 255, 0.95)"
                                    >
                                        {stats.posts}
                                    </Heading>
                                </VStack>
                            </Box>
                        </Flex>

                        {/* Top Posts Feed Section */}
                        <VStack spacing={4} align="stretch">
                            <Flex justify="space-between" align="center">
                                <Heading size="lg" color="white">Top Posts</Heading>
                                <Button
                                    leftIcon={<HiPlus />}
                                    colorScheme="teal"
                                    size="sm"
                                    onClick={() => setIsCreatePostOpen(true)}
                                >
                                    Create Post
                                </Button>
                            </Flex>
                            
                            {postsLoading ? (
                                <Center py={12}>
                                    <Spinner size="lg" color="teal.300" thickness="3px" />
                                </Center>
                            ) : posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostCard 
                                        key={post.id} 
                                        post={{
                                            ...post,
                                            likesCount: post._count?.likes || 0,
                                            commentsCount: post._count?.comments || 0
                                        }} 
                                    />
                                ))
                            ) : (
                                <Box 
                                    p={6} 
                                    bg="rgba(255, 255, 255, 0.08)" 
                                    backdropFilter="blur(20px)"
                                    shadow="0 8px 32px rgba(0, 0, 0, 0.3)" 
                                    borderRadius="xl"
                                    border="1px solid"
                                    borderColor="rgba(255, 255, 255, 0.12)"
                                >
                                    <Center py={12}>
                                        <Text color="rgba(255, 255, 255, 0.6)" fontSize="md">
                                            No posts yet. Be the first to share something!
                                        </Text>
                                    </Center>
                                </Box>
                            )}
                        </VStack>

                        {/* Create Post Modal */}
                        <CreatePostModal
                            isOpen={isCreatePostOpen}
                            onClose={() => setIsCreatePostOpen(false)}
                            onPostCreated={handlePostCreated}
                        />
                    </VStack>
                </Box>
            </Box>
        </Flex>
    );
}
