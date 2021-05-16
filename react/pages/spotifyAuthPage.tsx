import React, { useEffect, useCallback } from 'react'
import { Layout, PageHeader, PageBlock, Card, Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useLazyQuery } from 'react-apollo'
import getSpotifyToken from '../graphql/getSpotifyToken.graphql'
import { useAuth } from '../hooks/authProvider'

const SpotifyAuthPage: React.FC = () => {
  const { handleNotifyAuthChange } = useAuth()

  var win: any = null
  let urlSpotify = "https://accounts.spotify.com/authorize?response_type=code&client_id=d59764def6274222b825ea9687aa0afc&scope=user-read-private%2520user-read-email&redirect_uri=https%3A%2F%2Fspot--pedrocruz.myvtex.com%2Fadmin%2Fspotify"

  const [getToken] = useLazyQuery(getSpotifyToken);

  useEffect(() => {
    const urlParams = new URLSearchParams(win?.location.search);
    const codeParam = urlParams.get('code');
    if (codeParam) {
      window.opener.postMessage("Close the popup")
    } else {
      window.addEventListener('message', event => handleSpotifyAuth("close", event), false);
    }
  }, [])

  const handleSpotifyAuth = useCallback(async (action: string, event?: Event) => {
    const windowArea = {
      width: Math.floor(window.outerWidth * 0.2),
      height: Math.floor(window.outerHeight * 0.5),
    };
    const windowOpts = `toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,
    width=${windowArea.width},height=${windowArea.height}`

    switch (action) {
      case "open":
        win = window.open(urlSpotify, '_blank', windowOpts)
        break
      case "close":
        const urlParams = win ? new URLSearchParams(win.location.search) : null
        const codeParam = !!urlParams ? urlParams.get('code') : null
        getToken({
          variables: {
            redirect_uri: "https://spot--pedrocruz.myvtex.com/admin/spotify",
            code: codeParam
          }
        })
        win.close()
        handleNotifyAuthChange()
        break
    }
    return
  }, [])

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
          <h1>Authenticate to Spotify</h1>
          <span className="mb4">
            <Button variation="secondary" onClick={() => { handleSpotifyAuth("open") }}>Authenticate</Button>
          </span>
        </div>
      </PageBlock>
    </Layout>
  )
}

export default SpotifyAuthPage
