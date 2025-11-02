'use client'

import { useReducer } from 'react'
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

function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value }
    case 'SET_LOADING':
      return { ...state, loading: action.value }
    case 'SET_ERROR':
      return { ...state, error: action.value }
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

      if (data.message === 'User created successfully.') {
        router.push('/dashboard')
      } else {
        dispatch({ type: 'SET_ERROR', value: data.error || 'Signup failed' })
      }
    } catch {
      dispatch({ type: 'SET_ERROR', value: 'Server error. Try again.' })
    } finally {
      dispatch({ type: 'SET_LOADING', value: false })
    }
  }

  return (
    <AbsoluteCenter>
      {state.loading ? (
        <ProgressCircle.Root value={null} size="xl" colorPalette={{ base: "teal.500", 500: "teal.600" }}>
          <ProgressCircle.Circle>
            <ProgressCircle.Track />
            <ProgressCircle.Range />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
      ) : (
        <form onSubmit={handleSubmit}>
          <Fieldset.Root size="lg" maxW="md">
            <Stack spacing={6}>
              <Heading size="3xl" letterSpacing="tight">
                <Highlight query="GradNet" styles={{ color: "teal.600" }}>
                  GradNet
                </Highlight>
              </Heading>

              <Fieldset.Content>
                {[
                  { label: "Name", name: "name" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Password", name: "password", type: "password" },
                  { label: "Graduation Year", name: "graduationYear", type: "number" },
                  { label: "Branch", name: "branch" },
                  { label: "College Name", name: "collegeName" },
                  { label: "College Location", name: "collegeLocation" },
                ].map(({ label, name, type = "text" }) => (
                  <Field.Root suppressHydrationWarning={true} key={name}>
                    <Field.Label>{label}</Field.Label>
                    <Input
                      name={name}
                      type={type}
                      value={state[name] || ''}
                      onChange={handleChange}
                      disabled={state.loading}
                      required={name !== 'collegeLocation' && name !== 'branch'}
                    />
                  </Field.Root>
                ))}
              </Fieldset.Content>

              {state.error && <p style={{ color: 'yellow' }}>{state.error}</p>}

              <Button type="submit" alignSelf="flex-start" isLoading={state.loading} colorScheme="teal">
                Sign Up
              </Button>
              <Button variant="link" onClick={() => router.push('/signin')}>
                Already have an account? Sign In
              </Button>
            </Stack>
          </Fieldset.Root>
        </form>
      )}
    </AbsoluteCenter>
  )
}
