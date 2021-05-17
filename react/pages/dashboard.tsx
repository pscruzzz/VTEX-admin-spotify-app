import React from "react"
import { Layout, PageHeader, PageBlock, Card, Button, Spinner } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import getSpotifyTop from '../graphql/getSpotifyTop.graphql'
//import { Table } from '@vtex/admin-ui'

const Dashboard: React.FC = () => {
  const { data: artistsData, loading: artistsLoading, error: errorFecthingArtists } = useQuery(getSpotifyTop, {
    variables: {
      type: "artists"
    }
  })

  const { data: tracksData, loading: tracksLoading, error: errorFecthingTracks } = useQuery(getSpotifyTop, {
    variables: {
      type: "tracks"
    }
  })

  if (artistsLoading || tracksLoading) {
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
            <h1>Hold on while we load your stuff</h1>
            <Spinner/>
          </div>
        </PageBlock>
      </Layout>
    )
  }

  if (errorFecthingArtists || errorFecthingTracks) {
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
          </div>
        </PageBlock>
      </Layout>
    )
  }

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
          <h1>Welcome to Spotify</h1>
        </div>
      </PageBlock>
    </Layout>
  )
}

export default Dashboard
