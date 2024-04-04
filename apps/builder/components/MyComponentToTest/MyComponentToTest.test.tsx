import React from 'react'
import { render, screen } from '@testing-library/react'
import MyComponentToTest from './MyComponentToTest'

test('renders button correctly', () => {
  render(<MyComponentToTest />)

  screen.debug()
  screen.getByText('oi') // this one pass
  // screen.getByText('olá') // this one faills
})
