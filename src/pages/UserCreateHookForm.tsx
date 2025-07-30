import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../shared/api/axios'

const schema = yup.object({
  name: yup.string().required('Имя обязательно'),
  surName: yup.string().required('Фамилия обязательна'),
  fullName: yup.string().max(130).required('Полное имя обязательно'),
  email: yup.string().email('Неверный email').required('Email обязателен'),
  password: yup.string().required('Пароль обязателен').min(5, 'Минимум 5 символов'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли не совпадают')
    .required('Подтверждение обязательно'),
   birthDate: yup
    .date()
    .typeError('Неверный формат даты')
    .nullable()
    .transform((value, originalValue) => {
      if (!originalValue) return null
      const parsed = new Date(originalValue)
      return isNaN(parsed.getTime()) ? null : parsed
    }),
  telephone: yup
    .string()
    .matches(/^\+7\d{10}$/, 'Телефон должен быть в формате +79991234567')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  employment: yup
    .string()
    .required('Укажите занятость')
    .transform((value) => (value === '' ? null : value)),
  userAgreement: yup
    .boolean()
    .oneOf([true], 'Требуется согласие')
    .required('Требуется согласие'),
}).required()

type FormData = {
  name: string
  surName: string
  fullName: string
  email: string
  changePassword: boolean
  password?: string
  confirmPassword?: string
  birthDate?: Date | null
  telephone?: string | null
  employment: string
  userAgreement: boolean
}

const UserCreateHookForm = () => {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null) 

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
  })

  const name = watch('name')
  const surName = watch('surName')

  useEffect(() => {
    const fullName = `${name || ''} ${surName || ''}`.trim()
    setValue('fullName', fullName)
  }, [name, surName, setValue])

  const onSubmit = async (data: FormData) => {
    setServerError(null) 
    try {
      const { confirmPassword, ...payload } = data
      const cleanedPayload = Object.entries(payload).reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: value === null ? undefined : value
        }
      }, {})

      await axiosInstance.post('/v1/users', cleanedPayload)
      navigate('/')
    } catch (e: any) {
      if (e.response?.data?.message) {
        setServerError(e.response.data.message)
      } else {
        setServerError('Ошибка при создании пользователя')
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-4 mt-10"
    >
      <h2 className="text-2xl font-bold">Создание пользователя</h2>

      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {serverError}
        </div>
      )}

      <input placeholder="Имя" {...register('name')} className="input" />
      <p className="text-red-500 text-sm">{errors.name?.message}</p>

      <input placeholder="Фамилия" {...register('surName')} className="input" />
      <p className="text-red-500 text-sm">{errors.surName?.message}</p>

      <input placeholder="Полное имя" {...register('fullName')} className="input" />
      <p className="text-red-500 text-sm">{errors.fullName?.message}</p>

      <input placeholder="Email" {...register('email')} className="input" />
      <p className="text-red-500 text-sm">{errors.email?.message}</p>

      <input type="password" placeholder="Пароль" {...register('password')} className="input" />
      <p className="text-red-500 text-sm">{errors.password?.message}</p>

      <input type="password" placeholder="Подтвердите пароль" {...register('confirmPassword')} className="input" />
      <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>

      <input type="date" {...register('birthDate', { valueAsDate: true })} className="input" />
      <input placeholder="Телефон (+7...)" {...register('telephone')} className="input" />
      <p className="text-red-500 text-sm">{errors.telephone?.message}</p>

      <select {...register('employment')} className="input">
        <option value="">Выберите занятость</option>
        <option value="intern">Intern</option>
        <option value="fulltime">Fulltime</option>
        <option value="freelance">Freelance</option>
      </select>
      <p className="text-red-500 text-sm">{errors.employment?.message}</p>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('userAgreement')} />
        Я согласен с политикой
      </label>
      <p className="text-red-500 text-sm">{errors.userAgreement?.message}</p>

      <button type="submit" className="btn bg-blue-600 text-white px-4 py-2 rounded">
        Создать
      </button>
    </form>
  )
}

export default UserCreateHookForm