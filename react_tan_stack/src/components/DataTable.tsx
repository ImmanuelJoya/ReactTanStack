import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'


type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
}

const defaultData: Person[] = [
  {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    visits: 5,
    status: 'Active',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    age: 25,
    visits: 3,
    status: 'Inactive',
  },
]


const defaultColumns: ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'age',
    header: 'Age',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'visits',
    header: 'Visits',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => info.getValue(),
  },
]

export function DataTable() {
  const [data] = useState(() => [...defaultData])
  const [columns] = useState<ColumnDef<Person>[]>(() => [...defaultColumns])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th 
                  key={header.id} 
                  className="border border-gray-300 p-2 bg-gray-600"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-800">
              {row.getVisibleCells().map((cell) => (
                <td 
                  key={cell.id} 
                  className="border border-gray-300 p-2"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}