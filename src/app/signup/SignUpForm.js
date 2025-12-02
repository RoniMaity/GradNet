'use client'

import { useReducer } from 'react'
import {
  Box,
  Button,
  Fieldset,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Spotlight } from '@/components/ui/spotlight-new'
import { Input as GradientInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const MotionBox = motion.create(Box)

const titleGradient = 'linear(120deg, #22D3EE 0%, #0EA5E9 45%, #14B8A6 85%)'
const primaryButtonStyles = {
  bg: 'black',
  border: '1px solid',
  borderColor: 'whiteAlpha.300',
  borderRadius: 'full',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  color: 'white',
  px: 8,
  py: 6,
  _hover: {
    bg: 'gray.900',
    borderColor: 'whiteAlpha.500',
    transform: 'translateY(-2px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
  }
}

function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value }
    case 'SET_LOADING':
      return { ...state, loading: action.value }
    case 'SET_ERROR':
      return { ...state, error: action.value }
    case 'SET_SUCCESS':
      return { ...state, success: action.value }
    default:
      return state
  }
}

const initialState = {
  name: '',
  email: '',
  password: '',
  graduationYear: '',
  branch: '',
  collegeName: '',
  collegeLocation: '',
  loading: false,
  error: null,
  success: null,
}

export default function SignUpForm() {
  const [state, dispatch] = useReducer(formReducer, initialState)
  const router = useRouter()

  const handleChange = (e) => {
    dispatch({
      type: 'UPDATE_FIELD',
      field: e.target.name,
      value: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: 'SET_LOADING', value: true })
    dispatch({ type: 'SET_ERROR', value: null })
    dispatch({ type: 'SET_SUCCESS', value: null })
    console.log(state.collegeName)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          password: state.password,
          graduationYear: state.graduationYear,
          branch: state.branch,
          collegeName: state.collegeName,
          collegeLocation: state.collegeLocation,
        }),
      })

      const data = await res.json()
      console.log(data)

      if (!res.ok) {
        dispatch({ type: 'SET_ERROR', value: data.error || 'Signup failed' })
        return
      }

      dispatch({ type: 'SET_SUCCESS', value: 'Account created! Redirecting you to the dashboard…' })
      setTimeout(() => {
        router.push('/dashboard')
      }, 600)
    } catch {
      dispatch({ type: 'SET_ERROR', value: 'Server error. Try again.' })
    } finally {
      dispatch({ type: 'SET_LOADING', value: false })
    }
  }

  const formFields = [
    { label: 'Full name', name: 'name', colSpan: 2 },
    { label: 'Email', name: 'email', type: 'email', colSpan: 2 },
    { label: 'Password', name: 'password', type: 'password', colSpan: 2 },
    { label: 'Graduation year', name: 'graduationYear', type: 'number' },
    { label: 'Branch', name: 'branch' },
    { label: 'College name', name: 'collegeName' },
    { label: 'College location (optional)', name: 'collegeLocation', colSpan: 2 },
  ]

  const isOptionalField = (name) => name === 'branch' || name === 'collegeLocation'

  return (
    <Box position="relative" minH="100vh" bgGradient="linear(135deg, #041C32 0%, #0F766E 35%, #0EA5E9 90%)" overflow="hidden">
      <Box position="absolute" inset="0" pointerEvents="none" zIndex={0}>
        <Spotlight
          gradientFirst="radial-gradient(70% 75% at 50% 30%, rgba(14,165,233,0.35) 0%, rgba(14,165,233,0.08) 50%, transparent 85%)"
          gradientSecond="radial-gradient(50% 55% at 50% 50%, rgba(32,212,177,0.25) 0%, rgba(32,212,177,0.05) 70%, transparent 100%)"
          gradientThird="radial-gradient(45% 50% at 50% 50%, rgba(15,118,110,0.15) 0%, rgba(15,118,110,0.03) 70%, transparent 100%)"
          translateY={-320}
          width={720}
          height={1600}
          smallWidth={320}
          duration={9}
          xOffset={160}
        />
      </Box>
      <Box
        position="absolute"
        inset="0"
        opacity={0.35}
        backgroundImage="linear-gradient(120deg, rgba(255,255,255,0.08) 0%, transparent 45%), linear-gradient(300deg, rgba(15,118,110,0.25) 0%, transparent 60%)"
        mixBlendMode="screen"
        pointerEvents="none"
      />

      <Stack
        position="relative"
        zIndex={1}
        minH="100vh"
        align="center"
        justify="center"
        px={{ base: 4, md: 6 }}
        py={{ base: 10, md: 16 }}
      >
        <MotionBox
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          p={{ base: 6, md: 8 }}
          borderRadius="2xl"
          boxShadow="0 45px 120px rgba(2, 6, 23, 0.65)"
          bg="linear-gradient(145deg, rgba(8, 15, 33, 0.78), rgba(4, 12, 23, 0.6))"
          backdropFilter="blur(24px)"
          border="1px solid"
          borderColor="whiteAlpha.300"
          position="relative"
          overflow="hidden"
          maxW="600px"
          w="full"
          _before={{
            content: '""',
            position: 'absolute',
            inset: '-1px',
            borderRadius: 'inherit',
            padding: '1px',
            bgGradient: 'linear(120deg, rgba(56,189,248,0.45), rgba(16,185,129,0.25))',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
            opacity: 0.75
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={8}>
              <Stack spacing={4} align="center" textAlign="center">
                <Box position="relative" width="260px" height="84px" mx="auto">
                  <Image
                    src="/logo.png"
                    alt="GradNet Logo"
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'center' }}
                    priority
                  />
                </Box>
                <Heading size="lg" color="white">
                  Create your GradNet profile
                </Heading>
                <Text color="whiteAlpha.700" fontSize="sm">
                  Connect with alumni, join professional circles, and build your network.
                </Text>
              </Stack>

              <Fieldset.Root size="lg" gap={4}>
                <Fieldset.Legend color="whiteAlpha.900" fontWeight="semibold">
                  Profile details
                </Fieldset.Legend>
                <Fieldset.HelperText color="whiteAlpha.700">
                  Help us verify your student status and connect you with the right alumni.
                </Fieldset.HelperText>

                <Fieldset.Content pt={4}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {formFields.map(({ label, name, type = 'text', colSpan = 1 }) => (
                      <Box
                        key={name}
                        gridColumn={{ base: 'span 1', md: `span ${colSpan}` }}
                      >
                        <Stack spacing={2}>
                          <Label htmlFor={name} className="text-sm font-semibold text-white">
                            {label}
                          </Label>
                          <GradientInput
                            id={name}
                            name={name}
                            type={type}
                            value={state[name] || ''}
                            onChange={handleChange}
                            disabled={state.loading}
                            required={!isOptionalField(name)}
                            className="h-12 bg-white/10 text-base text-white placeholder:text-white/60 focus-visible:ring-teal-300"
                          />
                        </Stack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Fieldset.Content>
              </Fieldset.Root>

              <Stack spacing={4}>
                {state.error && (
                  <MotionBox
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    p={3}
                    bg="rgba(239, 68, 68, 0.15)"
                    borderRadius="md"
                    border="1px"
                    borderColor="rgba(248, 113, 113, 0.35)"
                  >
                    <Text color="red.200" fontSize="sm">{state.error}</Text>
                  </MotionBox>
                )}

                {state.success && (
                  <MotionBox
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    p={3}
                    bg="rgba(34, 197, 94, 0.15)"
                    borderRadius="md"
                    border="1px"
                    borderColor="rgba(74, 222, 128, 0.35)"
                  >
                    <Text color="green.100" fontSize="sm">{state.success}</Text>
                  </MotionBox>
                )}

                <Button
                  type="submit"
                  {...primaryButtonStyles}
                  isLoading={state.loading}
                  as={motion.button}
                  whileTap={{ scale: 0.98 }}
                >
                  Join GradNet
                </Button>
                <Text fontSize="xs" color="whiteAlpha.600">
                  By continuing you agree to the GradNet community guidelines and our privacy commitment.
                </Text>
                <Box h="1px" w="full" bg="border.subtle" />
                <Button
                  variant="link"
                  colorScheme="whiteAlpha"
                  color="whiteAlpha.900"
                  onClick={() => router.push('/signin')}
                  alignSelf="flex-start"
                >
                  Already part of the community? Sign in
                </Button>
              </Stack>
            </Stack>
          </form>
        </MotionBox>
      </Stack>
    </Box>
  )
}
