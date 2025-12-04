import { action, query, json, redirect } from '@solidjs/router'
import type { User, Car, QueryResponse, ActionResponse } from '~/types'
//* Note: getItems is plural and the others are singular
import { getItems, updateItem, addItem, deleteItem, resetItems } from './express-data'
import {
  AddUserSchema,
  UpdateUserSchema,
  DeleteUserSchema,
  AddCarSchema,
  UpdateCarSchema,
  DeleteCarSchema,
} from './schemas'
import { assertIsArray } from '~/utils/is-array.js'
                            //  src/utils/is-array.ts
import { wait } from '~/routes/wait'
import { logFn, log, logResponse } from '~/utils'

const modName = 'client api'

//*-------------------------
//* Cars API
//*-------------------------
export const getCars = query(
  //* to test catching errors throw from db.ts
  async (id?: string): Promise<QueryResponse<Car>> => {
    'use server'

    try {
      // throw new Error(`Test error from ${modName} | getUsers`)
      // await wait(1000)
      const path = id ? `/server/cars/${id}` : '/server/cars'

      const res: Response = await getItems(path)
      // const x = res.ok ? await res.json() as Car[] :
      if (!res.ok) {
        const jsonErr = await res.json()
        return {
          success: false,
          data: [] as Car[],
          error: jsonErr,
        }
      }
      const jsonData: Car[] = await res.json()
      assertIsArray('jsonData', jsonData)
      return { success: true, data: jsonData, error: null }
    } catch (e) {
      log('red', 'getCars|error:', e)
      return unknownError('Failed to get cars')
    }
  },
  'getCars'
)

export const addCar = action(
  async (formData: FormData): Promise<ActionResponse> => {
    'use server'

    // await wait(2000)
    logFn(modName, 'addCar')
    const newCarData = formDataToObject(formData)
    const validate = AddCarSchema.safeParse(newCarData)
    console.log('validation:', { newCarData, validate })
    if (!validate.success) {
      log('red', 'addUser|validation errors:', validate.error?.format())
      return {
        success: false,
        data: [],
        errors: 'Validation errors',
      }
    }
    const validatedCar = validate.data
    log('blue', 'newCarData:', { validatedCar })
    const res = await addItem(`/server/cars`, validatedCar)
    throw redirect('/cars')
  },
  'addCar'
)

export const updateCar = action(
  async (formData: FormData): Promise<ActionResponse> => {
    'use server'
    console.clear()
    const data = formDataToObject(formData)
    const validate = UpdateCarSchema.safeParse(data)
    if (!validate.success) {
      log('red', 'updateCar|validation errors:', validate.error?.format())
      return {
        success: false,
        data: [],
        errors: 'Validation errors',
      }
    }
    const { id, make, model, year, miles } = validate.data
    const newCarData = { id, make, model, year, miles } as Car
    const res = await updateItem(`/server/cars/${id}`, newCarData)
  },
  'updateCar'
)

export const deleteCar = action(async (id: number): Promise<ActionResponse> => {
  'use server'
  const validate = DeleteCarSchema.safeParse({ id })
  if (!validate.success) {
    log('red', 'deleteCar|validation errors:', validate.error?.format())
    return {
      success: false,
      data: [],
      errors: 'Validation errors',
    }
  }
  const res = await deleteItem(`/server/cars/${id}`)
}, 'deleteCar')


export const resetData = action(
  async (type: 'users' | 'cars'): Promise<ActionResponse> => {
    'use server'
    const res = await resetItems(`/server/${type}/reset`)
    if (!res.ok) {
      const jsonErr = await res.json()
      log('red', `resetData|server error:`, jsonErr)
      return {
        success: false,
        data: [],
        errors: jsonErr,
      }
    }
    return {
      success: true,
      data: [],
      errors: null,
    }
  },
  'resetData'
)

//*-------------------------
//* Users API
//*-------------------------

