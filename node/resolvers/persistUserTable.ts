interface IPersistUserTableArgs {
  documentsArr: IDocument[]
}

interface IDocument {
  album?: string
  artist: string
  artistFollowers?: number
  genre?: string
  position: number
  track?: string
  type: string
}

export const persistUserTable = async (_: any, args: IPersistUserTableArgs, ctx: Context) => {

  if (!ctx.vtex.sessionToken) {
    ctx.status = 401
    ctx.body = { message: "User is not auhorized" }
    return
  }

  const currentSession = await ctx.clients.session.getSession(ctx.vtex.sessionToken, ['*'])
  const userEmail = currentSession.sessionData.namespaces?.authentication?.adminUserEmail?.value

  const isUserAlreadyInLists = await ctx.clients.masterdata.searchDocuments({
    dataEntity: "SpotifyEmail",
    fields: [
      "email",
      "type"
    ],
    pagination: {
      page: 1,
      pageSize: 50
    },
    where: `email=${userEmail} AND type=${args.documentsArr[0].type}`,
    schema: 'SpotifySchema'
  })

  if (!isUserAlreadyInLists.length) {
    await ctx.clients.masterdata.createDocument({
      dataEntity: "SpotifyEmail",
      fields: {
        email: userEmail,
        type: args.documentsArr[0].type
      },
      schema: 'SpotifySchema'
    })

    for (const [_, document] of args.documentsArr.entries()) {
      await ctx.clients.masterdata.createDocument({
        dataEntity: "Spotify",
        fields: {
          album: document.album,
          artist: document.artist,
          email: userEmail,
          artistFollowers: document.artistFollowers,
          genre: document.genre,
          position: document.position,
          track: document.track,
          type: document.type
        },
        schema: 'SpotifySchema'
      }
      )
    }

    ctx.status = 200
    return { message: "Documents were shared" }

  }

  ctx.status = 400
  return { message: "Documents were not shared" }
}
