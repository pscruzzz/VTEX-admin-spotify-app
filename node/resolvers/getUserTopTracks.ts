export const getUserTopTracks = async (_:any, __: any, ctx: Context) => {
  const authToken = ctx.cookies.get("spotifyToken")
  try{
    const response = await ctx.clients.spotifyAPI.getUserTop("tracks", authToken)
    return response
  } catch(e){
    ctx.response.status = 404
    return e
  }
}
