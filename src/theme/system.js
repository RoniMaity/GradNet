'use client'

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const gradConfig = defineConfig({
  globalCss: {
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
    'html, body': {
      backgroundColor: 'bg.canvas',
      color: 'fg.default',
      fontFamily: 'body',
      minHeight: '100%',
      margin: 0,
    },
    body: {
      lineHeight: 1.5,
      fontSize: '1rem',
      WebkitFontSmoothing: 'antialiased',
      textRendering: 'optimizeLegibility',
    },
    '::selection': {
      backgroundColor: 'brand.200',
      color: 'brand.900',
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#E6FBF7' },
          100: { value: '#C8F5EC' },
          200: { value: '#9EEBDC' },
          300: { value: '#6FDCC7' },
          400: { value: '#3FCCB2' },
          500: { value: '#2AB79F' },
          600: { value: '#149582' },
          700: { value: '#0F7565' },
          800: { value: '#0B4D44' },
          900: { value: '#052A25' },
        },
        accent: {
          50: { value: '#EFF6FF' },
          100: { value: '#DBEAFE' },
          200: { value: '#BFDBFE' },
          300: { value: '#93C5FD' },
          400: { value: '#60A5FA' },
          500: { value: '#3B82F6' },
          600: { value: '#2563EB' },
          700: { value: '#1D4ED8' },
          800: { value: '#1E40AF' },
          900: { value: '#1E3A8A' },
        },
        ink: {
          50: { value: '#F2F4F7' },
          100: { value: '#E4E7EC' },
          200: { value: '#D0D5DD' },
          300: { value: '#98A2B3' },
          400: { value: '#667085' },
          500: { value: '#475467' },
          600: { value: '#344054' },
          700: { value: '#1D2939' },
          800: { value: '#0F172A' },
          900: { value: '#020617' },
        },
      },
      fonts: {
        heading: {
          value: 'var(--font-plus-jakarta), "Plus Jakarta Sans", "Inter", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        body: {
          value: 'var(--font-inter), "Inter", "Plus Jakarta Sans", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        mono: { value: '"IBM Plex Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace' },
      },
      radii: {
        full: { value: '999px' },
        '3xl': { value: '2.5rem' },
        '2xl': { value: '1.75rem' },
        xl: { value: '1.25rem' },
        lg: { value: '1rem' },
        md: { value: '0.75rem' },
      },
      shadows: {
        brand: { value: '0 25px 50px -12px rgba(20, 149, 130, 0.25)' },
        soft: { value: '0 20px 45px rgba(15, 23, 42, 0.12)' },
      },
      spacing: {
        gutter: { value: '1.25rem' },
      },
    },
    semanticTokens: {
      colors: {
        'bg.canvas': {
          value: { base: '#F4F7FB', _dark: '#030712' },
        },
        'bg.surface': {
          value: { base: '#FFFFFF', _dark: '#0F172A' },
        },
        'bg.muted': {
          value: { base: '#EEF2FF', _dark: '#111827' },
        },
        'fg.default': {
          value: { base: '#0F172A', _dark: '#F8FAFC' },
        },
        'fg.muted': {
          value: { base: '#475467', _dark: '#CBD5F5' },
        },
        'border.subtle': {
          value: { base: 'rgba(15, 23, 42, 0.08)', _dark: 'rgba(148, 163, 184, 0.35)' },
        },
        'brand.surface': {
          value: { base: 'rgba(20, 149, 130, 0.12)', _dark: 'rgba(34, 197, 94, 0.18)' },
        },
      },
      gradients: {
        'brand.hero': {
          value: 'linear-gradient(135deg, #0EA5E9 0%, #14B8A6 45%, #22D3EE 100%)',
        },
        'brand.card': {
          value: 'linear-gradient(145deg, rgba(20,149,130,0.08), rgba(59,130,246,0.08))',
        },
      },
    },
    textStyles: {
      display: {
        fontFamily: 'heading',
        fontWeight: '700',
        lineHeight: '1.1',
        letterSpacing: '-0.04em',
        fontSize: { base: '2.5rem', md: '3rem', lg: '3.5rem' },
      },
      heading: {
        fontFamily: 'heading',
        fontWeight: '600',
        letterSpacing: '-0.02em',
      },
      body: {
        fontFamily: 'body',
        color: 'fg.muted',
      },
      label: {
        fontSize: '0.9rem',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'fg.muted',
      },
    },
    layerStyles: {
      card: {
        backgroundColor: 'bg.surface',
        borderRadius: '2xl',
        borderWidth: '1px',
        borderColor: 'border.subtle',
        boxShadow: 'soft',
      },
      mutedCard: {
        backgroundColor: 'brand.surface',
        borderRadius: 'xl',
        borderWidth: '1px',
        borderColor: 'transparent',
      },
    },
  },
})

export const gradSystem = createSystem(defaultConfig, gradConfig)
