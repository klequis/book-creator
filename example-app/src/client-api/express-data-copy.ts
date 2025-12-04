// import { logFn } from "~/lib/utils";
import { logFn, log } from '~/utils'

const BASE_URL = 'http://localhost:4001'

const fullUrl = (path: string) => `${BASE_URL}${path}`

// Database operation types
export type DbOperation = 'get' | 'add' | 'update' | 'delete';

export default {
  get: (path: string) => _get(path),
  add: (path: string, data: object) => _add(path, data),
  update: <T extends { id: number }>(path: string, data: T) =>
    _update(path, data),
  delete: (path: string) => _delete(path),
}

function _fetchOptions(method: string, data?: any) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  }
}

//TODO implement getting by id here
//TODO  - path will be /item/ or /item/id
//TODO  - need to implement route for /item/id in server
async function _get(path: string): Promise<Response> {
  return await fetch(fullUrl(path), _fetchOptions('GET'))
}

async function _add<T>(path: string, data: T) {
  logFn('db', '_add')
  const urlFull = fullUrl(path)
  log('blue', '', { path, data, urlFull })
  const res = await fetch(urlFull, _fetchOptions('POST', data))
  return res
}

async function _update<T>(path: string, data: T) {
  logFn('db', '_update')
  const urlFull = fullUrl(path)
  log('blue', '', { path, data, urlFull })

  const res = await fetch(urlFull, _fetchOptions('PATCH', data))

  return res
}

async function _delete(path: string) {
  logFn('db', '_delete')
  const urlFull = fullUrl(path)
  log('blue', '', { path, urlFull })

  const res = await fetch(fullUrl(path), _fetchOptions('DELETE'))
  return res
}

// Path validation function
/**
 * @path The endpoint path, must begin with '/'.
 * @operation The operation to perform: 'get', 'add', 'update', 'delete'.
 * @description The server expects every operation other than 'get' to have an id.
 * For 'delete' the id is in the path.
 */
function _validatePath(path: string, operation?: DbOperation): void {
  // Check if it's a string
  if (typeof path !== 'string') {
    throw new Error(`Path must be a string, received: ${typeof path}`)
  }

  // Check if it begins with '/'
  if (!path.startsWith('/')) {
    throw new Error(`Path must begin with '/', received: ${path}`)
  }

  // Additional validation: check for empty path or just '/'
  if (path.length < 2) {
    throw new Error(`Path must be more than just '/', received: ${path}`)
  }

  // For delete operations, require the final segment to be a number

  if (operation === 'delete') {
    const pathSegments = path.split('/').filter((segment) => segment.length > 0)

    if (pathSegments.length === 0) {
      throw new Error(
        `Delete operation requires a path with segments, received: ${path}`
      )
    }

    const finalSegment = pathSegments[pathSegments.length - 1]

    // Check if final segment is a number (as string)
    if (!/^\d+$/.test(finalSegment)) {
      throw new Error(
        `Delete operation requires final segment to be a number, received: ${path}`
      )
    }
  }
}
