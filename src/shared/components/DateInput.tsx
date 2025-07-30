// src/shared/components/DateInput.tsx
import { Controller } from 'react-hook-form'

interface DateInputProps {
  name: 'birthDate'
  control: any
  className?: string
}
const formatDateForInput = (value: any): string => {
  if (!value) return '';
  
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value.toISOString().split('T')[0];
  }
  
  return '';
};

export const DateInput = ({ name, control, className }: DateInputProps) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState: { error } }) => {
      const value = formatDateForInput(field.value);
      
      return (
        <>
          <input
            type="date"
            value={value}
            onChange={e => field.onChange(e.target.value || null)}
            className={className}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </>
      )
    }}
  />
)