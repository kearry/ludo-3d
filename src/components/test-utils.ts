// test-utils.tsx
import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Canvas } from '@react-three/fiber'

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Canvas>{children}</Canvas>
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }