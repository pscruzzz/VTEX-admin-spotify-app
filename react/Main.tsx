import React, { FC } from 'react'

import App from './App'
import AuthProvider from './hooks/authProvider'

const Main: FC = () => {

  return (
      <AuthProvider>
        <App />
      </AuthProvider>
  )
}

export default Main
