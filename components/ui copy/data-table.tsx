"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchColumn?: string
  filterColumn?: {
    name: string
    options: { label: string; value: string }[]
  }
  pagination?: {
    page: number
    limit: number
    total: number
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
  }
  isLoading?: boolean
  setSearchQuery?: (query: string) => void
  searchQuery?: string
}

export function DataTable<TData, TValue>({ columns, data, searchColumn, filterColumn, pagination, isLoading = false, setSearchQuery, searchQuery }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      ...(pagination && {
        pagination: {
          pageIndex: pagination.page - 1, // Convert from 1-indexed to 0-indexed
          pageSize: pagination.limit,
        },
      }),
    },
    ...(pagination && {
      manualPagination: true,
      pageCount: Math.ceil(pagination.total / pagination.limit) || 1,
    }),
  })

  // Calculate if we can go to next/previous pages when using manual pagination
  const canPreviousPage = pagination ? pagination.page > 1 : table.getCanPreviousPage()
  const canNextPage = pagination 
    ? pagination.page < Math.ceil(pagination.total / pagination.limit)
    : table.getCanNextPage()

  // Watch for pagination changes from the table if using external pagination
  React.useEffect(() => {
    if (pagination) {
      const { pageIndex, pageSize } = table.getState().pagination
      
      // Only update if values actually changed to prevent infinite loops
      if (pageIndex + 1 !== pagination.page) {
        pagination.onPageChange(pageIndex + 1)
      }
      
      if (pageSize !== pagination.limit) {
        pagination.onLimitChange(pageSize)
      }
    }
  }, [table.getState().pagination, pagination])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {searchColumn && (
          <div className="flex items-center">
            <Input
              placeholder={`Search...`}
              value={searchQuery}
              onChange={(event) => setSearchQuery?.(event.target.value)}
              className="max-w-sm"
            />
          </div>
        )}

        {filterColumn && (
          <div className="flex items-center ml-auto">
            <Select
              value={(table.getColumn(filterColumn.name)?.getFilterValue() as string) ?? ""}
              onValueChange={(value) => table.getColumn(filterColumn.name)?.setFilterValue(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`Filter by ${filterColumn.name}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filterColumn.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="rounded-md border overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              <span className="text-sm text-muted-foreground">Loading data...</span>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="data-[state=selected]:bg-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    </div>
                  ) : 'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {pagination?.total || table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination ? pagination.onPageChange(1) : table.setPageIndex(0)}
            disabled={!canPreviousPage}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination 
              ? pagination.onPageChange(pagination.page - 1) 
              : table.previousPage()
            }
            disabled={!canPreviousPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {pagination?.page || table.getState().pagination.pageIndex + 1} of {Math.max(Math.ceil((pagination?.total || data.length) / (pagination?.limit || table.getState().pagination.pageSize)), 1)}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => pagination 
              ? pagination.onPageChange(pagination.page + 1) 
              : table.nextPage()
            } 
            disabled={!canNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (pagination) {
                const lastPage = Math.max(Math.ceil(pagination.total / pagination.limit), 1)
                pagination.onPageChange(lastPage)
              } else {
                table.setPageIndex(table.getPageCount() - 1)
              }
            }}
            disabled={!canNextPage}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
