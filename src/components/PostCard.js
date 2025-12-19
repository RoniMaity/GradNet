'use client'

import { Box, Text, HStack, VStack, IconButton, Button, Image, useBreakpointValue } from '@chakra-ui/react'
import { Avatar } from '@/components/ui/avatar'
import { HiChat, HiShare, HiDotsHorizontal } from 'react-icons/hi'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PostCard({ post }) {
  const router = useRouter()
  const isMobile = useBreakpointValue({ base: true, md: false })
  
  const [liked, setLiked] = useState(post.isLikedByCurrentUser || false)
  const [likesCount, setLikesCount] = useState(post.likesCount || 0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLiked(post.isLikedByCurrentUser || false)
    setLikesCount(post.likesCount || 0)
  }, [post.id, post.isLikedByCurrentUser, post.likesCount])

  const handleLike = async () => {
    if (loading) return

    const prevLiked = liked
    const prevCount = likesCount
    
    setLiked(!liked)
    setLikesCount(liked ? likesCount - 1 : likesCount + 1)
    setLoading(true)

    try {
      const res = await fetch(`/api/auth/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (res.ok) {
        const data = await res.json()
        setLiked(data.liked)
        setLikesCount(data.likesCount)
      } else {
        setLiked(prevLiked)
        setLikesCount(prevCount)
      }
    } catch (err) {
      console.error('Failed to like post:', err)
      setLiked(prevLiked)
      setLikesCount(prevCount)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.abs(now - date)
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (days === 1) return `${Math.floor(diff / (1000 * 60 * 60))} hours ago`
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    
    return date.toLocaleDateString()
  }

  return (
    <Box 
      bg="rgba(255, 255, 255, 0.08)" 
      backdropFilter="blur(20px)"
      shadow="0 8px 32px rgba(0, 0, 0, 0.3)" 
      borderRadius="xl"
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.12)"
      overflow="hidden"
    >
      <Box p={isMobile ? "4" : "6"}>
        {/* Post Header */}
        <HStack justify="space-between" mb="4">
          <VStack align="start" spacing="2" flex="1">
            {/* Circle info if it's a circle post */}
            {post.circle && (
              <HStack 
                spacing="3" 
                cursor="pointer"
                onClick={() => router.push(`/circles/${post.circle.id}`)}
                _hover={{ opacity: 0.8 }}
                transition="opacity 0.2s"
              >
                <Avatar 
                  name={post.circle.name}
                  size="md"
                  bg="teal.500"
                />
                <VStack align="start" spacing="0">
                  <Text fontWeight="semibold" fontSize="md" color="rgba(255, 255, 255, 0.9)">
                    {post.circle.name}
                  </Text>
                  <Text fontSize="xs" color="rgba(255, 255, 255, 0.5)">
                    Circle
                  </Text>
                </VStack>
              </HStack>
            )}
            
            {/* User info */}
            <HStack 
              spacing="3" 
              cursor="pointer"
              onClick={() => router.push(`/profile/${post.user?.id}`)}
              _hover={{ opacity: 0.8 }}
              transition="opacity 0.2s"
              pl={post.circle ? "8" : "0"}
            >
              <Avatar 
                src={post.user?.profilePic} 
                name={post.user?.name}
                size={isMobile ? "sm" : (post.circle ? "sm" : "md")}
              />
              <VStack align="start" spacing="0">
                <Text fontWeight={post.circle ? "normal" : "semibold"} fontSize={post.circle ? "sm" : "md"} color="rgba(255, 255, 255, 0.9)">
                  {post.circle ? `Posted by ${post.user?.name}` : post.user?.name}
                </Text>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                  {formatDate(post.createdAt)}
                </Text>
              </VStack>
            </HStack>
          </VStack>
          
          <IconButton
            icon={<HiDotsHorizontal />}
            variant="ghost"
            size="sm"
            aria-label="Post options"
            color="rgba(255, 255, 255, 0.6)"
            _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
          />
        </HStack>

        {/* Post Content */}
        <VStack align="start" spacing="4">
          <Text lineHeight="1.7" color="rgba(255, 255, 255, 0.8)" fontSize="md">
            {post.content}
          </Text>
          
          {/* Media (if any) */}
          {post.media && post.media.length > 0 && (
            <Box w="full">
              {post.media.map((media, index) => (
                <Image
                  key={index}
                  src={media.url}
                  alt="Post media"
                  w="full"
                  maxH="400px"
                  objectFit="cover"
                  borderRadius="md"
                />
              ))}
            </Box>
          )}
        </VStack>

        <Box height="1px" bg="rgba(255, 255, 255, 0.1)" my="4" />

        {/* Post Actions */}
        <HStack justify="space-between">
          <HStack spacing="4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              isDisabled={loading}
              color="white"
              fontWeight="medium"
              px={3}
              bg="transparent"
              display="inline-flex"
              alignItems="center"
              gap={2}
              transition="all 0.2s"
              _hover={{ 
                bg: 'rgba(255, 255, 255, 0.12)',
                transform: 'scale(1.03)'
              }}
              _active={{
                transform: 'scale(0.95)'
              }}
            >
              <Box
                as={liked ? AiFillHeart : AiOutlineHeart}
                color={liked ? '#f87171' : 'white'}
                fontSize="20px"
              />
              <Text fontSize="sm" color="rgba(255, 255, 255, 0.85)">
                {likesCount}
              </Text>
            </Button>
          </HStack>
          
          <IconButton
            icon={<HiShare size={20} />}
            variant="ghost"
            size="sm"
            aria-label="Share post"
            color="white"
            bg="transparent"
            _hover={{ 
              bg: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.9)'
            }}
          />
        </HStack>
      </Box>
    </Box>
  )
}
