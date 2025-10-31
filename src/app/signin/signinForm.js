'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    AbsoluteCenter,
    Stack,
    Fieldset,
    Field,
    Input,
    Button,
    Heading,
    Highlight,
    ProgressCircle
} from "@chakra-ui/react"

export default function LoginForm() {
    const router = useRouter()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            // console.log(data)
            if (data.message === 'Sign-in successful.') {
                router.push('/dashboard') // redirect after successful login
            } else {
                setError(data.error || 'Invalid credentials')
            }
        } catch {
            setError('Server error. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AbsoluteCenter>
            {loading ? (
                <ProgressCircle.Root value={null} size="xl" colorPalette={{ base: "teal.500", 500: "teal.600" }}>
                    <ProgressCircle.Circle>
                        <ProgressCircle.Track />
                        <ProgressCircle.Range />
                    </ProgressCircle.Circle>
                </ProgressCircle.Root>
            ) :
                (<form onSubmit={handleSubmit}>
                    <Fieldset.Root size="lg" maxW="md">
                        <Stack spacing={6}>
                            <Heading size="3xl" letterSpacing="tight">
                                Welcome back! <Highlight query="Login" styles={{ color: "teal.600" }}>Login</Highlight>
                            </Heading>

                            <Fieldset.Content>
                                <Field.Root>
                                    <Field.Label>Email</Field.Label>
                                    <Input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        disabled={loading} // native input uses disabled
                                        required
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>Password</Field.Label>
                                    <Input
                                        name="password"
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                    />
                                </Field.Root>
                            </Fieldset.Content>

                            {error && <p style={{ color: 'red' }}>{error}</p>}

                            <Button type="submit" colorScheme="teal" isLoading={loading} alignSelf="flex-start">
                                Login
                            </Button>
                            <Button variant="link" onClick={() => router.push('/signup')}>
                                Don&apos;t have an account? Sign Up
                            </Button>
                        </Stack>
                    </Fieldset.Root>
                </form>)}
        </AbsoluteCenter>
    )
}