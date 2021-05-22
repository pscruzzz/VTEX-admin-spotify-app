interface IPersistUserTableArgs {
  documentsArr: IDocument[]
}

interface IDocument {
  album?: string
  artist: string
  followers?: number
  genre?: string
  position: number
  track?: string
  type: string
}

export const persistUserTable = async (_:any, args: IPersistUserTableArgs, ctx: Context) =>{

  if(!ctx.vtex.sessionToken){
    ctx.status = 401
    ctx.body = {message: "User is not auhorized"}
    return
  }

  const currentSession = await ctx.clients.session.getSession(ctx.vtex.sessionToken, ['*'])
  const userEmail = currentSession.sessionData.namespaces?.authentication?.adminUserEmail?.value

  for (const [_, document] of args.documentsArr.entries()){
    await ctx.clients.masterdata.createDocument({
      dataEntity: "Spotify",
      fields:{
        album: document.album,
        artist: document.artist,
        email: userEmail,
        followers: document.followers,
        genre: document.genre,
        position: document.position,
        track: document.track,
        type: document.type
      },
      schema: 'v0.9'
    }
    )
  }

  ctx.status = 200
  return {message: "Document shared"}
}
