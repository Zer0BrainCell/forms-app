import { useAppDispatch, useAppSelector } from '../../../shared/lib/hooks'
import { useEffect } from 'react'
import { fetchUsers, deleteUser } from '../model/userSlice'
import { NavLink } from 'react-router-dom'

export const UserTable = () => {
  const dispatch = useAppDispatch()
  const { users, loading, error } = useAppSelector(state => state.users)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleDelete = (id: string) => {
    if (confirm('Удалить пользователя?')) {
      dispatch(deleteUser(id))
    }
  }

  if (loading) return <p>Загрузка пользователей...</p>
  if (error) return <p className="text-red-500">Ошибка: {error}</p>

  return (
<div className="w-full overflow-x-auto">
  <table className="min-w-full table-auto border">
    <thead>
      <tr className="bg-gray-200">
        <th className="border p-2 min-w-[60px]">ID</th>
        <th className="border p-2 min-w-[200px]">Email</th>
        <th className="border p-2 min-w-[120px]">Имя</th>
        <th className="border p-2 min-w-[120px]">Фамилия</th>
        <th className="border p-2 min-w-[150px]">Действия</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user.id} className="hover:bg-gray-50">
          <td className="border p-2 text-center min-w-[60px]">{user.id}</td>
          <td className="border p-2 min-w-[200px] break-words">{user.email}</td>
          <td className="border p-2 min-w-[120px]">{user.name}</td>
          <td className="border p-2 min-w-[120px]">{user.surName}</td>
          <td className="border p-2 min-w-[150px] whitespace-nowrap">
            <button className="text-blue-600 mr-2 hover:underline">
              <NavLink to={`/user/edit/${user.id}/`}>Редактировать</NavLink>
            </button>
            <button
              onClick={() => handleDelete(user.id)}
              className="text-red-600 cursor-pointer hover:underline"
            >
              Удалить
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  )
}
