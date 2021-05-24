interface IgetSharedFavoritesArgs {
  type: string
  email: string
}

export const getSharedFavorites = async (_:any, args: IgetSharedFavoritesArgs, ctx: Context) =>{

  if(!ctx.vtex.sessionToken){
    ctx.status = 401
    ctx.body = {message: "User is not auhorized"}
    return
  }

  const documentsArr = await ctx.clients.masterdata.searchDocumentsWithPaginationInfo({
    dataEntity: "Spotify",
    where: `type=${args.type} AND email=${args.email}`,
    fields: ["album",
      "artist",
      "email",
      "artistFollowers",
      "genre",
      "position",
      "track",
      "type"],
      pagination: {
        page: 1,
        pageSize: 99
      },
      schema: 'SpotifySchema'
  })
  ctx.status = 200
  return documentsArr.data
}
