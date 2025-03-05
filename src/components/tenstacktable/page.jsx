"use client"

import { useState, useMemo } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  FilterFn,
  GroupingState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { rankItem } from "@tanstack/match-sorter-utils"
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Group,
  MoreHorizontal,
  PinIcon as PinRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Define the type for our invoice data
// In JavaScript, type definitions are omitted. The following JSDoc comment is provided for documentation purposes.
/**
 * @typedef {Object} Invoice
 * @property {string} invoice
 * @property {string} paymentStatus
 * @property {string} totalAmount
 * @property {string} paymentMethod
 * @property {string} date
 * @property {string} customer
 * @property {Invoice[]=} subRows
 */

// Sample data with nested rows
const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
    date: "2024-03-01",
    customer: "John Doe",
    subRows: [
      {
        invoice: "INV001-1",
        paymentStatus: "Paid",
        totalAmount: "$150.00",
        paymentMethod: "Credit Card",
        date: "2024-03-01",
        customer: "John Doe",
      },
      {
        invoice: "INV001-2",
        paymentStatus: "Paid",
        totalAmount: "$100.00",
        paymentMethod: "Credit Card",
        date: "2024-03-01",
        customer: "John Doe",
      },
    ],
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
    date: "2024-03-02",
    customer: "Jane Smith",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
    date: "2024-03-03",
    customer: "Bob Johnson",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
    date: "2024-03-04",
    customer: "Alice Brown",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
    date: "2024-03-05",
    customer: "Charlie Wilson",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
    date: "2024-03-06",
    customer: "Diana Miller",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
    date: "2024-03-07",
    customer: "Edward Davis",
  },

  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
    date: "2024-03-01",
    customer: "John Doe",
    subRows: [
      {
        invoice: "INV001-1",
        paymentStatus: "Paid",
        totalAmount: "$150.00",
        paymentMethod: "Credit Card",
        date: "2024-03-01",
        customer: "John Doe",
      },
      {
        invoice: "INV001-2",
        paymentStatus: "Paid",
        totalAmount: "$100.00",
        paymentMethod: "Credit Card",
        date: "2024-03-01",
        customer: "John Doe",
      },
    ],
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
    date: "2024-03-02",
    customer: "Jane Smith",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
    date: "2024-03-03",
    customer: "Bob Johnson",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
    date: "2024-03-04",
    customer: "Alice Brown",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
    date: "2024-03-05",
    customer: "Charlie Wilson",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
    date: "2024-03-06",
    customer: "Diana Miller",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
    date: "2024-03-07",
    customer: "Edward Davis",
  },

  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
    date: "2024-03-01",
    customer: "John Doe",
    subRows: [
      {
        invoice: "INV001-1",
        paymentStatus: "Paid",
        totalAmount: "$150.00",
        paymentMethod: "Credit Card",
        date: "2024-03-01",
        customer: "John Doe",
      },
      {
        invoice: "INV001-2",
        paymentStatus: "Paid",
        totalAmount: "$100.00",
        paymentMethod: "Credit Card",
        date: "2024-03-01",
        customer: "John Doe",
      },
    ],
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
    date: "2024-03-02",
    customer: "Jane Smith",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
    date: "2024-03-03",
    customer: "Bob Johnson",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
    date: "2024-03-04",
    customer: "Alice Brown",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
    date: "2024-03-05",
    customer: "Charlie Wilson",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
    date: "2024-03-06",
    customer: "Diana Miller",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
    date: "2024-03-07",
    customer: "Edward Davis",
  },

  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
    date: "2024-03-01",
    customer: "John Doe",
    subRows: [
      {
        invoice: "INV001-1",
        paymentStatus: "Paid",
        totalAmount: "$150.00",
        paymentMethod: "Credit Card",
        date: "2024-03-01",
        customer: "John Doe",
      },
      {
        invoice: "INV001-2",
        paymentStatus: "Paid",
        totalAmount: "$100.00",
        paymentMethod: "Credit Card",
        date: "2024-03-01",
        customer: "John Doe",
      },
    ],
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
    date: "2024-03-02",
    customer: "Jane Smith",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
    date: "2024-03-03",
    customer: "Bob Johnson",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
    date: "2024-03-04",
    customer: "Alice Brown",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
    date: "2024-03-05",
    customer: "Charlie Wilson",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
    date: "2024-03-06",
    customer: "Diana Miller",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
    date: "2024-03-07",
    customer: "Edward Davis",
  },

  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
    date: "2024-03-01",
    customer: "John Doe",
    subRows: [
      {
        invoice: "INV001-1",
        paymentStatus: "Paid",
        totalAmount: "$150.00",
        paymentMethod: "Credit Card",
        date: "2024-03-01",
        customer: "John Doe",
      },
      {
        invoice: "INV001-2",
        paymentStatus: "Paid",
        totalAmount: "$100.00",
        paymentMethod: "Credit Card",
        date: "2024-03-01",
        customer: "John Doe",
      },
    ],
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
    date: "2024-03-02",
    customer: "Jane Smith",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
    date: "2024-03-03",
    customer: "Bob Johnson",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
    date: "2024-03-04",
    customer: "Alice Brown",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
    date: "2024-03-05",
    customer: "Charlie Wilson",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
    date: "2024-03-06",
    customer: "Diana Miller",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
    date: "2024-03-07",
    customer: "Edward Davis",
  },

  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
    date: "2024-03-01",
    customer: "John Doe",
    subRows: [
      {
        invoice: "INV001-1",
        paymentStatus: "Paid",
        totalAmount: "$150.00",
        paymentMethod: "Credit Card",
        date: "2024-03-01",
        customer: "John Doe",
      },
      {
        invoice: "INV001-2",
        paymentStatus: "Paid",
        totalAmount: "$100.00",
        paymentMethod: "Credit Card",
        date: "2024-03-01",
        customer: "John Doe",
      },
    ],
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
    date: "2024-03-02",
    customer: "Jane Smith",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
    date: "2024-03-03",
    customer: "Bob Johnson",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
    date: "2024-03-04",
    customer: "Alice Brown",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
    date: "2024-03-05",
    customer: "Charlie Wilson",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
    date: "2024-03-06",
    customer: "Diana Miller",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
    date: "2024-03-07",
    customer: "Edward Davis",
  },
]

