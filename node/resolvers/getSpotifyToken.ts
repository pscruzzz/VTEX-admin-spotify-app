interface getTokenArgs {
  code: string,
  redirect_uri: string
}

interface IGetTokenResponse {
  access_token: string,
  token_type: string,
  scope: string,
  expires_in: number,
  refresh_token: string
}

export const getSpotifyToken = async(
  _: any,
  args: getTokenArgs,
  ctx: Context
) =>{

  try{
    const response: IGetTokenResponse = await ctx.clients.spotify.getToken(
      args.code,
      args.redirect_uri
    )

    const nowToken = new Date()
    const timeToken = nowToken.getTime()
    const expireToken = timeToken + 60 * 60000
    const dateToken = nowToken.setTime(expireToken)

    const nowRefreshToken = new Date()
    const timeRefreshToken = nowRefreshToken.getTime()
    const expireRefreshTokenTime = timeRefreshToken + 2 * 24 * 60 * 60000
    const dateRefreshToken = nowRefreshToken.setTime(expireRefreshTokenTime)

    ctx.cookies.set("spotifyToken", response.access_token, {maxAge: 0, path: '/', httpOnly: true, expires: new Date(dateToken)})
    ctx.cookies.set("spotifyRefreshToken", response.refresh_token, {maxAge: 0, path: '/', httpOnly: true, expires: new Date(dateRefreshToken)})
    ctx.cookies.set("isAuthenticated", "true", {maxAge: 0, path: '/', expires: new Date(dateToken)})

    return response ? {didSucceed: true} : {didSucceed: false}
  } catch(e){
    ctx.response.status = 404
    return {didSucceed: false}
  }

}
