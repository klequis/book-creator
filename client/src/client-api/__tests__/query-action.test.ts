import { describe, it, expect, vi, beforeEach, MockedFunction } from 'vitest'
import type { User, Car, QueryResponse, ActionResponse } from '~/types'
import {
  getCars,
  addCar,
  updateCar,
  deleteCar,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from '../query-action'

// Mock all dependencies
vi.mock('@solidjs/router', () => ({
  action: vi.fn((fn, name) => fn),
  query: vi.fn((fn, name) => fn),
  json: vi.fn(),
  redirect: vi.fn(),
}))

vi.mock('../express-data', () => ({
  getItems: vi.fn(),
  updateItem: vi.fn(),
  addItem: vi.fn(),
  deleteItem: vi.fn(),
}))

vi.mock('../schemas', () => ({
  AddUserSchema: {
    safeParse: vi.fn(),
  },
  UpdateUserSchema: {
    safeParse: vi.fn(),
  },
  DeleteUserSchema: {
    safeParse: vi.fn(),
  },
  AddCarSchema: {
    safeParse: vi.fn(),
  },
  UpdateCarSchema: {
    safeParse: vi.fn(),
  },
  DeleteCarSchema: {
    safeParse: vi.fn(),
  },
}))

vi.mock('~/utils/is-array', () => ({
  assertIsArray: vi.fn((name: string, value: any) => {
    // Mock implementation that mimics the real behavior for tests
    if (!Array.isArray(value)) {
      throw new Error(`${name} is not an array`)
    }
  }),
}))

vi.mock('~/routes/wait', () => ({
  wait: vi.fn(() => Promise.resolve()),
}))

vi.mock('~/utils', () => ({
  logFn: vi.fn(),
  log: vi.fn(),
  logResponse: vi.fn(),
}))

// Import mocks
import { getItems, updateItem, addItem, deleteItem } from '../express-data'
import {
  AddUserSchema,
  UpdateUserSchema,
  DeleteUserSchema,
  AddCarSchema,
  UpdateCarSchema,
  DeleteCarSchema,
} from '../schemas'
import { assertIsArray } from '~/utils/is-array'
import { wait } from '~/routes/wait'
import { redirect } from '@solidjs/router'

const mockGetItems = getItems as MockedFunction<typeof getItems>
const mockUpdateItem = updateItem as MockedFunction<typeof updateItem>
const mockAddItem = addItem as MockedFunction<typeof addItem>
const mockDeleteItem = deleteItem as MockedFunction<typeof deleteItem>
const mockRedirect = redirect as MockedFunction<typeof redirect>

describe('query-action.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear console.log and console.clear mocks
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'clear').mockImplementation(() => {})
  })

  describe('Cars API', () => {
    describe('getCars', () => {
      it('should return successful response for all cars', async () => {
        const mockCars: Car[] = [
          { id: 1, make: 'Toyota', model: 'Camry', year: 2020, miles: 25000 },
          { id: 2, make: 'Honda', model: 'Civic', year: 2019, miles: 35000 },
        ]

        const mockResponse = {
          ok: true,
          json: () => Promise.resolve(mockCars),
        } as Response

        mockGetItems.mockResolvedValue(mockResponse)

        const result = await getCars()

        expect(mockGetItems).toHaveBeenCalledWith('/server/cars')
        expect(assertIsArray).toHaveBeenCalledWith('jsonData', mockCars)
        expect(result).toEqual({
          success: true,
          data: mockCars,
          error: null,
        })
      })

      it('should return successful response for single car by id', async () => {
        const mockCar: Car[] = [
          { id: 1, make: 'Toyota', model: 'Camry', year: 2020, miles: 25000 },
        ]

        const mockResponse = {
          ok: true,
          json: () => Promise.resolve(mockCar),
        } as Response

        mockGetItems.mockResolvedValue(mockResponse)

        const result = await getCars('1')

        expect(mockGetItems).toHaveBeenCalledWith('/server/cars/1')
        expect(assertIsArray).toHaveBeenCalledWith('jsonData', mockCar)
        expect(result).toEqual({
          success: true,
          data: mockCar,
          error: null,
        })
      })

      it('should handle server error response', async () => {
        const errorResponse = { message: 'Server error', details: 'Internal error' }
        const mockResponse = {
          ok: false,
          json: () => Promise.resolve(errorResponse),
        } as Response

        mockGetItems.mockResolvedValue(mockResponse)

        const result = await getCars()

        expect(result).toEqual({
          success: false,
          data: [],
          error: errorResponse,
        })
      })

      it('should handle network/unexpected errors', async () => {
        mockGetItems.mockRejectedValue(new Error('Network error'))

        const result = await getCars()

        expect(result).toEqual({
          success: false,
          data: [],
          error: { message: 'UNKNOWN_ERROR: client api | Failed to get cars' },
        })
      })
    })

    describe('addCar', () => {
      it('should add car successfully with valid data', async () => {
        const formData = new FormData()
        formData.append('make', 'Tesla')
        formData.append('model', 'Model 3')
        formData.append('year', '2023')
        formData.append('miles', '1000')

        const validatedCar = { make: 'Tesla', model: 'Model 3', year: 2023, miles: 1000 }
        
        vi.mocked(AddCarSchema.safeParse).mockReturnValue({
          success: true,
          data: validatedCar,
        })

        const mockResponse = { ok: true } as Response
        mockAddItem.mockResolvedValue(mockResponse)
        mockRedirect.mockImplementation(() => {
          throw new Error('redirect') // Simulate redirect throw
        })

        await expect(addCar(formData)).rejects.toThrow('redirect')

        expect(AddCarSchema.safeParse).toHaveBeenCalledWith({
          make: 'Tesla',
          model: 'Model 3',
          year: '2023',
          miles: '1000',
        })
        expect(mockAddItem).toHaveBeenCalledWith('/server/cars', validatedCar)
        expect(wait).toHaveBeenCalledWith(2000)
      })

      it('should return validation error for invalid data', async () => {
        const formData = new FormData()
        formData.append('make', '')
        formData.append('model', '')

        vi.mocked(AddCarSchema.safeParse).mockReturnValue({
          success: false,
          error: {
            format: () => ({ 
              make: { _errors: ['Required'] }, 
              model: { _errors: ['Required'] } 
            }),
          },
        } as any)

        const result = await addCar(formData)

        expect(result).toEqual({
          success: false,
          data: [],
          errors: 'Validation errors',
        })
        expect(mockAddItem).not.toHaveBeenCalled()
      })
    })

    describe('updateCar', () => {
      it('should update car successfully with valid data', async () => {
        const formData = new FormData()
        formData.append('id', '1')
        formData.append('make', 'Tesla')
        formData.append('model', 'Model S')
        formData.append('year', '2024')
        formData.append('miles', '2000')

        const validatedData = {
          id: 1,
          make: 'Tesla',
          model: 'Model S',
          year: 2024,
          miles: 2000,
        }

        vi.mocked(UpdateCarSchema.safeParse).mockReturnValue({
          success: true,
          data: validatedData,
        })

        const mockResponse = { ok: true } as Response
        mockUpdateItem.mockResolvedValue(mockResponse)

        const result = await updateCar(formData)

        expect(UpdateCarSchema.safeParse).toHaveBeenCalledWith({
          id: '1',
          make: 'Tesla',
          model: 'Model S',
          year: '2024',
          miles: '2000',
        })
        expect(mockUpdateItem).toHaveBeenCalledWith('/server/cars/1', validatedData)
      })

      it('should return validation error for invalid update data', async () => {
        const formData = new FormData()
        formData.append('id', 'invalid')

        vi.mocked(UpdateCarSchema.safeParse).mockReturnValue({
          success: false,
          error: {
            format: () => ({ id: { _errors: ['Invalid number'] } }),
          },
        } as any)

        const result = await updateCar(formData)

        expect(result).toEqual({
          success: false,
          data: [],
          errors: 'Validation errors',
        })
        expect(mockUpdateItem).not.toHaveBeenCalled()
      })
    })

    describe('deleteCar', () => {
      it('should delete car successfully with valid id', async () => {
        vi.mocked(DeleteCarSchema.safeParse).mockReturnValue({
          success: true,
          data: { id: 1 },
        })

        const mockResponse = { ok: true } as Response
        mockDeleteItem.mockResolvedValue(mockResponse)

        const result = await deleteCar(1)

        expect(DeleteCarSchema.safeParse).toHaveBeenCalledWith({ id: 1 })
        expect(mockDeleteItem).toHaveBeenCalledWith('/server/cars/1')
      })

      it('should return validation error for invalid id', async () => {
        vi.mocked(DeleteCarSchema.safeParse).mockReturnValue({
          success: false,
          error: {
            format: () => ({ id: { _errors: ['Invalid number'] } }),
          },
        } as any)

        const result = await deleteCar(-1)

        expect(result).toEqual({
          success: false,
          data: [],
          errors: 'Validation errors',
        })
        expect(mockDeleteItem).not.toHaveBeenCalled()
      })
    })
  })

  describe('Users API', () => {
    describe('getUsers', () => {
      it('should return successful response for all users', async () => {
        const mockUsers: User[] = [
          { id: 1, name: 'John Doe', age: 25, isdefault: false },
          { id: 2, name: 'Jane Smith', age: 30, isdefault: false },
        ]

        const mockResponse = {
          ok: true,
          json: () => Promise.resolve(mockUsers),
        } as Response

        mockGetItems.mockResolvedValue(mockResponse)

        const result = await getUsers()

        expect(mockGetItems).toHaveBeenCalledWith('/server/users')
        expect(wait).toHaveBeenCalledWith(1000)
        expect(assertIsArray).toHaveBeenCalledWith('jsonData', mockUsers)
        expect(result).toEqual({
          success: true,
          data: mockUsers,
          error: null,
        })
      })

      it('should return successful response for single user by id', async () => {
        const mockUser: User[] = [
          { id: 1, name: 'John Doe', age: 25, isdefault: false },
        ]

        const mockResponse = {
          ok: true,
          json: () => Promise.resolve(mockUser),
        } as Response

        mockGetItems.mockResolvedValue(mockResponse)

        const result = await getUsers('1')

        expect(mockGetItems).toHaveBeenCalledWith('/server/users/1')
        expect(assertIsArray).toHaveBeenCalledWith('jsonData', mockUser)
        expect(result).toEqual({
          success: true,
          data: mockUser,
          error: null,
        })
      })

      it('should handle server error response', async () => {
        const errorResponse = { message: 'User not found' }
        const mockResponse = {
          ok: false,
          json: () => Promise.resolve(errorResponse),
        } as Response

        mockGetItems.mockResolvedValue(mockResponse)

        const result = await getUsers('999')

        expect(result).toEqual({
          success: false,
          data: [],
          error: errorResponse,
        })
      })

      it('should handle network/unexpected errors', async () => {
        mockGetItems.mockRejectedValue(new Error('Database connection failed'))

        const result = await getUsers()

        expect(result).toEqual({
          success: false,
          data: [],
          error: { message: 'UNKNOWN_ERROR: client api | Failed to get users' },
        })
      })
    })

    describe('addUser', () => {
      it('should add user successfully with valid data', async () => {
        const formData = new FormData()
        formData.append('name', 'Bob Johnson')
        formData.append('age', '35')
        formData.append('isdefault', 'false')

        const validatedUser = {
          name: 'Bob Johnson',
          age: 35,
          isdefault: false,
        }

        vi.mocked(AddUserSchema.safeParse).mockReturnValue({
          success: true,
          data: validatedUser,
        })

        const mockResponse = { ok: true } as Response
        mockAddItem.mockResolvedValue(mockResponse)
        mockRedirect.mockImplementation(() => {
          throw new Error('redirect') // Simulate redirect throw
        })

        await expect(addUser(formData)).rejects.toThrow('redirect')

        expect(AddUserSchema.safeParse).toHaveBeenCalledWith({
          name: 'Bob Johnson',
          age: '35',
          isdefault: 'false',
        })
        expect(mockAddItem).toHaveBeenCalledWith('/server/users', validatedUser)
        expect(wait).toHaveBeenCalledWith(2000)
      })

      it('should return validation error for invalid data', async () => {
        const formData = new FormData()
        formData.append('name', '')

        vi.mocked(AddUserSchema.safeParse).mockReturnValue({
          success: false,
          error: {
            format: () => ({ name: { _errors: ['Required'] } }),
          },
        } as any)

        const result = await addUser(formData)

        expect(result).toEqual({
          success: false,
          data: [],
          errors: 'Validation errors',
        })
        expect(mockAddItem).not.toHaveBeenCalled()
      })

      it('should handle server error during user creation', async () => {
        const formData = new FormData()
        formData.append('name', 'Test User')

        const validatedUser = { name: 'Test User', isdefault: false }

        vi.mocked(AddUserSchema.safeParse).mockReturnValue({
          success: true,
          data: validatedUser,
        })

        const errorResponse = { message: 'Database error' }
        const mockResponse = {
          ok: false,
          json: () => Promise.resolve(errorResponse),
        } as Response
        mockAddItem.mockResolvedValue(mockResponse)

        const result = await addUser(formData)

        expect(result).toEqual({
          success: false,
          data: [],
          errors: errorResponse,
        })
      })
    })

    describe('updateUser', () => {
      it('should update user successfully with valid data', async () => {
        const formData = new FormData()
        formData.append('id', '1')
        formData.append('name', 'Updated Name')
        formData.append('age', '40')
        formData.append('isdefault', 'true')

        const validatedData = {
          id: 1,
          name: 'Updated Name',
          age: 40,
          isdefault: true,
        }

        vi.mocked(UpdateUserSchema.safeParse).mockReturnValue({
          success: true,
          data: validatedData,
        })

        const mockResponse = { ok: true } as Response
        mockUpdateItem.mockResolvedValue(mockResponse)
        mockRedirect.mockImplementation(() => {
          throw new Error('redirect') // Simulate redirect throw
        })

        await expect(updateUser(formData)).rejects.toThrow('redirect')

        expect(UpdateUserSchema.safeParse).toHaveBeenCalledWith({
          id: '1',
          name: 'Updated Name',
          age: '40',
          isdefault: 'true',
        })
        expect(mockUpdateItem).toHaveBeenCalledWith('/server/users/1', {
          id: '1',
          name: 'Updated Name',
          age: '40',
          isdefault: 'true',
        })
      })

      it('should return validation error for invalid update data', async () => {
        const formData = new FormData()
        formData.append('id', 'invalid')
        formData.append('name', '')

        vi.mocked(UpdateUserSchema.safeParse).mockReturnValue({
          success: false,
          error: {
            format: () => ({ 
              id: { _errors: ['Invalid number'] }, 
              name: { _errors: ['Required'] } 
            }),
          },
        } as any)

        const result = await updateUser(formData)

        expect(result).toEqual({
          success: false,
          data: [],
          errors: 'Validation errors',
        })
        expect(mockUpdateItem).not.toHaveBeenCalled()
      })

      it('should handle server error during user update', async () => {
        const formData = new FormData()
        formData.append('id', '1')
        formData.append('name', 'Test')

        const validatedData = {
          id: 1,
          name: 'Test',
          isdefault: false,
        }

        vi.mocked(UpdateUserSchema.safeParse).mockReturnValue({
          success: true,
          data: validatedData,
        })

        const errorResponse = { message: 'User not found' }
        const mockResponse = {
          ok: false,
          json: () => Promise.resolve(errorResponse),
        } as Response
        mockUpdateItem.mockResolvedValue(mockResponse)

        const result = await updateUser(formData)

        expect(result).toEqual({
          success: false,
          data: [],
          errors: errorResponse,
        })
      })
    })

    describe('deleteUser', () => {
      it('should delete user successfully with valid id', async () => {
        vi.mocked(DeleteUserSchema.safeParse).mockReturnValue({
          success: true,
          data: { id: 1 },
        })

        const mockResponse = { ok: true } as Response
        mockDeleteItem.mockResolvedValue(mockResponse)

        const result = await deleteUser(1)

        expect(DeleteUserSchema.safeParse).toHaveBeenCalledWith({ id: 1 })
        expect(mockDeleteItem).toHaveBeenCalledWith('/server/users/1')
      })

      it('should return validation error for invalid id', async () => {
        vi.mocked(DeleteUserSchema.safeParse).mockReturnValue({
          success: false,
          error: {
            format: () => ({ id: { _errors: ['Invalid number'] } }),
          },
        } as any)

        const result = await deleteUser(-1)

        expect(result).toEqual({
          success: false,
          data: [],
          errors: 'Validation errors',
        })
        expect(mockDeleteItem).not.toHaveBeenCalled()
      })
    })
  })

  describe('Utility Functions', () => {
    describe('formDataToObject', () => {
      it('should convert FormData to plain object', async () => {
        const formData = new FormData()
        formData.append('name', 'Test')
        formData.append('age', '25')

        // Test through addUser to verify formDataToObject works
        vi.mocked(AddUserSchema.safeParse).mockReturnValue({
          success: true,
          data: { name: 'Test', age: 25, isdefault: false },
        })

        const mockResponse = { ok: true } as Response
        mockAddItem.mockResolvedValue(mockResponse)
        mockRedirect.mockImplementation(() => {
          throw new Error('redirect') // Simulate redirect throw
        })

        await expect(addUser(formData)).rejects.toThrow('redirect')

        expect(AddUserSchema.safeParse).toHaveBeenCalledWith({
          name: 'Test',
          age: '25',
        })
      })
    })

    describe('unknownError', () => {
      it('should format unknown errors correctly', async () => {
        mockGetItems.mockRejectedValue(new Error('Unexpected error'))

        const result = await getUsers()

        expect(result).toEqual({
          success: false,
          data: [],
          error: { message: 'UNKNOWN_ERROR: client api | Failed to get users' },
        })
      })
    })
  })
})