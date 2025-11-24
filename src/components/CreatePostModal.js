'use client'

import { Box, Button, VStack, Textarea, Text, HStack, IconButton } from '@chakra-ui/react'
import { HiX } from 'react-icons/hi'
import { useState, useEffect, useCallback } from 'react'
import { toaster } from '@/components/ui/toaster'

export default function CreatePostModal({ isOpen, onClose, circleId = null, circleName = null, onPostCreated }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClose = useCallback(() => {
    setContent('')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    
    if (!content.trim()) {
      toaster.create({
        title: 'Error',
        description: 'Post content cannot be empty',
        type: 'error',
        duration: 3000,
      })
      return
    }

    setLoading(true)

    try {
      // Get current user
      const userResponse = await fetch('/api/auth/users/me', {
        credentials: 'include'
      })
      
      if (!userResponse.ok) {
        throw new Error('Failed to get user info')
      }

      const userData = await userResponse.json()

      const endpoint = circleId 
        ? `/api/auth/circles/${circleId}/posts`
        : '/api/auth/posts'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: content.trim(),
          userId: userData.id,
          ...(circleId && { circleId })
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }

      const newPost = await response.json()

      toaster.create({
        title: 'Success',
        description: circleId ? 'Post created in circle' : 'Post created successfully',
        type: 'success',
        duration: 3000,
      })

      setContent('')
      onClose()
      
      if (onPostCreated) {
        onPostCreated(newPost)
      }
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

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="blackAlpha.700"
        backdropFilter="blur(10px)"
        zIndex="1000"
        onClick={handleClose}
      />

      {/* Modal */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex="1001"
        width={{ base: '90%', md: '600px' }}
        maxW="90vw"
        maxH="90vh"
        overflowY="auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          bg="rgba(8, 15, 33, 0.95)"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.12)"
          borderRadius="xl"
          boxShadow="0 25px 50px rgba(0, 0, 0, 0.5)"
          p={6}
        >
          {/* Header */}
          <HStack justify="space-between" mb={4}>
            <Text fontSize="xl" fontWeight="semibold" color="white">
              {circleId ? `Create Post in ${circleName}` : 'Create Post'}
            </Text>
            <IconButton
              icon={<HiX />}
              variant="ghost"
              colorScheme="whiteAlpha"
              color="white"
              onClick={handleClose}
              aria-label="Close modal"
            />
          </HStack>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              {circleId && (
                <Box
                  p={3}
                  bg="rgba(20, 184, 166, 0.1)"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="rgba(20, 184, 166, 0.3)"
                >
                  <Text fontSize="sm" color="teal.300" fontWeight="medium">
                    Posting in: {circleName}
                  </Text>
                </Box>
              )}

              <Box>
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  minH="150px"
                  maxLength={5000}
                  required
                  autoFocus
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.12)"
                  color="white"
                  _placeholder={{ color: 'rgba(255, 255, 255, 0.4)' }}
                  _focus={{
                    borderColor: 'teal.500',
                    boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.5)'
                  }}
                />
                <HStack justify="space-between" mt={2}>
                  <Text fontSize="xs" color="rgba(255, 255, 255, 0.5)">
                    {content.length} / 5000 characters
                  </Text>
                </HStack>
              </Box>

              {/* Footer */}
              <HStack justify="flex-end" spacing={3} pt={2}>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  color="white"
                  borderColor="rgba(255, 255, 255, 0.3)"
                  _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="teal"
                  isLoading={loading}
                  disabled={!content.trim()}
                >
                  Post
                </Button>
              </HStack>
            </VStack>
          </form>
        </Box>
      </Box>
    </>
  )
}