export const getUsers = query(
  //* to test catching errors throw from db.ts
  async (id?: string): Promise<QueryResponse<User>> => {
    'use server'

    try {
      // throw new Error(`Test error from ${modName} | getUsers`)
      // await wait(1000)
      const path = id ? `/server/users/${id}` : '/server/users'

      const res: Response = await getItems(path)

      if (!res.ok) {
        const jsonErr = await res.json()
        return {
          success: false,
          data: [] as User[],
          error: jsonErr,
        }
      }
      const jsonData: User[] = await res.json()
      assertIsArray('jsonData', jsonData)
      return { success: true, data: jsonData, error: null }
    } catch (e) {
      log('red', 'getUsers|error:', e)
      return unknownError('Failed to get users')
    }
  },
  'getUsers'
)

export const addUser = action(
  async (formData: FormData): Promise<ActionResponse> => {
    'use server'

    // await wait(2000)
    logFn(modName, 'addUser')
    const newUserData = formDataToObject(formData)
    log('blue', 'addUser|formDataToObject:', newUserData)
    const validate = AddUserSchema.safeParse(newUserData)
    console.log('validation:', { newUserData, validate })
    if (!validate.success) {
      log('red', 'addUser|validation errors:', validate.error.format())
      //? Does this cause `getUsers` to revalidate?
      //? Should it?
      //? If it does and shouldn't, would returning `json(false, {revalidate: "none"})` fix it?
      //? Great questions but ... it will also return <CustomResponse<ActionResponse>>
      //?   which is a moutful.
      return {
        success: false,
        data: [],
        errors: 'Validation errors',
        // errors: {
        //   errors: Object.entries(fieldErrors).map(([field, messages]) => ({
        //     field,
        //     message: messages ? messages.join(', ') : 'Invalid value',
        //   })),
        // },
      }
    }
    const validatedUser = validate.data
    log('blue', 'newUserData:', { validatedUser })
    const res = await addItem(`/server/users`, validatedUser)
    if (!res.ok) {
      const jsonErr = await res.json()
      log('red', 'addUser|server error:', jsonErr)
      return {
        success: false,
        data: [],
        errors: jsonErr,
      }
    }
    throw redirect('/users')
    // log('blue', 'addUser', { res })
  },
  'addUser'
)

export const addUserNoRedirect = action(
  async (formData: FormData): Promise<ActionResponse> => {
    'use server'
    // await wait(2000)
    logFn(modName, 'addUserNoRedirect')
    const newUserData = formDataToObject(formData)
    log('blue', 'addUserNoRedirect|formDataToObject:', newUserData)
    const validate = AddUserSchema.safeParse(newUserData)
    console.log('validation:', { newUserData, validate })
    if (!validate.success) {
      log(
        'red',
        'addUserNoRedirect|validation errors:',
        validate.error.format()
      )
      return {
        success: false,
        data: [],
        errors: 'Validation errors',
      }
    }
    const validatedUser = validate.data
    log('blue', 'newUserData:', { validatedUser })
    const res = await addItem(`/server/users`, validatedUser)
    if (!res.ok) {
      const jsonErr = await res.json()
      log('red', 'addUserNoRedirect|server error:', jsonErr)
      return {
        success: false,
        data: [],
        errors: jsonErr,
      }
    }

    // Get the created user data from the response
    const createdUser = await res.json()
    log('blue', 'addUserNoRedirect|success:', { createdUser })

    return {
      success: true,
      data: createdUser,
      errors: null,
    }
  },
  'addUserNoRedirect'
)

