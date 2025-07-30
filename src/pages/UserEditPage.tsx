import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../shared/api/axios'
import { DateInput } from '../shared/components/DateInput'
const schema = yup.object({
  name: yup.string().required('Имя обязательно'),
  surName: yup.string().required('Фамилия обязательна'),
  fullName: yup.string().max(130).required('Полное имя обязательно'),
  email: yup.string(),
  changePassword: yup.boolean(),
  password: yup
    .string()
    .when('changePassword', {
      is: true,
      then: (schema) => schema.required('Пароль обязателен').min(5, 'Минимум 5 символов'),
      otherwise: (schema) => schema.notRequired(),
    }),
  confirmPassword: yup
    .string()
    .when('changePassword', {
      is: true,
      then: (schema) => 
        schema
          .oneOf([yup.ref('password')], 'Пароли не совпадают')
          .required('Подтверждение обязательно'),
      otherwise: (schema) => schema.notRequired(),
    }),
   birthDate: yup
  .mixed()
  .test('is-date', 'Неверный формат даты', (value) => {
    if (!value) return true;
    if (value instanceof Date && !isNaN(value.getTime())) {
      return true;
    }
    if (typeof value === 'string') {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }
    return false;
  })
  .transform((value, originalValue) => {
    if (!originalValue) return null;
    if (typeof originalValue === 'string') {
      const date = new Date(originalValue);
      return isNaN(date.getTime()) ? null : date;
    }
    return value instanceof Date ? value : null;
  })
  .nullable(),
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

const UserEditPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      changePassword: false,
    }
  })

  const name = watch('name')
  const surName = watch('surName')
  const changePassword = watch('changePassword')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/v1/users/${id}`)
        const userData = response.data

        reset({
          name: userData.name || '',
          surName: userData.surName || '',
          fullName: userData.fullName || '',
          email: userData.email || '',
           birthDate: userData.birthDate ? userData.birthDate.split('T')[0] : null,
          telephone: userData.telephone || null,
          employment: userData.employment || '',
          userAgreement: userData.userAgreement || false,
          changePassword: false
        })
      } catch (error) {
        setServerError('Ошибка при загрузке данных пользователя')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (id) {
      fetchUser()
    } else {
      setServerError('ID пользователя не указан')
      setIsLoading(false)
    }
  }, [id, reset])

  useEffect(() => {
    const fullName = `${name || ''} ${surName || ''}`.trim()
    setValue('fullName', fullName)
  }, [name, surName, setValue])

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    setIsSubmitting(true)
    
    try {
      const updatePayload:any = {}
      const { changePassword, confirmPassword, ...payload } = data
      

      if (data.name) updatePayload.name = data.name
      if (data.surName) updatePayload.surName = data.surName
      if (data.fullName) updatePayload.fullName = data.fullName
      if (data.birthDate) {updatePayload.birthDate = data.birthDate instanceof Date 
      ? data.birthDate.toISOString() 
      : data.birthDate;
  }
      if (data.telephone !== null) updatePayload.telephone = data.telephone
      if (data.employment) updatePayload.employment = data.employment
      updatePayload.userAgreement = data.userAgreement
      
      await axiosInstance.patch(`/v1/users/${id}`, updatePayload)
      navigate('/')
    } catch (e: any) {
      if (e.response?.data?.message) {
        setServerError(e.response.data.message)
      } else {
        setServerError('Ошибка при обновлении пользователя')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Загрузка данных пользователя...</div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-4 mt-10"
    >
      <h2 className="text-2xl font-bold">Редактирование пользователя</h2>

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

      <input placeholder="Email" type='hidden' {...register('email')} className="input" />
      <p className="text-red-500 text-sm">{errors.email?.message}</p>

      <div className="flex items-center gap-2 mb-2">
        <input type="checkbox" {...register('changePassword')} />
        <label>Изменить пароль</label>
      </div>

      {changePassword && (
        <>
          <input type="password" placeholder="Новый пароль" {...register('password')} className="input" />
          <p className="text-red-500 text-sm">{errors.password?.message}</p>

          <input type="password" placeholder="Подтвердите пароль" {...register('confirmPassword')} className="input" />
          <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>
        </>
      )}

       <div>
        <label>Дата рождения </label>
        <DateInput
          name="birthDate"
          control={control}
          className="input"
        />
      </div>

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
        <input type="checkbox" className='checkbox' {...register('userAgreement')} />
        Я согласен с политикой
      </label>
      <p className="text-red-500 text-sm">{errors.userAgreement?.message}</p>

      <div className="flex space-x-4">
        <button 
          type="button"
          onClick={() => navigate(-1)}
          className="btn bg-gray-400 text-white px-4 py-2 rounded flex-1"
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button 
          type="submit"
          className={`btn px-4 py-2 rounded flex-1 ${
            isDirty && !isSubmitting 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  )
}
export default UserEditPage