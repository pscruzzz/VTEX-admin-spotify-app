import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useLazyQuery } from 'react-apollo'

import getSpotifyRefreshedToken from '../graphql/getSpotifyRefreshedToken.graphql'

interface IContext {
  handleAuthCookieCheck: (retries?: number) => void,
  authState: string
}

export enum AuthStates {
  notAuth = 'notAuth',
  refreshTokenExists = 'refreshTokenExists',
  authTokenExists = 'authTokenExists',
}

const AuthContext = createContext<IContext>({} as IContext)

const AuthProvider: React.FC = ({ children }) => {
  const [authState, setAuthState] = useState<AuthStates>(AuthStates.notAuth)

  const [getRefreshedToken, {data, loading}] = useLazyQuery(getSpotifyRefreshedToken)

  useEffect(()=>{
    handleAuthCookieCheck()
  },[data, loading])

  const handleAuthCookieCheck = useCallback((retries: number = 0) => {
    setTimeout(() => {
      const cookieIsAuthenticated = document.cookie.split("; ").filter(elem => elem.search("isAuthenticated=") !== -1)[0]?.split("=")[1]
      const cookieHasRefreshToken = document.cookie.split("; ").filter(elem => elem.search("hasRefreshToken=") !== -1)[0]?.split("=")[1]

      if (cookieIsAuthenticated) {
        setAuthState(AuthStates.authTokenExists)
        return
      } else if (cookieHasRefreshToken) {
        retries === 0 && getRefreshedToken({ variables: { cookieHasRefreshToken: cookieHasRefreshToken} })
        setAuthState(AuthStates.refreshTokenExists)
        document.cookie = 'hasRefreshToken=' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        return
      } else {
        setAuthState(AuthStates.notAuth)
        return
      }
    }, 500)
  }, [])

  return (
    <AuthContext.Provider value={{ authState, handleAuthCookieCheck }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthProvider
