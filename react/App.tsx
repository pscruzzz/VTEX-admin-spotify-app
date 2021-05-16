import React, { FC, useCallback, useState, useEffect } from 'react'
import SpotifyAuthPage from './pages/spotifyAuthPage'
import Dashboard from './pages/dashboard'
import Loading from './pages/loading'

import { useAuth, AuthStates } from './hooks/authProvider'

import './styles.global.css'

const App: FC = () => {

  const { authState, handleAuthCookieCheck } = useAuth()
  console.log(authState, "authState")

  useEffect(()=>{
    handleAuthCookieCheck()
  },[])

  return (
    <>
      {authState === AuthStates.notAuth && <SpotifyAuthPage />}
      {authState === AuthStates.refreshTokenExists && <Loading />}
      {authState === AuthStates.authTokenExists && <Dashboard />}
    </>
  )
}

export default App
