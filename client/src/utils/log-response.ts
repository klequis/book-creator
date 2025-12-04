import { log } from './log'

/**
 * Logs the response detailss for debugging.
 * @param response The Response object to log.
 * @param showBody Whether to log the response body (default: true).
 * @description:
 */
export async function logResponse(
  source: string,
  response: Response,
  showBody: boolean = true
) {
  const res = response.clone()

  
  const r1 = {
    url: res.url,
    status: res.status,
    statusText: res.statusText,
    ok: res.ok,
    body: await res.json()
  }
  // const r2 = showBody
  //   ? {
  //       ...r1,
  //       body: await res.json(),
  //     }
  //   : r1

  log('blue', 'logResponse', { source, response: r1, error: r1.body?.error  } )
}
