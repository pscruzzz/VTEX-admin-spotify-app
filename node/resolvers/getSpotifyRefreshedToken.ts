interface IGetRefreshedToken {
  cookieHasRefreshToken: string
}

interface IGetRefreshedTokenResponse {
  access_token: string,
  token_type: string,
  scope: string,
  expires_in: number,
  refresh_token: string
}

export async function getSpotifyRefreshedToken(_: any, args: IGetRefreshedToken, ctx: Context) {
  if(!Boolean(args.cookieHasRefreshToken)){return { didSucceed: false }}
  try {
    const refresh_token = ctx.cookies.get("spotifyRefreshToken")
    const response: IGetRefreshedTokenResponse = await ctx.clients.spotify.getRefreshedToken(refresh_token ?? "")
    const nowToken = new Date()
    const timeToken = nowToken.getTime()
    const expireToken = timeToken + 60 * 60000
    const dateToken = nowToken.setTime(expireToken)

    const nowRefreshToken = new Date()
    const timeRefreshToken = nowRefreshToken.getTime()
    const expireRefreshTokenTime = timeRefreshToken + 2 * 24 * 60 * 60000
    const dateRefreshToken = nowRefreshToken.setTime(expireRefreshTokenTime)

    ctx.cookies.set("spotifyToken", response.access_token, { maxAge: 0, path: '/', httpOnly: true, expires: new Date(dateToken) })
    ctx.cookies.set("spotifyRefreshToken", response.refresh_token, { maxAge: 0, path: '/', httpOnly: true, expires: new Date(dateRefreshToken) })

    ctx.cookies.set("isAuthenticated", "true", {maxAge: 0, path: '/', httpOnly: false, expires: new Date(dateToken)})
    ctx.cookies.set("hasRefreshToken", "true", {maxAge: 0, path: '/', httpOnly: false, expires: new Date(dateRefreshToken)})

    return response ? { didSucceed: true } : { didSucceed: false }
  } catch (e) {
    ctx.response.status = 404
    return { didSucceed: false }
    //return e
  }
}
