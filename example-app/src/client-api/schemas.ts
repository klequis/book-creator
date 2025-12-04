import * as z from "zod";


// Base schema without ID (for creating new users)
export const AddUserSchema = z.object({
  name: z.string().min(1).max(100),
  age: z.coerce.number().min(0).optional(),
  isdefault: z.union([z.boolean(), z.undefined()]).transform(v => v === undefined ? false : v),
});

// Update schema with optional ID (for partial updates)
export const UpdateUserSchema = z.object({
  id: z.coerce.number().min(0),
  name: z.string(),
  age: z.coerce.number().min(0).optional(),
  isdefault: z.union([z.boolean(), z.undefined()]).transform(v => v === undefined ? false : v)
});

export const DeleteUserSchema = z.object({
  id: z.number(),
});

// Car schemas
export const AddCarSchema = z.object({
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.coerce.number().min(1886),
  miles: z.coerce.number().min(0).default(0),
});

export const UpdateCarSchema = z.object({
  id: z.coerce.number().min(0),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce.number().min(1886).optional(),
  miles: z.coerce.number().min(0).optional(),
});

export const DeleteCarSchema = z.object({
  id: z.number(),
});

// export type CreateUser = z.infer<typeof AddUserSchema>;
// export type UpdateUser = z.infer<typeof UpdateUserSchema>;
// export type CreateCar = z.infer<typeof AddCarSchema>;
// export type UpdateCar = z.infer<typeof UpdateCarSchema>;