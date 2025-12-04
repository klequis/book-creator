import type { User, QueryResponse, ActionResponse } from '~/types'
import { action, query, json, redirect } from '@solidjs/router'
import { logFn, log } from '~/utils'
//* Note: getItems is plural and the others are singular

const modName = 'client api'

//*-------------------------
//* Users API
//*-------------------------

export const throwQuery = query(
  //* to test catching errors throw from db.ts
  async (id?: string): Promise<QueryResponse<User>> => {
    'use server'
    const fnName = 'throwQuery'
    logFn(modName, fnName)
    log('blue', `throwing error from ${fnName}`)
    throw new Error(`Test error thrown from ${fnName}`)
  },
  'throwQuery'
)

export const throwQueryTryCatchRethrow = query(
  //* to test catching errors throw from db.ts
  async (id?: string): Promise<QueryResponse<User>> => {
    'use server'
    const fnName = 'throwQueryTryCatchRethrow'
    logFn(modName, fnName)
    log('blue', `throwing error from ${fnName}`)

    try {
      throw new Error(`Test error thrown from ${fnName}`)
    } catch (e: unknown) {
      throw new Error(`Test error rethrown from ${fnName}`)
    }
  },
  'throwQueryTryCatchRethrow'
)

export const throwQueryTryCatchReturn = query(
  //* to test catching errors throw from db.ts
  async (id?: string): Promise<QueryResponse<User>> => {
    'use server'
    const fnName = 'throwQueryTryCatchReturn'
    logFn(modName, fnName)
    log('blue', `throwing error from ${fnName}`)

    try {
      throw new Error(`Test error thrown from ${fnName}`)
    } catch (e) {
      log('red', 'getUsers|error:', e)
      return {
        success: false,
        data: [] as User[],
        error: { message: e instanceof Error ? e.message : 'Unknown error' },
      }
    }
  },
  'throwQueryTryCatchReturn'
)

export const throwActon = action(
  async (formData: FormData): Promise<ActionResponse> => {
    'use server'
    const fnName = 'throwActon'
    logFn(modName, fnName)
    log('blue', `throwing error from ${fnName}`)
    throw new Error(`Test error thrown from ${fnName}`)
  },
  'throwActon'
)

export const actionTryThrowCatchRethrow = action(
  async (formData: FormData): Promise<ActionResponse> => {
    'use server'
    const fnName = 'throwActonTryCatchRethrow'

    try {
      logFn(modName, fnName)
      log('blue', `throwing error from ${fnName}`)
      //! throw
      throw new Error(`Test error thrown from ${fnName}`)
    } catch (e) {
      // log('red', 'addUser|error:', e)
      if (e instanceof Error) {
        throw new Error(`error: ${fnName}: ${e.message}`)
      } else {
        throw new Error(`Test error thrown from ${fnName}`)
        // throw new Error(`Unknown error thrown from ${fnName}`)
      }
      //
      
    }
  },
  'throwActonTryCatchRethrow'
)

export const throwActonTryCatchReturn = action(
  async (formData: FormData): Promise<ActionResponse> => {
    'use server'
    const fnName = 'throwActonTryCatchReturn'
    try {
      logFn(modName, fnName)
      log('blue', `throwing error from ${fnName}`)
      throw new Error(`Test error thrown from ${fnName}`)
    } catch (e) {
      return {
        success: false,
        data: [],
        errors: `Failed to add user in ${fnName}`,
      }
    }
  },
  'throwActonTryCatchReturn'
)
