import React, { FC, useCallback, useState, useEffect } from 'react'
import {useQuery, useLazyQuery } from 'react-apollo'

import SpotifyAuthPage from './pages/spotifyAuthPage'
import Dashboard from './pages/dashboard'

import getSpotifyRefreshedToken from './graphql/getSpotifyRefreshedToken.graphql'

import './styles.global.css'

enum AuthStates{
  notAuth = 'notAuth',
  refreshTokenExists = 'refreshTokenExists',
  authTokenExists = 'authTokenExists',
}

const App: FC = () => {

  const [authState, setAuthState] = useState<AuthStates>(AuthStates.notAuth)

  const [getRefreshedToken] = useLazyQuery(getSpotifyRefreshedToken)

  useEffect(()=>{
    const cookieToken = document.cookie.split("; ").filter(elem => elem.search("spotifyToken=")!==-1)[0]?.split("=")[1]
    const cookieRefreshToken = document.cookie.split("; ").filter(elem => elem.search("spotifyRefreshToken=")!==-1)[0]?.split("=")[1]

    if(cookieToken){
      setAuthState(AuthStates.authTokenExists)
    } else if(cookieRefreshToken){
      getRefreshedToken({variables: {refresh_token: cookieRefreshToken}})
      setAuthState(AuthStates.refreshTokenExists)
    } else {
      setAuthState(AuthStates.notAuth)
    }

  },[])

  return (
    <>
      {authState === AuthStates.notAuth && <SpotifyAuthPage/>}
      {authState === AuthStates.authTokenExists && <Dashboard/>}
    </>
  )
}

export default App
