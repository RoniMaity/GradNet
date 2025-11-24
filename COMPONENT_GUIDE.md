# GradNet Component Usage Guide

## Navigation
Access your profile: `/profile/[userId]`
Example: `/profile/1`

## Color Palette Reference

```javascript
// Primary Colors
teal.600 - Main brand color for buttons, links, highlights
teal.500 - Secondary brand color for hover states
teal.400 - Lighter teal for gradients

// Backgrounds
gray.50 - Page backgrounds
white - Card backgrounds

// Text Colors
gray.800 - Primary text (headings, important content)
gray.700 - Form labels
gray.600 - Secondary text (descriptions, metadata)
gray.500 - Muted text (placeholders, disabled states)

// States
red.600 / red.50 / red.200 - Error states
green.600 / green.50 / green.200 - Success states
```

## Component Styling Standards

### Cards
```javascript
<Card p={6} bg="white" shadow="sm" borderRadius="lg">
  {/* content */}
</Card>
```

### Buttons
```javascript
// Primary Action
<Button colorScheme="teal" size="lg">
  Action
</Button>

// Secondary/Link
<Button variant="link" colorScheme="teal">
  Link Text
</Button>
```

### Error Messages
```javascript
<Box p={3} bg="red.50" borderRadius="md" border="1px" borderColor="red.200">
  <Text color="red.600" fontSize="sm">{errorMessage}</Text>
</Box>
```

### Form Inputs
```javascript
<Field.Root>
  <Field.Label color="gray.700">Label</Field.Label>
  <Input borderRadius="md" /* other props */ />
</Field.Root>
```

## Responsive Breakpoints

```javascript
// Hide on mobile, show on desktop
display={{ base: "none", lg: "block" }}

// Different padding for mobile vs desktop
p={{ base: 4, md: 6 }}

// Flexible sizing
w={{ base: "100%", lg: "250px" }}
```

## Layout Structure

```
App Root
├── Signin/Signup (No sidebar)
│   └── Centered form with white card on gray.50 background
│
└── Authenticated Pages (With sidebar)
    ├── LeftSidebar (250px fixed, hidden on mobile)
    ├── Main Content (ml="250px" on desktop, ml="0" on mobile)
    │   └── Max width container (maxW="900px")
    └── Optional Right Sidebar
```

## Icon Usage

```javascript
import { HiHome, HiUser, HiUsers, HiCog, HiLogout } from 'react-icons/hi'

// In buttons
<Button leftIcon={<HiHome />}>Home</Button>

// Standalone with sizing
<Icon as={HiHome} boxSize={5} />
```

## Common Patterns

### Loading State
```javascript
if (loading) {
  return (
    <Flex minH="100vh" bg="gray.50">
      <LeftSidebar />
      <Center flex="1" ml={{ base: "0", lg: "250px" }}>
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Center>
    </Flex>
  )
}
```

### Empty State
```javascript
<Card p={12} textAlign="center" bg="white" shadow="sm" borderRadius="lg">
  <Text color="gray.500" fontSize="lg">
    No items to show
  </Text>
</Card>
```

### Stats Display
```javascript
<VStack spacing={1} align="center">
  <Text fontSize="2xl" fontWeight="bold" color="teal.600">
    {count}
  </Text>
  <Text fontSize="sm" color="gray.600" fontWeight="medium">
    Label
  </Text>
</VStack>
```

## Page Templates

### Authenticated Page Template
```javascript
'use client'

import { Box, Flex } from '@chakra-ui/react'
import LeftSidebar from '@/components/leftSideBar'

export default function PageName() {
  return (
    <Flex minH="100vh" bg="gray.50">
      <LeftSidebar />
      
      <Box 
        flex="1" 
        ml={{ base: "0", lg: "250px" }}
        p={{ base: 4, md: 6 }}
      >
        <Box maxW="900px" mx="auto">
          {/* Your content here */}
        </Box>
      </Box>
    </Flex>
  )
}
```

### Form Page Template (Auth)
```javascript
'use client'

import { Box, AbsoluteCenter } from '@chakra-ui/react'

export default function FormPage() {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" p={4}>
      <AbsoluteCenter>
        <Box bg="white" p={{ base: 6, md: 8 }} borderRadius="xl" shadow="lg" maxW="md" w="full">
          {/* Form content */}
        </Box>
      </AbsoluteCenter>
    </Box>
  )
}
```

## API Integration Pattern

```javascript
const fetchData = useCallback(async () => {
  try {
    setLoading(true)
    const response = await fetch('/api/endpoint', {
      credentials: 'include'
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch')
    }
    
    const data = await response.json()
    setData(data)
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}, [])
```

## Accessibility Features

- All interactive elements have proper `aria-label` attributes
- Color contrast ratios meet WCAG AA standards
- Keyboard navigation supported
- Semantic HTML structure
- Form validation with required fields

## Performance Optimization

- useCallback for functions in useEffect dependencies
- Lazy loading for images
- Proper key props in mapped components
- Minimal re-renders with proper state management

---

**Note**: This design system ensures consistency across the entire application while maintaining flexibility for future enhancements.
