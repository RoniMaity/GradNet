'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  HStack,
  Text
} from '@chakra-ui/react'
import { Avatar } from '@/components/ui/avatar'
import { 
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogTitle
} from '@chakra-ui/react'

export default function EditProfileModal({ isOpen, onClose, profileData, onSave }) {
  const [formData, setFormData] = useState({
    name: profileData?.name || '',
    bio: profileData?.bio || '',
    branch: profileData?.branch || '',
    graduationYear: profileData?.graduationYear || '',
    profilePic: profileData?.profilePic || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/auth/users/${profileData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      setSuccess(true)
      setTimeout(() => {
        onSave()
        onClose()
      }, 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <DialogContent 
        bg="rgba(4, 28, 50, 0.95)"
        backdropFilter="blur(20px)"
        borderRadius="xl"
        border="1px solid"
        borderColor="rgba(255, 255, 255, 0.12)"
      >
        <DialogHeader>
          <DialogTitle>
            <Text fontSize="lg" fontWeight="semibold" color="rgba(255, 255, 255, 0.9)">Edit Profile</Text>
          </DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <VStack spacing="6" align="stretch">
              {/* Profile Picture Section */}
              <Box textAlign="center">
                <Avatar
                  src={formData.profilePic}
                  name={formData.name}
                  size="xl"
                  mb="3"
                />
                <Box>
                  <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)" mb={2}>Profile Picture URL</Text>
                  <Input
                    name="profilePic"
                    value={formData.profilePic}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    size="md"
                    borderRadius="md"
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(20px)"
                    borderColor="rgba(255, 255, 255, 0.12)"
                    color="white"
                    _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    _focus={{
                      borderColor: 'rgba(20, 184, 166, 0.5)',
                      boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.5)'
                    }}
                  />
                </Box>
              </Box>

              <Box height="1px" bg="rgba(255, 255, 255, 0.1)" />

              {/* Form Fields */}
              <Box>
                <Text color="rgba(255, 255, 255, 0.9)" fontWeight="medium" mb={2}>Name *</Text>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  size="md"
                  borderRadius="md"
                  required
                  bg="rgba(255, 255, 255, 0.08)"
                  backdropFilter="blur(20px)"
                  borderColor="rgba(255, 255, 255, 0.12)"
                  color="white"
                  _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  _focus={{
                    borderColor: 'rgba(20, 184, 166, 0.5)',
                    boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.5)'
                  }}
                />
              </Box>

              <Box>
                <Text color="rgba(255, 255, 255, 0.9)" fontWeight="medium" mb={2}>Bio</Text>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                  borderRadius="md"
                  bg="rgba(255, 255, 255, 0.08)"
                  backdropFilter="blur(20px)"
                  borderColor="rgba(255, 255, 255, 0.12)"
                  color="white"
                  _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  _focus={{
                    borderColor: 'rgba(20, 184, 166, 0.5)',
                    boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.5)'
                  }}
                />
              </Box>

              <HStack w="full" spacing="4">
                <Box flex="1">
                  <Text color="rgba(255, 255, 255, 0.9)" fontWeight="medium" mb={2}>Branch</Text>
                  <Input
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                    size="md"
                    borderRadius="md"
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(20px)"
                    borderColor="rgba(255, 255, 255, 0.12)"
                    color="white"
                    _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    _focus={{
                      borderColor: 'rgba(20, 184, 166, 0.5)',
                      boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.5)'
                    }}
                  />
                </Box>

                <Box flex="1">
                  <Text color="rgba(255, 255, 255, 0.9)" fontWeight="medium" mb={2}>Graduation Year</Text>
                  <Input
                    name="graduationYear"
                    type="number"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    placeholder="2024"
                    size="md"
                    borderRadius="md"
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(20px)"
                    borderColor="rgba(255, 255, 255, 0.12)"
                    color="white"
                    _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    _focus={{
                      borderColor: 'rgba(20, 184, 166, 0.5)',
                      boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.5)'
                    }}
                  />
                </Box>
              </HStack>

              {/* Success/Error Messages */}
              {error && (
                <Box p={3} bg="rgba(239, 68, 68, 0.1)" borderRadius="md" border="1px" borderColor="rgba(239, 68, 68, 0.3)">
                  <Text color="red.300" fontSize="sm">{error}</Text>
                </Box>
              )}
              
              {success && (
                <Box p={3} bg="rgba(34, 197, 94, 0.1)" borderRadius="md" border="1px" borderColor="rgba(34, 197, 94, 0.3)">
                  <Text color="green.300" fontSize="sm">Profile updated successfully!</Text>
                </Box>
              )}
            </VStack>
          </DialogBody>

          <DialogFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                colorScheme="teal"
                type="submit"
                isLoading={loading}
                loadingText="Saving..."
              >
                Save Changes
              </Button>
            </HStack>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  )
}
