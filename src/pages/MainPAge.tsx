import { UserTable } from '../features/users/ui/UserTable'

const MainPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Пользователи</h1>
      <UserTable />
    </div>
  )
}

export default MainPage