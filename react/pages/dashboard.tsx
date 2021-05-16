import React from "react"
import { Layout, PageHeader, PageBlock, Card, Button } from 'vtex.styleguide'

const Dashboard: React.FC = () =>{
  return(
    <Layout
      pageHeader={
        <PageHeader
          title="Spotify"
        />
      }
    >
      <PageBlock variation="full" >
        <div className="flex flex-column items-center justify-center">
          <h1>Welcome to Spotify</h1>
        </div>
      </PageBlock>
    </Layout>
  )
}

export default Dashboard
