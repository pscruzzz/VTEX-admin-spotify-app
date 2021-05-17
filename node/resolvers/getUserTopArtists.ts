interface getUserTopArtistsArgs{
  time_range: string
}

export const getUserTopArtists = async (_:any, args: getUserTopArtistsArgs, ctx: Context) => {
  const authToken = ctx.cookies.get("spotifyToken")
  try{
    const response = await ctx.clients.spotifyAPI.getUserTop("artists", args.time_range ,authToken)
    return response
  } catch(e){
    ctx.response.status = 404
    return e
  }
}
