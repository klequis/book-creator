import * as z from 'zod'

// https://zod.dev/api?id=prefaults

// Full schema with required ID (for existing users)
export const UserSchema = z.object({
  id: z.coerce.number().min(1),
  name: z.string().min(1).max(100),
  age: z.coerce.number().min(0).optional(),
  isdefault: z.coerce.boolean(),
})

export type User = z.infer<typeof UserSchema>

export type QueryResponse<T> = {
  success: boolean
  data: T[]
  error: { message: string; tip?: string } | null
}

export type ActionResponse = {
  success: boolean
  data: []
  errors: any
} | void

export const CarsSchema = z.object({
  id: z.coerce.number().min(1),
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.coerce.number().min(1886),
  miles: z.coerce.number().min(0),
})

export type Car = z.infer<typeof CarsSchema>

export type DataCollections = 'users' | 'cars'