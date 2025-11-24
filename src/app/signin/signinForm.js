'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Box, Button, Heading, Icon, Stack, Text } from "@chakra-ui/react"
import { LuArrowRight } from 'react-icons/lu'
import { motion } from 'framer-motion'
import { Spotlight } from '@/components/ui/spotlight-new'
import { Input as GradientInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const MotionBox = motion.create(Box)

export default function LoginForm() {
    const router = useRouter()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

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

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            
            if (res.ok) {
                setSuccess('Login successful! Redirecting you to the dashboard…')
                setTimeout(() => {
                    router.push('/dashboard')
                }, 600)
            } else {
                setError(data.error || 'Invalid credentials')
            }
        } catch {
            setError('Server error. Try again.')
        } finally {
            setLoading(false)
        }
    }

    const backgroundGradient = 'linear(135deg, #041C32 0%, #0F766E 35%, #0EA5E9 90%)'

    return (
        <Box position="relative" minH="100vh" bgGradient={backgroundGradient} overflow="hidden">
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
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    w="full"
                    maxW="520px"
                    p={{ base: 6, md: 8 }}
                    borderRadius="2xl"
                    boxShadow="0 45px 120px rgba(2, 6, 23, 0.65)"
                    bg="linear-gradient(145deg, rgba(8, 15, 33, 0.78), rgba(4, 12, 23, 0.62))"
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
                            <Heading size="lg" bgGradient={titleGradient} bgClip="text" textShadow="0 15px 35px rgba(14,165,233,0.35)">
                                Sign in to GradNet
                            </Heading>
                            <Text color="whiteAlpha.700" fontSize="sm" maxW="sm">
                                Rejoin your mentorship circles, track applications, and stay in sync with your cohort.
                            </Text>
                        </Stack>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={6}>
                                <Stack spacing={2}>
                                    <Label htmlFor="email" className="text-sm font-semibold text-white">
                                        Email
                                    </Label>
                                    <GradientInput
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                    />
                                </Stack>

                                <Stack spacing={2}>
                                    <Label htmlFor="password" className="text-sm font-semibold text-white">
                                        Password
                                    </Label>
                                    <GradientInput
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                    />
                                </Stack>

                                {error && (
                                    <MotionBox
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        p={3}
                                        bg="rgba(239, 68, 68, 0.15)"
                                        borderRadius="md"
                                        border="1px"
                                        borderColor="rgba(248, 113, 113, 0.35)"
                                    >
                                        <Text color="red.200" fontSize="sm">{error}</Text>
                                    </MotionBox>
                                )}

                                {success && (
                                    <MotionBox
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        p={3}
                                        bg="rgba(34, 197, 94, 0.15)"
                                        borderRadius="md"
                                        border="1px"
                                        borderColor="rgba(74, 222, 128, 0.35)"
                                    >
                                        <Text color="green.100" fontSize="sm">{success}</Text>
                                    </MotionBox>
                                )}

                                <Button
                                    {...primaryButtonStyles}
                                    type="submit"
                                    size="lg"
                                    fontWeight="semibold"
                                    transition="all 0.2s"
                                    isLoading={loading}
                                    as={motion.button}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Sign in <Icon as={LuArrowRight} ml={2} />
                                </Button>

                                <Box h="1px" w="full" bg="whiteAlpha.200" />

                                <Button
                                    variant="link"
                                    colorScheme="whiteAlpha"
                                    color="whiteAlpha.900"
                                    onClick={() => router.push('/signup')}
                                    alignSelf="flex-start"
                                    fontSize="sm"
                                >
                                    Don&apos;t have an account? Create one
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </MotionBox>
            </Stack>
        </Box>
    )
}