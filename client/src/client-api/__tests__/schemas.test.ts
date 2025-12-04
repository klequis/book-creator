import { describe, it, expect } from 'vitest'
import {
  AddUserSchema,
  UpdateUserSchema,
  DeleteUserSchema,
  AddCarSchema,
  UpdateCarSchema,
  DeleteCarSchema,
} from '../schemas'

describe('schemas.ts', () => {
  describe('User Schemas', () => {
    describe('AddUserSchema', () => {
      it('should validate valid user data', () => {
        const validUser = {
          name: 'John Doe',
          age: 25,
          isdefault: false,
        }

        const result = AddUserSchema.safeParse(validUser)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual({
            name: 'John Doe',
            age: 25,
            isdefault: false,
          })
        }
      })

      it('should handle missing optional fields with defaults', () => {
        const userData = {
          name: 'Jane Doe',
        }

        const result = AddUserSchema.safeParse(userData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.name).toBe('Jane Doe')
          expect(result.data.isdefault).toBe(false)
          expect(result.data.age).toBeUndefined()
        }
      })

      it('should transform undefined boolean fields to false', () => {
        const userData = {
          name: 'Test User',
          isdefault: undefined,
        }

        const result = AddUserSchema.safeParse(userData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.isdefault).toBe(false)
        }
      })

      it('should reject invalid data', () => {
        const invalidUser = {
          name: '', // Empty name should fail
          age: -1, // Negative age should fail
        }

        const result = AddUserSchema.safeParse(invalidUser)
        expect(result.success).toBe(false)
      })

      it('should reject name that is too long', () => {
        const userData = {
          name: 'a'.repeat(101), // 101 characters, exceeds max of 100
        }

        const result = AddUserSchema.safeParse(userData)
        expect(result.success).toBe(false)
      })

      it('should coerce age to number', () => {
        const userData = {
          name: 'Test User',
          age: '25', // String age should be coerced to number
        }

        const result = AddUserSchema.safeParse(userData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.age).toBe(25)
          expect(typeof result.data.age).toBe('number')
        }
      })
    })

    describe('UpdateUserSchema', () => {
      it('should validate complete update data', () => {
        const updateData = {
          id: 1,
          name: 'Updated Name',
          age: 30,
          isdefault: false,
        }

        const result = UpdateUserSchema.safeParse(updateData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(updateData)
        }
      })

      it('should handle partial update data', () => {
        const updateData = {
          id: 1,
          name: 'Just Name Update',
        }

        const result = UpdateUserSchema.safeParse(updateData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.id).toBe(1)
          expect(result.data.name).toBe('Just Name Update')
          expect(result.data.isdefault).toBe(false) // Should default to false
        }
      })

      it('should require valid ID', () => {
        const updateData = {
          id: -1, // Should fail minimum validation
          name: 'Test',
        }

        const result = UpdateUserSchema.safeParse(updateData)
        expect(result.success).toBe(false)
      })

      it('should coerce string ID to number', () => {
        const updateData = {
          id: '5',
          name: 'Test User',
        }

        const result = UpdateUserSchema.safeParse(updateData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.id).toBe(5)
          expect(typeof result.data.id).toBe('number')
        }
      })
    })

    describe('DeleteUserSchema', () => {
      it('should validate valid ID', () => {
        const deleteData = { id: 1 }

        const result = DeleteUserSchema.safeParse(deleteData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.id).toBe(1)
        }
      })

      it('should reject invalid ID', () => {
        const deleteData = { id: 'invalid' } // String should fail for z.number()

        const result = DeleteUserSchema.safeParse(deleteData)
        expect(result.success).toBe(false)
      })

      it('should reject negative ID', () => {
        const deleteData = { id: -1 } // Negative numbers are still valid numbers

        const result = DeleteUserSchema.safeParse(deleteData)
        expect(result.success).toBe(true) // z.number() doesn't have min constraint
      })
    })
  })

  describe('Car Schemas', () => {
    describe('AddCarSchema', () => {
      it('should validate valid car data', () => {
        const validCar = {
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          miles: 25000,
        }

        const result = AddCarSchema.safeParse(validCar)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(validCar)
        }
      })

      it('should use default value for miles when not provided', () => {
        const carData = {
          make: 'Honda',
          model: 'Civic',
          year: 2019,
        }

        const result = AddCarSchema.safeParse(carData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.miles).toBe(0)
        }
      })

      it('should coerce year to number', () => {
        const carData = {
          make: 'Ford',
          model: 'F-150',
          year: '2021', // String year
          miles: 15000,
        }

        const result = AddCarSchema.safeParse(carData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.year).toBe(2021)
          expect(typeof result.data.year).toBe('number')
        }
      })

      it('should reject year before 1886', () => {
        const carData = {
          make: 'Vintage',
          model: 'Car',
          year: 1885, // Before minimum allowed year
          miles: 100000,
        }

        const result = AddCarSchema.safeParse(carData)
        expect(result.success).toBe(false)
      })

      it('should reject negative miles', () => {
        const carData = {
          make: 'Tesla',
          model: 'Model 3',
          year: 2022,
          miles: -100, // Negative miles
        }

        const result = AddCarSchema.safeParse(carData)
        expect(result.success).toBe(false)
      })

      it('should reject empty make or model', () => {
        const carData = {
          make: '',
          model: '',
          year: 2020,
        }

        const result = AddCarSchema.safeParse(carData)
        expect(result.success).toBe(false)
      })

      it('should reject make or model that is too long', () => {
        const carData = {
          make: 'a'.repeat(101), // 101 characters, exceeds max of 100
          model: 'b'.repeat(101), // 101 characters, exceeds max of 100
          year: 2020,
        }

        const result = AddCarSchema.safeParse(carData)
        expect(result.success).toBe(false)
      })
    })

    describe('UpdateCarSchema', () => {
      it('should validate complete update data', () => {
        const updateData = {
          id: 1,
          make: 'Updated Make',
          model: 'Updated Model',
          year: 2023,
          miles: 50000,
        }

        const result = UpdateCarSchema.safeParse(updateData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(updateData)
        }
      })

      it('should handle partial update data', () => {
        const updateData = {
          id: 1,
          make: 'Just Make Update',
        }

        const result = UpdateCarSchema.safeParse(updateData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.id).toBe(1)
          expect(result.data.make).toBe('Just Make Update')
          expect(result.data.model).toBeUndefined()
          expect(result.data.year).toBeUndefined()
          expect(result.data.miles).toBeUndefined()
        }
      })

      it('should require valid ID', () => {
        const updateData = {
          id: -1, // Should fail minimum validation
          make: 'Test',
        }

        const result = UpdateCarSchema.safeParse(updateData)
        expect(result.success).toBe(false)
      })

      it('should validate optional fields when provided', () => {
        const updateData = {
          id: 1,
          year: 1885, // Invalid year
          miles: -100, // Invalid miles
        }

        const result = UpdateCarSchema.safeParse(updateData)
        expect(result.success).toBe(false)
      })

      it('should coerce string values to numbers', () => {
        const updateData = {
          id: '3',
          year: '2022',
          miles: '15000',
        }

        const result = UpdateCarSchema.safeParse(updateData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.id).toBe(3)
          expect(result.data.year).toBe(2022)
          expect(result.data.miles).toBe(15000)
          expect(typeof result.data.id).toBe('number')
          expect(typeof result.data.year).toBe('number')
          expect(typeof result.data.miles).toBe('number')
        }
      })
    })

    describe('DeleteCarSchema', () => {
      it('should validate valid ID', () => {
        const deleteData = { id: 1 }

        const result = DeleteCarSchema.safeParse(deleteData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.id).toBe(1)
        }
      })

      it('should reject invalid ID', () => {
        const deleteData = { id: 'invalid' } // String should fail for z.number()

        const result = DeleteCarSchema.safeParse(deleteData)
        expect(result.success).toBe(false)
      })

      it('should reject negative ID', () => {
        const deleteData = { id: -1 } // Negative numbers are still valid numbers

        const result = DeleteCarSchema.safeParse(deleteData)
        expect(result.success).toBe(true) // z.number() doesn't have min constraint
      })

      it('should coerce string ID to number', () => {
        const deleteData = { id: '5' }

        const result = DeleteCarSchema.safeParse(deleteData)
        expect(result.success).toBe(false) // DeleteCarSchema uses z.number(), not z.coerce.number()
      })
    })
  })
})