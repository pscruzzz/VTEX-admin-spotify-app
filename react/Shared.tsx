import React, { useState, useEffect, useCallback } from "react"
import { Layout, PageHeader, PageBlock, Spinner, Tab, Tabs, ButtonGroup, Button, Alert } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import getEmails from './graphql/getEmails.graphql'

import { useAuth } from './hooks/authProvider'

import TableRefactured from './components/TableRefact'

import ModalRefact from './components/ModalReact'

import ModalProvider from './hooks/modalProvider'

interface IData {
  getEmails:IGetUsersEmail[]
}

interface IGetUsersEmail {
    type: string,
    email: string
}

const Shared: React.FC = () => {
  const { handleAuthCookieCheck } = useAuth()
  const {data, loading, error} = useQuery<IData>(getEmails)

  const usersColumns = [
    {
      id: 'email',
      title: 'Email',
    },
    {
      id: 'type',
      title: 'Type',
    }
  ]

  const mockUsersArray = [{ email: "loading", type:"loading"}]

  if (error) {
    return (
      <Layout
        pageHeader={
          <PageHeader
            title="Spotify"
          />
        }
      >
        <PageBlock variation="full" >
          <div className="flex flex-column items-center justify-center">
            <h1>Oopsie doopsie something went wrong</h1>
            <Alert type="error" action={{
              label: 'Resolve Errors',
              onClick: () => {
                document.cookie = 'hasRefreshToken' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = 'isAuthenticated' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                console.log("clicked")
                handleAuthCookieCheck()
                return
              }
            }}>
              You might wanna check your console and network
          </Alert>
          </div>
        </PageBlock>
      </Layout>
    )
  }

  return (
    <ModalProvider>
      <Layout
        pageHeader={
          <PageHeader
            title="Spotify"
            subtitle="Here it's some of your favorites"
          >
          </PageHeader>
        }
      >
        <PageBlock variation="full" >
          <div className="flex flex-column items-center justify-center w-100">
              <TableRefactured needsModal loading={loading} itemsList={data?.getEmails || mockUsersArray} columns={usersColumns}/>
              <ModalRefact/>
          </div>
        </PageBlock>
      </Layout>
    </ModalProvider>
  )
}

export default Shared
