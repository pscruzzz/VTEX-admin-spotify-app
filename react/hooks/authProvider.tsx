import React, {createContext, useContext, useState} from 'react'

interface IContext {
  notifyAuthChange: number,
  handleNotifyAuthChange: ()=> void
}

const AuthContext = createContext<IContext>({} as IContext)


const AuthProvider: React.FC = ({children}) =>{
  const [notifyAuthChange, setNotifyAuthChange] = useState(1)

  const handleNotifyAuthChange = () =>{
    const now = new Date()

    setNotifyAuthChange(now.getTime())
    return
  }

  return(
    <AuthContext.Provider value={{notifyAuthChange, handleNotifyAuthChange}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}

export default AuthProvider
