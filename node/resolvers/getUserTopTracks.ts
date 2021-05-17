interface getUserTopArtistsArgs{
  time_range: string
}

export const getUserTopTracks = async (_:any, args: getUserTopArtistsArgs, ctx: Context) => {
  const authToken = ctx.cookies.get("spotifyToken")
  try{
    const response = await ctx.clients.spotifyAPI.getUserTop("tracks", args.time_range, authToken)
    return response
  } catch(e){
    ctx.response.status = 404
    return e
  }
}
