import { IOClients } from '@vtex/api'

import Spotify from './spotify'

//import { OMS } from '@vtex/clients'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get spotify() {
    return this.getOrSet('spotify', Spotify)
  }
}
