import React, { useState } from "react"
import { Layout, PageHeader, PageBlock, Spinner, Tab, Tabs } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import getUserTopArtists from '../graphql/getUserTopArtists.graphql'
import getUserTopTracks from '../graphql/getUserTopTracks.graphql'

import TableRefactured from '../components/tableRefact'

interface IArtistsData {
  getUserTopArtists: {
    items: {
      name: string
      genres: string[]
      external_urls: { spotify: string }
      followers: { total: number }
      images: { height: number, width: number, url: string }[]
    }[]
  }
}

interface ITracksData {
  getUserTopTracks: {
    items: {
      name: string
      external_urls: { spotify: string }
      artists: { name: string, external_urls: { spotify: string } }[]
      album: { name: string, images: { height: number, width: number, url: string }[] }
    }[]
  }
}

const Dashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<number>(1)
  const { data: artistsData, loading: artistsLoading, error: errorFecthingArtists } = useQuery<IArtistsData>(getUserTopArtists, {
    variables: {
      type: "artists"
    }
  })

  const { data: tracksData, loading: tracksLoading, error: errorFecthingTracks } = useQuery<ITracksData>(getUserTopTracks, {
    variables: {
      type: "tracks"
    }
  })

  const trackColumns = [
    {
      id: 'position',
      title: 'Position',
    },
    {
      id: 'name',
      title: 'Track',
    },
    {
      id: 'artist',
      title: 'Artist',
    },
    {
      id: 'album',
      title: 'Album',
    }
  ]

  const artistColumns = [
    {
      id: 'position',
      title: 'Position',
    },
    {
      id: 'name',
      title: 'Artist',
    },
    {
      id: 'genres',
      title: 'Genre',
    },
    {
      id: 'followers',
      title: 'Followers',
    }
  ]

  const artistsArray = artistsData?.getUserTopArtists.items.map((eachArtist, index) => {
    return {
      position: index + 1,
      name: eachArtist.name,
      genres: eachArtist.genres[0],
      followers: eachArtist.followers.total
    }
  })

  const tracksArray = tracksData?.getUserTopTracks.items.map((eachTrack, index) => {
    return {
      position: index + 1,
      name: eachTrack.name,
      artist: eachTrack.artists[0].name,
      album: eachTrack.album.name
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
            <Spinner />
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
          subtitle="Here it's some of your favorites"
        />
      }
    >
      <PageBlock variation="full" >
        <div className="flex flex-column items-center justify-center">
          <Tabs className="Main">
            <Tab
              className="artistsColumn" label="Artists"
              active={currentTab === 1}
              onClick={() => setCurrentTab(1)}>
              <TableRefactured loading={artistsLoading} itemsList={artistsArray} columns={artistColumns} />
            </Tab>
            <Tab className="songsColumn" label="Tracks"
              active={currentTab === 2}
              onClick={() => setCurrentTab(2)}>
              <TableRefactured loading={tracksLoading} itemsList={tracksArray} columns={trackColumns} />
            </Tab>
          </Tabs>
        </div>
      </PageBlock>
    </Layout>
  )
}

export default Dashboard
