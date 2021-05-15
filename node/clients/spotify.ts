
import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import qs from 'qs';
import {config} from '../spotifyConfig'

interface IGetTokenResponse {
  access_token: string,
  token_type: string,
  scope: string,
  expires_in: number,
  refresh_token: string
}

export default class Spotify extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('https://accounts.spotify.com', context, options)
  }

  public async getToken(code: string, redirect_uri: string): Promise<IGetTokenResponse> {

    const body = qs.stringify({
      'grant_type': 'authorization_code',
      code,
      redirect_uri,
      client_id: config.SPOTIFY_CLIENT_ID,
      client_secret: config.SPOTIFY_CLIENT_SECRET
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    const response: IGetTokenResponse = await this.http.post("api/token", body, { headers })
    return response

  }

  public async getRefreshedToken(refresh_token: string){

    const body = qs.stringify({
      'grant_type': 'refresh_token',
      refresh_token,
      client_id: config.SPOTIFY_CLIENT_ID,
      client_secret: config.SPOTIFY_CLIENT_SECRET
    })

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    const response: IGetTokenResponse = await this.http.post('api/token',body, { headers } )
    return response
  }

}
