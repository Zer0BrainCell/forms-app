import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../lib/hooks'
import { logout } from '../../features/auth/model/authSlice'

const Layout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-200 p-4 overflow-y-auto shadow-md md:shadow-none">
        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink 
                to="/" className={({ isActive }) => `block p-2 rounded transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white font-medium' : 'hover:bg-gray-300'}`}>Главная
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/user/create" 
                className={({ isActive }) => `block p-2 rounded transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white font-medium' : 'hover:bg-gray-300'}`}>Создать пользователя
              </NavLink>
            </li>
            <li>
             <button onClick={handleLogout} className="block w-full p-2 rounded transition-colors duration-200 hover:bg-gray-300 text-left">Выйти</button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4 sm:p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout