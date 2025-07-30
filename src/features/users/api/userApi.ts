import { axiosInstance } from '../../../shared/api/axios'
import type { User } from '../../../entities/User'

export const usersApi = {
  async getUsers(): Promise<User[]> {
    const response = await axiosInstance.get('/v1/users')
    return response.data
  },
   async deleteUser(id: string): Promise<void> {
    await axiosInstance.delete(`/v1/users/${id}`)
  },
}