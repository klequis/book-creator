// @ts-nocheck
// import colors from "@colors/colors";

/*
url: /_server?id=src_client-api_handle-error_ts--throwActonTryCatchRethrow_action&name=/home/carl/P/book/samples/example-steps/solidstart-express/client/src/client-api/handle-error.ts?tsr-directive-use-server=
- /_server?
- id=src_client-api_handle-error_ts--throwActonTryCatchRethrow_action
- name=/home/carl/P/book/samples/example-steps/solidstart-express/client/src/client-api/handle-error.ts
- tsr-directive-use-server=
*/

function makeSolidUrl(urlString?: string): void {
  // Extract query string part after the ?
  console.log('makeSolidUrl|urlString:', urlString)
  const decodedUrl = decodeURIComponent(urlString)
  const a = decodedUrl.split('?')
  const isServer = a[0] === '/_server'
  const b = urlString
    ? {
        isServer,
        id: a[1].split('&')[0],
        name: a[1].split('&')[1],
        tsrDirectiveUseServer: a[1].split('&')[2],
      }
    : undefined
  console.group('url parts')
  console.table(b)
  console.groupEnd()
}

function logObject(tag, obj) {
  //   console.log('logObject|tag:', tag, 'obj:', obj, typeof obj)
  // if (!obj) return {tag: tag, }
  return { [tag]: obj, typeof: typeof obj, instanceof: obj.constructor }
}

export function logSubmission(tag, sub) {
  // console.log("LOG SUBMISSION")
  console.group(tag)
  console.log('sub:', logObject('sub', sub))
  sub.input
    ? console.log('sub.input:', logObject('input', sub.input))
    : console.log('sub.input:', sub.input)
  sub.input
    ? console.log(
        'sub.input.length:',
        logObject('input.length', sub.input?.length)
      )
    : console.log('sub.input.length:', sub.input?.length)
  sub.input
    ? console.log('sub.input?.[0]:', logObject('input?.[0]', sub.input?.[0]))
    : console.log('sub.input?.[0]:', sub.input?.[0])
  sub.input?.forEach((entry) =>
    console.log('entry:', logObject('entry', entry))
  )
  console.log('for .. entry.size:', '<not implemented>')
  console.log('getAll["name"]:', sub.input?.[0].getAll('name'))
  sub.result
    ? console.log('sub.result:', logObject('result', sub.result))
    : console.log('sub.result:', sub.result)
  sub.error
    ? console.log('sub.error:', logObject('error', sub.error))
    : console.log('sub.error:', sub.error)
  // console.log(colors.red('test'))
  // console.log(colors.red('error:'), colors.red(sub.error))
  sub.pending
    ? console.log('sub.pending:', logObject('sub.pending', sub.pending))
    : console.log('sub.pending:', sub.pending)
  makeSolidUrl(sub.url)
  console.groupEnd()
}
