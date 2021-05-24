import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface IContext {
  isOpen: boolean,
  onOpen: ()=>void,
  onClose: ()=>void,
  userState: {email: string, type: string},
  onUserCall: (email: any, type: any) => void
}

const ModalContext = createContext<IContext>({} as IContext)

const ModalProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [userState, setUserState] = useState({email: "", type: ""})

  const onOpen = useCallback(() => setIsOpen(true), [])
  const onClose = useCallback(() => setIsOpen(false), [])
  const onUserCall = useCallback((email, type) => setUserState({email, type}), [])

  return (
    <ModalContext.Provider value={{ isOpen, onOpen, onClose, userState, onUserCall}}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  return useContext(ModalContext)
}

export default ModalProvider
