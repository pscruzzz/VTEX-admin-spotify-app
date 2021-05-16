import React from "react"
import { Layout, PageHeader, PageBlock, Spinner } from 'vtex.styleguide'

const Loading: React.FC = () => {

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
          <h1>Wait while we log in Spotify</h1>
          <Spinner/>
        </div>
      </PageBlock>
    </Layout>
  )
}

export default Loading
