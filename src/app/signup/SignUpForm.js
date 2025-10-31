'use client'

import { useState } from 'react'
import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
  AbsoluteCenter,
  Heading,
  Highlight,
  ProgressCircle
} from "@chakra-ui/react"
import { useRouter } from 'next/navigation'

export default function SignUpForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      console.log(data)
      if (data.message === 'User created successfully.') router.push('/dashboard')
      else setError(data.error || 'Signup failed')
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
        </ProgressCircle.Root>) : (
        <form onSubmit={handleSubmit}>
          <Fieldset.Root size="lg" maxW="md">
            <Stack spacing={6}>
              <Heading size="3xl" letterSpacing="tight">
                <Highlight query="GradNet" styles={{ color: "teal.600" }}>
                  GradNet
                </Highlight>
              </Heading>

              <Fieldset.Content>
                <Field.Root>
                  <Field.Label>Name</Field.Label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    autoComplete='true'
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Email</Field.Label>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    autoComplete='true'
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
                    autoComplete='true'
                  />
                </Field.Root>
              </Fieldset.Content>

              {error && <p style={{ color: 'red' }}>{error}</p>}

              <Button type="submit" alignSelf="flex-start" isLoading={loading} colorScheme="teal">
                Sign Up
              </Button>
              <Button variant="link" onClick={() => router.push('/signin')}>
                Already have an account? Sign In
              </Button>
            </Stack>
          </Fieldset.Root>
        </form>)}
    </AbsoluteCenter>
  )
}