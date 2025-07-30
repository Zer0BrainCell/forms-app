import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../../shared/lib/hooks'
import { login } from '../model/authSlice'
import { Navigate } from 'react-router-dom'

export const LoginForm = () => {
  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm()
  const { loading, error, user } = useAppSelector(state => state.auth)

  const onSubmit = (data: any) => {
    dispatch(login(data))
  }

  if (user) return <Navigate to="/" replace />

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-10">
      <h2 className="text-xl mb-4">Вход</h2>
      <input {...register('email')} placeholder="Email" className="input mb-2" />
      <input {...register('password')} type="password" placeholder="Пароль" className="input mb-2" />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={loading} className="btn">
        {loading ? 'Загрузка...' : 'Войти'}
      </button>
    </form>
  )
}