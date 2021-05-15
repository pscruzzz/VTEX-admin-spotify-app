import React, {createContext, useContext} from 'react'

interface IContext {
  handleGetToken: (code: string | null) => boolean,
}

const AuthContext = createContext<IContext>({} as IContext)


const AuthProvider: React.FC = ({children}) =>{

  const handleGetToken = (code: string | null) =>{

    return code ? true : false
  }

  return(
    <AuthContext.Provider value={{handleGetToken}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}

export default AuthProvider
