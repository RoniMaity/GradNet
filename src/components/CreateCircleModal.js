'use client'

import { Box, Button, VStack, Text, HStack, Input, Textarea } from '@chakra-ui/react'
import { HiX } from 'react-icons/hi'
import { useState, useEffect, useCallback } from 'react'
import { toaster } from '@/components/ui/toaster'

export default function CreateCircleModal({ isOpen, onClose, onCircleCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClose = useCallback(() => {
    setName('')
    setDescription('')
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

    if (!name.trim()) {
      toaster.create({
        title: 'Error',
        description: 'Circle name is required',
        type: 'error',
        duration: 3000,
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/circles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create circle')
      }

      const newCircle = await res.json()

      toaster.create({
        title: 'Success',
        description: 'Circle created successfully',
        type: 'success',
        duration: 3000,
      })

      handleClose()
      if (onCircleCreated) onCircleCreated(newCircle)
    } catch (err) {
      toaster.create({
        title: 'Error',
        description: err.message,
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

      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex="1001"
        width={{ base: '90%', md: '500px' }}
        maxW="90vw"
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
          <HStack justify="space-between" mb={4}>
            <Text fontSize="xl" fontWeight="semibold" color="white">
              Create New Circle
            </Text>
            <Button
              variant="ghost"
              color="white"
              onClick={handleClose}
              aria-label="Close"
              p={2}
              minW="auto"
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              <HiX size={20} />
            </Button>
          </HStack>

          <form onSubmit={handleSubmit}>
            <VStack gap={4} align="stretch">
              <Box>
                <Text color="white" mb={2} fontSize="sm" fontWeight="medium">
                  Circle Name <Text as="span" color="red.400">*</Text>
                </Text>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter circle name"
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
              </Box>

              <Box>
                <Text color="white" mb={2} fontSize="sm" fontWeight="medium">
                  Description
                </Text>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this circle about?"
                  minH="100px"
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
              </Box>

              <HStack justify="flex-end" gap={3} pt={2}>
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
                  bg="teal.500"
                  color="white"
                  _hover={{ bg: 'teal.600' }}
                  disabled={loading || !name.trim()}
                >
                  {loading ? 'Creating...' : 'Create Circle'}
                </Button>
              </HStack>
            </VStack>
          </form>
        </Box>
      </Box>
    </>
  )
}
