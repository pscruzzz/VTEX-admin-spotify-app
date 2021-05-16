import React, { FC, useCallback, useState, useEffect } from 'react'
import {useQuery, useLazyQuery } from 'react-apollo'

import SpotifyAuthPage from './pages/spotifyAuthPage'
import Dashboard from './pages/dashboard'

import getSpotifyRefreshedToken from './graphql/getSpotifyRefreshedToken.graphql'

import {useAuth} from './hooks/authProvider'

import './styles.global.css'

enum AuthStates{
  notAuth = 'notAuth',
  refreshTokenExists = 'refreshTokenExists',
  authTokenExists = 'authTokenExists',
}

const App: FC = () => {

  const {notifyAuthChange} = useAuth()
  const [authState, setAuthState] = useState<AuthStates>(AuthStates.notAuth)
  console.log(notifyAuthChange)
  console.log(authState, "authState")

  const [latestCookie, setLatestCookie] = useState(document.cookie);

  const [getRefreshedToken] = useLazyQuery(getSpotifyRefreshedToken)

  useEffect(()=>{
    const cookieIsAuthenticated = document.cookie.split("; ").filter(elem => elem.search("isAuthenticated=")!==-1)[0]?.split("=")[1]
    const cookieHasRefreshToken = document.cookie.split("; ").filter(elem => elem.search("hasRefreshToken=")!==-1)[0]?.split("=")[1]

    document.cookie !== latestCookie && setLatestCookie(document.cookie);

    if(cookieIsAuthenticated){
      setAuthState(AuthStates.authTokenExists)
      console.log('oi')
      return
    } else if(cookieHasRefreshToken){
      getRefreshedToken({variables: {cookieHasRefreshToken}})
      setAuthState(AuthStates.refreshTokenExists)
      console.log('oi meio')
      return
    } else {
      setAuthState(AuthStates.notAuth)
      console.log('tchau')
      return
    }

  },[latestCookie])

  return (
    <>
      {authState === AuthStates.notAuth && <SpotifyAuthPage/>}
      {authState === AuthStates.authTokenExists && <Dashboard/>}
    </>
  )
}

export default App