export const addUserThrowNoRedirect = action(
  async (formData: FormData): Promise<ActionResponse> => {
    'use server'
    // await wait(2000)
    logFn(modName, 'addUserNoRedirect')
    log('blue', "I'm gonna throw")
    throw new Error('Test error from addUserNoRedirect')
    log('blue', "I threw")
    const newUserData = formDataToObject(formData)
    log('blue', 'addUserNoRedirect|formDataToObject:', newUserData)
    const validate = AddUserSchema.safeParse(newUserData)
    console.log('validation:', { newUserData, validate })
    if (!validate.success) {
      log(
        'red',
        'addUserNoRedirect|validation errors:',
        validate.error?.format()
      )
      return {
        success: false,
        data: [],
        errors: 'Validation errors',
      }
    }
    const validatedUser = validate.data
    log('blue', 'newUserData:', { validatedUser })
    const res = await addItem(`/server/users`, validatedUser)
    if (!res.ok) {
      const jsonErr = await res.json()
      log('red', 'addUserNoRedirect|server error:', jsonErr)
      return {
        success: false,
        data: [],
        errors: jsonErr,
      }
    }

    // Get the created user data from the response
    const createdUser = await res.json()
    log('blue', 'addUserNoRedirect|success:', { createdUser })

    return {
      success: true,
      data: createdUser,
      errors: null,
    }
  },
  'addUserNoRedirect'
)

export const actionThrow = query(
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
      throw e
    }
  },
  'throwQueryTryCatchReturn'
)

/**
 * Action that simulates throwing an error from an action.
 * This is used in the example for submission.error.
 */
export const addUserThrow = action(
  async (formData: FormData): Promise<ActionResponse> => {
    'use server'
    throw new Error('Test error thrown from addUserThrow action')
    try {
      // await wait(2000)
      logFn(modName, 'addUserNoRedirect')
      // throw new Error('Test error thrown from addUserThrow action')
    } catch (e: unknown) {
      log('red', 'addUserThrow|error:', e)
      const errorMessage = e instanceof Error ? (e as Error).message : 'Unknown error'
      const err = JSON.stringify({
        success: false,
        data: [],
        errors: errorMessage,
      })
      throw new Error(err)
    }
  },
  'addUserNoRedirect'
)

export const updateUser = action(
  async (formData: FormData): Promise<ActionResponse> => {
    'use server'
    // logFn(modName, 'updateUser')
    console.clear()
    const updateData = formDataToObject(formData)
    const validate = UpdateUserSchema.safeParse(updateData)
    log('blue', 'updateUser|validate:', validate)
    if (!validate.success) {
      log('red', 'updateUser|validation errors:', validate.error.format())
      return {
        success: false,
        data: [],
        errors: 'Validation errors',
        // errors: {
        //   errors: Object.entries(fieldErrors).map(([field, messages]) => ({
        //     field,
        //     message: messages ? messages.join(', ') : 'Invalid value',
        //   })),
        // },
      }
    }
    const { id, name, age, isdefault } = validate.data
    log('red', 'HERE')
    //TODO: get rid of this step
    const newUserData = { id, name, age, isdefault } as User
    // log('blue', 'updateUser:', { newUserData })
    const res = await updateItem(`/server/users/${id}`, updateData)
    if (!res.ok) {
      const jsonErr = await res.json()
      log('red', 'addUser|server error:', jsonErr)
      return {
        success: false,
        data: [],
        errors: jsonErr,
      }
    }
    throw redirect('/users')

    // log('blue', 'updateUser|res:', res)
  },
  'updateUser'
)

export const deleteUser = action(
  async (id: number): Promise<ActionResponse> => {
    'use server'
    // logFn(modName, 'deleteUser')
    await wait(3000)
    const validate = DeleteUserSchema.safeParse({ id })
    // log('blue', 'deleteUser|validate:', validate)
    if (!validate.success) {
      log('red', 'deleteUser|validation errors:', validate.error.format())
      return {
        success: false,
        data: [],
        errors: 'Validation errors',
      }
    }
    const res = await deleteItem(`/server/users/${id}`)
    // log('blue', 'deleteUser|res:', res)
  },
  'deleteUser'
)

//*-------------------------
//* UTILITY
//*-------------------------

function formDataToObject(formData: FormData): Record<string, any> {
  const obj: Record<string, any> = {}
  formData.forEach((value, key) => {
    obj[key] = value
  })
  return obj
}

function unknownError<T>(details: string): QueryResponse<T> {
  return {
    success: false,
    data: [] as T[],
    error: { message: `UNKNOWN_ERROR: ${modName} | ${details}` },
  }
}
