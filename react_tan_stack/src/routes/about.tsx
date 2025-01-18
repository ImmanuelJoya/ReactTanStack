import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { z } from 'zod'
import { DataTable } from '../components/DataTable'

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  age: z.coerce.number().min(0, 'Age must be a positive number'),
})

type FormValues = z.infer<typeof formSchema>

export const Route = createFileRoute('/about')({
  component: AboutComponent,
})

function AboutComponent() {
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [formState, setFormState] = React.useState<FormValues>({
    firstName: '',
    lastName: '',
    age: 0,
  })

  const form = useForm<FormValues>({
    defaultValues: formState,
    onSubmit: async ({ value }) => {
      try {
        const validatedData = formSchema.parse(value)
        console.log('Form submitted:', validatedData)
        setErrors({})
        setFormState(validatedData)
      } catch (err) {
        if (err instanceof z.ZodError) {
          const newErrors: Record<string, string> = {}
          err.errors.forEach((error) => {
            if (error.path[0]) {
              newErrors[error.path[0] as string] = error.message
            }
          })
          setErrors(newErrors)
        }
      }
    },
  })

  const validateField = (field: keyof FormValues, value: string | number) => {
    try {
      formSchema.shape[field].parse(value)
      setErrors(prev => ({ ...prev, [field]: '' }))
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: err.errors[0].message }))
      }
    }
  }

  return (
    <div className="p-2 max-w-md mx-auto">
      <h3 className="text-2xl mb-4">Users</h3>
      <DataTable />

      <h3 className="text-2xl mt-6 mb-4">User Registration</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="firstName" className="block mb-2">First Name</label>
          <input
            id="firstName"
            type="text"
            value={form.state.values.firstName}
            onChange={(e) => {
              const value = e.target.value
              form.setFieldValue('firstName', value)
              validateField('firstName', value)
            }}
            className="w-full p-2 border rounded"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block mb-2">Last Name</label>
          <input
            id="lastName"
            type="text"
            value={form.state.values.lastName}
            onChange={(e) => {
              const value = e.target.value
              form.setFieldValue('lastName', value)
              validateField('lastName', value)
            }}
            className="w-full p-2 border rounded"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lastName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="age" className="block mb-2">Age</label>
          <input
            id="age"
            type="number"
            value={form.state.values.age}
            onChange={(e) => {
              const value = Number(e.target.value)
              form.setFieldValue('age', value)
              validateField('age', value)
            }}
            className="w-full p-2 border rounded"
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">
              {errors.age}
            </p>
          )}
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      <div className="mt-6 p-4 bg-gray-600 rounded">
        <h3 className="text-xl mb-2">Current Form State</h3>
        <pre className="bg-slate-200 p-2 rounded text-black">
          {JSON.stringify(formState, null, 2)}
        </pre>
      </div>
    </div>
  )
}