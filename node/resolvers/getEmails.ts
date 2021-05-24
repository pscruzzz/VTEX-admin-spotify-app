interface SearchDocsRes {
  data: { email: string, type: string }[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export const getEmails = async (_: any, __: any, ctx: Context) => {

  if (!ctx.vtex.sessionToken) {
    ctx.status = 401
    ctx.body = { message: "User is not auhorized" }
    return
  }

  const response: SearchDocsRes = await ctx.clients.masterdata.searchDocumentsWithPaginationInfo({
    dataEntity: "SpotifyEmail",
    fields: ["email", "type"],
    pagination: {
      page: 1,
      pageSize: 99
    },
    schema: 'SpotifySchema'
  })

  ctx.status = 200
  return response.data
}
