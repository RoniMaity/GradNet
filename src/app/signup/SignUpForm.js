'use client'

import { useReducer } from 'react'
import {
  Badge,
  Box,
  Button,
  Fieldset,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  VStack
} from "@chakra-ui/react"
import { useRouter } from 'next/navigation'
import { LuShieldCheck, LuUsers, LuTarget, LuArrowUpRight } from 'react-icons/lu'
import { motion } from 'framer-motion'
import Image from 'next/image'
import AuthSplitLayout from '../../components/auth/AuthSplitLayout'
import { Input as GradientInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const MotionBox = motion.create(Box)
const MotionVStack = motion.create(VStack)
const MotionHStack = motion.create(HStack)

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

  const featureHighlights = [
    {
      title: 'Verified mentors',
      description: 'Connect with alumni who match your goals and background.',
      icon: LuShieldCheck,
    },
    {
      title: 'Curated circles',
      description: 'Join topic-led groups to learn, ship, and grow together.',
      icon: LuUsers,
    },
    {
      title: 'Career playbooks',
      description: 'Get templates, referrals, and hiring intel weekly.',
      icon: LuTarget,
    },
    {
      title: 'Momentum tracking',
      description: 'Share updates, unlock intros, and stay accountable.',
      icon: LuArrowUpRight,
    },
  ]

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 50, damping: 15 }
    }
  }

  return (
    <AuthSplitLayout
      /* Keeps the hero content supportive while the form card stays dominant */
      formWrapperProps={{ px: { base: 0, md: 4 }, mx: 'auto' }}
      leftPanel={
        <MotionVStack
          align="stretch"
          spacing={{ base: 8, lg: 10 }}
          color="whiteAlpha.900"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <MotionBox variants={itemVariants} mb={2}>
            <Box
              position="relative"
              width="220px"
              height="70px"
              _hover={{ transform: 'scale(1.05)' }}
              transition="transform 0.2s"
            >
              <Image
                src="/logo.png"
                alt="GradNet Logo"
                fill
                style={{ objectFit: 'contain', objectPosition: 'left' }}
                priority
              />
            </Box>
          </MotionBox>

          <Stack spacing={5} as={motion.div} variants={itemVariants}>
            <Badge
              width="fit-content"
              px={3}
              py={1}
              borderRadius="full"
              bg="whiteAlpha.200"
              border="1px solid"
              borderColor="whiteAlpha.400"
              fontWeight="600"
              letterSpacing="0.08em"
            >
              OPEN BETA ACCESS
            </Badge>
            <Heading textStyle="display" bgGradient={titleGradient} bgClip="text" textShadow="0 15px 35px rgba(14,165,233,0.35)" maxW="lg">
              Build your professional circle with GradNet
            </Heading>
            <Text fontSize="lg" color="whiteAlpha.800" maxW="2xl">
              Graduate faster with warm intros, curated mentors, and accountability cohorts designed for ambitious
              students. A single profile unlocks the entire GradNet ecosystem.
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} as={motion.div} variants={itemVariants}>
            {featureHighlights.map((feature) => (
              <MotionHStack
                key={feature.title}
                align="flex-start"
                spacing={4}
                bg="whiteAlpha.100"
                borderRadius="xl"
                p={4}
                border="1px"
                borderColor="whiteAlpha.200"
                whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.15)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                cursor="default"
              >
                <Icon as={feature.icon} boxSize={6} color="white" />
                <Box>
                  <Text fontWeight="semibold">{feature.title}</Text>
                  <Text fontSize="sm" color="whiteAlpha.800">
                    {feature.description}
                  </Text>
                </Box>
              </MotionHStack>
            ))}
          </SimpleGrid>

          <MotionBox
            bg="blackAlpha.300"
            border="1px solid"
            borderColor="whiteAlpha.300"
            borderRadius="2xl"
            p={5}
            mt={{ base: 0, lg: 2 }}
            backdropFilter="blur(8px)"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <Box>
                <Text fontSize="3xl" fontWeight="700">1,200+</Text>
                <Text color="whiteAlpha.700">students already building inside GradNet</Text>
              </Box>
              <Box>
                <Text fontSize="3xl" fontWeight="700">92%</Text>
                <Text color="whiteAlpha.700">match with a mentor within their first week</Text>
              </Box>
            </SimpleGrid>
          </MotionBox>
        </MotionVStack>
      }
      formPanel={
        <MotionBox
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          p={{ base: 6, md: 8 }}
          borderRadius="2xl"
          boxShadow="0 45px 120px rgba(2, 6, 23, 0.65)"
          bg="linear-gradient(145deg, rgba(8, 15, 33, 0.78), rgba(4, 12, 23, 0.6))"
          backdropFilter="blur(24px)"
          border="1px solid"
          borderColor="whiteAlpha.300"
          position="relative"
          overflow="hidden"
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
              <Stack spacing={3}>
                <Heading size="lg" bgGradient={titleGradient} bgClip="text">
                  Create your GradNet profile
                </Heading>
                <Text color="whiteAlpha.700" fontSize="sm">
                  Tell us about your academic journey so we can unlock relevant mentors, circles, and opportunities for you.
                </Text>
              </Stack>

              <Fieldset.Root size="lg" gap={4}>
                <Fieldset.Legend color="whiteAlpha.900" fontWeight="semibold">
                  Profile details
                </Fieldset.Legend>
                <Fieldset.HelperText color="whiteAlpha.700">
                  Used to personalise recommendations and ensure verified membership.
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
      }
    />
  )
}
