import React, { useState, useEffect } from 'react'
import {Modal, Tab, Tabs} from 'vtex.styleguide'
import {useModal} from '../hooks/modalProvider'
import getSharedFavorites from '../graphql/getSharedFavorites.graphql'
import { useLazyQuery } from 'react-apollo'
import TableRefactured from './TableRefact'

const ModalRefact: React.FC = () =>{
  const {isOpen, onClose, userState} = useModal()
  const [currentTab, setCurrentTab] = useState<number>(1)

  const [getShared, {data, loading, error}] = useLazyQuery(getSharedFavorites)

  useEffect(()=>{
    userState.type === "artist" ? setCurrentTab(1) : setCurrentTab(2)
    getShared({
      variables:{
      type: userState.type,
      email: userState.email
    }})
  },[isOpen])

  const trackColumns = [
    {
      id: 'position',
      title: 'Position',
    },
    {
      id: 'track',
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
      id: 'artist',
      title: 'Artist',
    },
    {
      id: 'genre',
      title: 'Genre',
    },
    {
      id: 'artistFollowers',
      title: 'Followers',
    }
  ]

  const mockArtistsArray = [{ position: 1, name: "loading", genres: "loading", artistFollowers: "loading" }]
  const mockTracksArray = [{ position: 1, name: "loading", artist: "loading", album: "loading" }]

  return(
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        aria-label="Payments Module"
        aria-describedby="modal-description">
        <div className="dark-gray" id="modal-description">
          <Tabs className="Main">
            <Tab
              className="artistsColumn" label="Artists"
              active={currentTab === 1}
              onClick={() => {
                setCurrentTab(1)
                getShared({
                  variables:{
                  type: "artist",
                  email: userState.email
                }})
              }}>
              <TableRefactured loading={loading} itemsList={ data?.getSharedFavorites || mockArtistsArray} columns={artistColumns} />
            </Tab>
            <Tab className="songsColumn" label="Tracks"
              active={currentTab === 2}
              onClick={() => {
                setCurrentTab(2)
                getShared({
                  variables:{
                  type: "track",
                  email: userState.email
                }})
              }}>
              <TableRefactured loading={loading} itemsList={data?.getSharedFavorites || mockTracksArray} columns={trackColumns} />
            </Tab>
          </Tabs>
        </div>
      </Modal>
  )
}

export default ModalRefact
