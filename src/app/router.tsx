import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import MainPage from '../pages/MainPAge'
import UserCreateHookForm from '../pages/UserCreateHookForm'
import UserEditPage from '../pages/UserEditPage'
import Layout from '../shared/ui/Layout'
import ProtectedRoute from '../shared/components/ProtectedRoute'

export const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    
    <Route
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route path="/" element={<MainPage />} />
      <Route path="/user/create" element={<UserCreateHookForm />} />
      <Route path="/user/edit/:id/" element={<UserEditPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
)
