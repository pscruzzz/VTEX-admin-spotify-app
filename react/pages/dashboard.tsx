import React, { useState } from "react"
import { Layout, PageHeader, PageBlock, Spinner, Tab, Tabs, ButtonGroup, Button, Alert } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import getUserTopArtists from '../graphql/getUserTopArtists.graphql'
import getUserTopTracks from '../graphql/getUserTopTracks.graphql'
import {useAuth} from '../hooks/authProvider'

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

enum ITimeSetup {
  short = "short_term",
  medium = "medium_term",
  long = "long_term"
}

const Dashboard: React.FC = () => {
  const {handleAuthCookieCheck} = useAuth()
  const [currentTab, setCurrentTab] = useState<number>(1)
  const [currentTimeSetup, setCurrentTimeSetup] = useState<string>(ITimeSetup.medium)

  const { data: artistsData, loading: artistsLoading, error: errorFecthingArtists } = useQuery<IArtistsData>(getUserTopArtists, {
    variables: {
      time_range: currentTimeSetup
    }
  })

  const { data: tracksData, loading: tracksLoading, error: errorFecthingTracks } = useQuery<ITracksData>(getUserTopTracks, {
    variables: {
      time_range: currentTimeSetup
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

  const mockArtistsArray = [{position: 1, name: "loading", genres: "loading", followers: "loading"}]
  const mockTracksArray = [{position: 1, name: "loading", artist: "loading", album: "loading"}]

  const tracksArray = tracksData?.getUserTopTracks.items.map((eachTrack, index) => {
    return {
      position: index + 1,
      name: eachTrack.name,
      artist: eachTrack.artists[0].name,
      album: eachTrack.album.name
    }
  })

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
          <Alert type="error" action={{ label: 'Resolve Errors',
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
        <div className="flex flex-column items-center justify-center">
          <div className="w-100 flex justify-end">
        <ButtonGroup
            buttons={[
              <Button
                isActiveOfGroup={currentTimeSetup === ITimeSetup.short}
                onClick={() => setCurrentTimeSetup(ITimeSetup.short)}>
                Short term
              </Button>,
              <Button
                isActiveOfGroup={currentTimeSetup === ITimeSetup.medium}
                onClick={() => setCurrentTimeSetup(ITimeSetup.medium)}>
                Medium term
              </Button>,
              <Button
                isActiveOfGroup={currentTimeSetup === ITimeSetup.long}
                onClick={() => setCurrentTimeSetup(ITimeSetup.long)}>
                Long term
              </Button>,
            ]}
          />
          </div>
          <Tabs className="Main">
            <Tab
              className="artistsColumn" label="Artists"
              active={currentTab === 1}
              onClick={() => setCurrentTab(1)}>
              <TableRefactured loading={artistsLoading} itemsList={artistsArray || mockArtistsArray} columns={artistColumns} />
            </Tab>
            <Tab className="songsColumn" label="Tracks"
              active={currentTab === 2}
              onClick={() => setCurrentTab(2)}>
              <TableRefactured loading={tracksLoading} itemsList={tracksArray || mockTracksArray} columns={trackColumns} />
            </Tab>
          </Tabs>
        </div>
      </PageBlock>
    </Layout>
  )
}

export default Dashboard
