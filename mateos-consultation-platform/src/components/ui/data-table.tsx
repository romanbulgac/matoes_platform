import { cn } from "@/lib/utils"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Search } from "lucide-react"
import * as React from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

// Table components
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    sortable?: boolean
    sortDirection?: 'asc' | 'desc' | null
    onSort?: () => void
  }
>(({ className, sortable, sortDirection, onSort, children, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      sortable && "cursor-pointer select-none hover:bg-muted/50",
      className
    )}
    onClick={sortable ? onSort : undefined}
    {...props}
  >
    <div className="flex items-center space-x-1">
      <span>{children}</span>
      {sortable && (
        <div className="flex flex-col">
          {sortDirection === 'asc' && <ChevronUp className="h-4 w-4" />}
          {sortDirection === 'desc' && <ChevronDown className="h-4 w-4" />}
          {!sortDirection && <ChevronDown className="h-4 w-4 opacity-50" />}
        </div>
      )}
    </div>
  </th>
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

// Data table with sorting, filtering and pagination
interface Column<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  pageSize?: number
  className?: string
  emptyMessage?: string
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Căutare...",
  pageSize = 10,
  className,
  emptyMessage = "Nu există date"
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(pageSize)

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data
    
    return data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [data, searchQuery])

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]
      
      // Convert to strings for safe comparison
      const aStr = String(aValue ?? '')
      const bStr = String(bValue ?? '')
      
      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortColumn, sortDirection])

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and controls */}
      {searchable && (
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
              className="pl-8"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Afișează:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  sortable={column.sortable}
                  sortDirection={
                    sortColumn === column.key ? sortDirection : null
                  }
                  onSort={() => column.sortable && handleSort(String(column.key))}
                  style={{ width: column.width }}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render
                        ? column.render(row[column.key as keyof T], row)
                        : String(row[column.key as keyof T] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Afișează {startIndex + 1} - {Math.min(startIndex + itemsPerPage, sortedData.length)} din {sortedData.length} rezultate
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number
                if (totalPages <= 5) {
                  page = i + 1
                } else if (currentPage <= 3) {
                  page = i + 1
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i
                } else {
                  page = currentPage - 2 + i
                }
                
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 p-0"
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Următorul
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow }

