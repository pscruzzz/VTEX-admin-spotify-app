interface IGetUserTop {
  type: string
}

export const getUserTop = async (_:any, args: IGetUserTop, ctx: Context) => {
  const authToken = ctx.cookies.get("spotifyToken")
  try{
    const response = await ctx.clients.spotifyAPI.getUserTop(args.type, authToken)
    return response
  } catch(e){
    ctx.response.status = 404
    return e
  }
}
