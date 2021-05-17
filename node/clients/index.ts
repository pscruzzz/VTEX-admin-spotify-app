import { IOClients } from '@vtex/api'

import {SpotifyAPI, SpotifyAuth} from './spotify'

//import { OMS } from '@vtex/clients'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get spotifyAuth() {
    return this.getOrSet('spotifyAuth', SpotifyAuth)
  }

  public get spotifyAPI() {
    return this.getOrSet('spotifyAPI', SpotifyAPI)
  }
}
