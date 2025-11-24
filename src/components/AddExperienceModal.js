'use client'

import {
  Box,
  Button,
  VStack,
  Text,
  HStack,
  IconButton,
  Input,
  Textarea
} from '@chakra-ui/react'
import { HiX } from 'react-icons/hi'
import { useState, useEffect, useCallback } from 'react'
import { toaster } from '@/components/ui/toaster'

export default function AddExperienceModal({ isOpen, onClose, userId, experience = null, onSaved }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    startDate: '',
    endDate: '',
    isCurrent: false
  })
  const [loading, setLoading] = useState(false)

  const handleClose = useCallback(() => {
    setFormData({
      title: '',
      company: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
      isCurrent: false
    })
    onClose()
  }, [onClose])

  useEffect(() => {
    if (experience) {
      setFormData({
        title: experience.title || '',
        company: experience.company || '',
        location: experience.location || '',
        description: experience.description || '',
        startDate: experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : '',
        endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
        isCurrent: experience.isCurrent || false
      })
    }
  }, [experience])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (loading) return

    if (!formData.title.trim() || !formData.company.trim() || !formData.startDate) {
      toaster.create({
        title: 'Error',
        description: 'Title, company, and start date are required',
        type: 'error',
        duration: 3000,
      })
      return
    }

    if (!formData.isCurrent && !formData.endDate) {
      toaster.create({
        title: 'Error',
        description: 'End date is required if not currently working',
        type: 'error',
        duration: 3000,
      })
      return
    }

    setLoading(true)

    try {
      const url = experience 
        ? `/api/auth/users/${userId}/experiences/${experience.id}`
        : `/api/auth/users/${userId}/experiences`
      
      const method = experience ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          endDate: formData.isCurrent ? null : formData.endDate
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save experience')
      }

      toaster.create({
        title: 'Success',
        description: experience ? 'Experience updated successfully' : 'Experience added successfully',
        type: 'success',
        duration: 3000,
      })

      handleClose()
      if (onSaved) onSaved()
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
              {experience ? 'Edit Experience' : 'Add Experience'}
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
              <Box>
                <Text color="white" mb={2} fontSize="sm" fontWeight="medium">
                  Job Title <Text as="span" color="red.400">*</Text>
                </Text>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Software Engineer"
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
                  Company <Text as="span" color="red.400">*</Text>
                </Text>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Google"
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
                  Location
                </Text>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA"
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
                  Start Date <Text as="span" color="red.400">*</Text>
                </Text>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.12)"
                  color="white"
                  _focus={{
                    borderColor: 'teal.500',
                    boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.5)'
                  }}
                />
              </Box>

              <HStack spacing={2} align="center">
                <input
                  type="checkbox"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked, endDate: e.target.checked ? '' : formData.endDate })}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: '#14b8a6'
                  }}
                />
                <Text color="white">I currently work here</Text>
              </HStack>

              {!formData.isCurrent && (
                <Box>
                  <Text color="white" mb={2} fontSize="sm" fontWeight="medium">
                    End Date <Text as="span" color="red.400">*</Text>
                  </Text>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    bg="rgba(255, 255, 255, 0.05)"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.12)"
                    color="white"
                    _focus={{
                      borderColor: 'teal.500',
                      boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.5)'
                    }}
                  />
                </Box>
              )}

              <Box>
                <Text color="white" mb={2} fontSize="sm" fontWeight="medium">
                  Description
                </Text>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your responsibilities and achievements..."
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
                >
                  {experience ? 'Update' : 'Add'}
                </Button>
              </HStack>
            </VStack>
          </form>
        </Box>
      </Box>
    </>
  )
}
