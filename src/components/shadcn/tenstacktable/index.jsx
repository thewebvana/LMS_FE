import { useState, useMemo, useEffect, useRef } from "react";
import {
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
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Group,
  PinIcon as PinRight,
  Search,
  SlidersHorizontal,
  X,
  Filter,
  GripVertical,
} from "lucide-react";

import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/ui/popover";
import { SkeletonTable } from "./skeleton";
import moment from "moment/moment";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Fuzzy filter function
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};




function convertKeysToCapitalized(data) {
  return data.map(item => {
    let newItem = {};
    for (let key in item) {
      let newKey = key
        .split('_')  // Split by "_"
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize first letter
        .join(' ');  // Join with space

      newItem[newKey] = item[key]; // Assign new key-value pair
    }
    return newItem;
  });
}


export function TenStackTable(props) {



  let hideColumns = props?.hideColumns || [];
  let loading = props?.isLoading || false;
  let data = props?.data
  let selectAllRow = props?.selectAllRow || true;
  let rowSelect = props?.rowSelect || true;
  let isSorting = props?.isSorting || true;
  let columnsTypes = props?.columnsTypes || null;
  let customColumns = props?.customColumns || [];
  let isError = props?.isError || false;

  if (isError) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader></TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="h-24 text-center">
                Something went wrong! please try again.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (props?.isLoading) {
    return <SkeletonTable rows={5} columns={4} />;
  }

  // State
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnPinning, setColumnPinning] = useState({});
  const [grouping, setGrouping] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnSizing, setColumnSizing] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilterInputs, setColumnFilterInputs] = useState({});

  //set column visibility
  useEffect(() => {
    if (data?.length > 0) {
      const cv = Object.keys(data[0]).reduce((acc, key) => {
        acc[key] = !hideColumns.includes(key);
        return acc;
      }, {});

      setColumnVisibility(cv);

      // Initialize column order with all visible columns
      const initialOrder = [
        ...(selectAllRow ? ["select"] : []),
        ...Object.keys(data[0]).filter(key => !hideColumns.includes(key)),
        ...customColumns.map(col => col.id)
      ];
      setColumnOrder(initialOrder);
    }
  }, [hideColumns, data, selectAllRow, customColumns]);

  // Handle column filter input changes
  const handleColumnFilterChange = (columnId, value) => {
    setColumnFilterInputs(prev => ({
      ...prev,
      [columnId]: value
    }));

    // Update column filters
    setColumnFilters(prev =>
      prev.filter(f => f.id !== columnId).concat(
        value ? { id: columnId, value } : []
      )
    );
  };


  // Column definitions
  const [showFilters, setShowFilters] = useState(false);

  const columnHeaders = Object.keys(data?.[0]).map((key) => ({
    accessorKey: key,
    header: ({ column, table }) => {
      const inputRef = useRef(null);

      // Clear filter handler
      const handleClearFilter = () => {
        handleColumnFilterChange(column.id, "");
        if (inputRef.current) inputRef.current.focus();
      };

      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 min-w-[130px] py-1">
            {key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())
              .replace("Isdeleted", "Is Deleted")
              .replace("CreatedAt", "Created At")
              .replace("UpdatedAt", "Updated At")}
            <ArrowUpDown
              className="w-4 h-4 cursor-pointer"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            />
            <Filter
              className="w-4 h-4 cursor-pointer"
              onClick={() => {
                setShowFilters(!showFilters);
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
            />
          </div>

          {showFilters && (
            <div className="relative mb-2">
              <Input
                ref={inputRef}
                type="text"
                value={columnFilterInputs[column.id] || ""}
                onChange={(e) => {
                  handleColumnFilterChange(column.id, e.target.value);
                  e.stopPropagation(); // Prevent event from bubbling up
                }}
                onClick={(e) => e.stopPropagation()} // Prevent click from closing
                placeholder={`Filter ${column.id.replace(/_/g, " ")}`}
                className="w-full h-8 text-xs pr-6"
              />
              {columnFilterInputs[column.id] && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearFilter();
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>
      );
    },
    enableSorting: isSorting,
  }));


  //Created AT and Updated AT Formate data
  const formattedData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => {
      let newItem = { ...item };
      Object.keys(newItem).forEach((key) => {
        if (columnsTypes?.[key] === "Date" && newItem[key]) {
          newItem[key] = moment(newItem[key]).format("DD-MM-YYYY hh:mm A");
        }
      });
      return newItem;
    });
  }, [data, columnsTypes]);

  const columns = useMemo(
    () => [
      selectAllRow
        ? {
          id: "select",
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
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
          enableSorting: true,
          enableHiding: true,
        }
        : rowSelect
          ? {
            id: "select",
            cell: ({ row }) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            ),
            enableSorting: true,
            enableHiding: true,
          }
          : {
            id: "select",
            enableSorting: true,
            enableHiding: true,
          },
      ...columnHeaders,
      ...customColumns,
    ],
    [selectAllRow, rowSelect, columnHeaders, customColumns, columnFilterInputs]
  );

  // Table instance
  const table = useReactTable({
    data: formattedData,
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
  });

  // Handle drag and drop column reordering
  function handleDragEnd(event) {
    const { destination, source } = event;
    if (!destination) return;
    if (destination.index === source.index) return;

    const newColumnOrder = [...columnOrder];
    const [movedColumn] = newColumnOrder.splice(source.index, 1);
    newColumnOrder.splice(destination.index, 0, movedColumn);
    setColumnOrder(newColumnOrder);
  }

  // CSV Export function
  const exportToCSV = () => {
    const headers = columns
      .filter((column) => column.id !== "select" && column.id !== "actions")
      .map((column) => column.accessorKey || column.id)
      .join(",");

    const rows = table
      .getFilteredRowModel()
      .rows.map((row) => {
        return columns
          .filter((column) => column.id !== "select" && column.id !== "actions")
          .map((column) => {
            const value = row.getValue(column.accessorKey || column.id);
            return typeof value === "string" ? `"${value}"` : value;
          })
          .join(",");
      })
      .join("\n");

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGlobalFilter("")}
          >
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
                    onCheckedChange={(value) =>
                      column.getToggleGroupingHandler()(value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
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
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="columns">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {table.getAllLeafColumns().map((column, index) => {
                        if (column.id == 'select' || column.id == 'actions') {
                          return
                        }
                        return (
                          <Draggable
                            key={column.id}
                            draggableId={column.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center space-x-2 p-1"
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-move"
                                >
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Checkbox
                                  checked={column.getIsVisible()}
                                  onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                  }
                                />
                                <label className="text-sm capitalize">

                                  {column.id
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (char) => char.toUpperCase())
                                    .replace("Isdeleted", "Is Deleted")
                                    .replace("CreatedAt", "Created At")
                                    .replace("UpdatedAt", "Updated At")}
                                </label>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
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
                      position: header.column.getIsPinned()
                        ? "sticky"
                        : undefined,
                      left:
                        header.column.getIsPinned() === "left" ? 0 : undefined,
                      right:
                        header.column.getIsPinned() === "right" ? 0 : undefined,
                      background: header.column.getIsPinned()
                        ? "white"
                        : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none ${header.column.getIsResizing() ? "bg-primary" : ""
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        position: cell.column.getIsPinned()
                          ? "sticky"
                          : undefined,
                        left:
                          cell.column.getIsPinned() === "left" ? 0 : undefined,
                        right:
                          cell.column.getIsPinned() === "right" ? 0 : undefined,
                        background: cell.column.getIsPinned()
                          ? "white"
                          : undefined,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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
              table.setPageSize(Number(value));
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
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
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
  );
}