// Fuzzy filter function
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

export function TenStackTable() {
  // State
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [columnPinning, setColumnPinning] = useState({})
  const [grouping, setGrouping] = useState([])
  const [expanded, setExpanded] = useState({})
  const [columnOrder, setColumnOrder] = useState([])
  const [columnSizing, setColumnSizing] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })
  const [globalFilter, setGlobalFilter] = useState("")

  // Column definitions
  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "invoice",
        header: "Invoice"
      },
      {
        accessorKey: "customer",
        header: "Customer",
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
      },
      {
        accessorKey: "paymentStatus",
        header: "Status",
      },
      {
        accessorKey: "paymentMethod",
        header: "Method",
      },
      {
        accessorKey: "totalAmount",
        header: "Amount",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.getValue("invoice"))}>
                  Copy Invoice ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>Download PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    []
  )

  // Table instance
  const table = useReactTable({
    data: invoices,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnPinning,
      grouping,
      expanded,
      columnOrder,
      columnSizing,
      pagination,
      globalFilter,
    },
    enableRowSelection: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnPinningChange: setColumnPinning,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    onPaginationChange: setPagination,
    getSubRows: (row) => row.subRows,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
  })

  // CSV Export function
  const exportToCSV = () => {
    const headers = columns
      .filter((column) => column.id !== "select" && column.id !== "actions")
      .map((column) => column.accessorKey || column.id)
      .join(",")

    const rows = table
      .getFilteredRowModel()
      .rows.map((row) => {
        return columns
          .filter((column) => column.id !== "select" && column.id !== "actions")
          .map((column) => {
            const value = row.getValue(column.accessorKey || column.id)
            return typeof value === "string" ? `"${value}"` : value
          })
          .join(",")
      })
      .join("\n")

    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "export.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => setGlobalFilter("")}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Group className="mr-2 h-4 w-4" />
                Group
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              {table.getAllColumns().map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsGrouped()}
                    onCheckedChange={(value) => column.getToggleGroupingHandler()(value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                View
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px]" align="end">
              {table.getAllColumns().map((column) => {
                return (
                  <div key={column.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    />
                    <label className="text-sm capitalize">{column.id}</label>
                  </div>
                )
              })}
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      position: header.column.getIsPinned() ? "sticky" : undefined,
                      left: header.column.getIsPinned() === "left" ? 0 : undefined,
                      right: header.column.getIsPinned() === "right" ? 0 : undefined,
                      background: header.column.getIsPinned() ? "white" : undefined,
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none ${
                        header.column.getIsResizing() ? "bg-primary" : ""
                      }`}
                    />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        position: cell.column.getIsPinned() ? "sticky" : undefined,
                        left: cell.column.getIsPinned() === "left" ? 0 : undefined,
                        right: cell.column.getIsPinned() === "right" ? 0 : undefined,
                        background: cell.column.getIsPinned() ? "white" : undefined,
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm font-medium">Rows per page</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
  
