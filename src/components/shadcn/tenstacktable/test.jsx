import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, getGroupedRowModel, flexRender } from '@tanstack/react-table';
import { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowUpDown, Filter, X, EyeOff, ChevronFirst, ChevronLeft, ChevronRight, ChevronLast } from 'lucide-react';

const DataTable = ({ data }) => {
  // State for all table features
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [grouping, setGrouping] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilterVisibility, setColumnFilterVisibility] = useState({});

  // Dynamically generate columns from the first data item
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const firstItem = data[0];
    const baseColumns = [
      {
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
        size: 40,
      }
    ];

    return [
      ...baseColumns,
      ...Object.keys(firstItem).map(key => ({
        accessorKey: key,
        header: ({ column }) => {
          return (
            <div className="flex flex-col">
              <div className="flex items-center gap-2 min-w-[130px] py-1">
                {formatHeader(key)}
                {column.getCanSort() && (
                  <ArrowUpDown
                    className="w-4 h-4 cursor-pointer"
                    onClick={column.getToggleSortingHandler()}
                  />
                )}
                {column.getCanFilter() && (
                  <Filter
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => toggleFilterVisibility(column.id)}
                  />
                )}
              </div>

              {columnFilterVisibility[column.id] && column.getCanFilter() && (
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={(column.getFilterValue() ?? '')}
                    onChange={(e) => {
                      handleColumnFilterChange(column.id, e.target.value);
                      e.stopPropagation();
                    }}
                    onClick={(e) => e.stopPropagation()}
                    placeholder={`Filter ${formatHeader(key)}`}
                    className="w-full h-8 text-xs pr-6 border rounded px-2"
                  />
                  {column.getFilterValue() && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 p-0 text-gray-500 hover:text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleColumnFilterChange(column.id, '');
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
        cell: ({ getValue }) => {
          const value = getValue();
          // Format boolean values
          if (typeof value === 'boolean') return value ? 'Yes' : 'No';
          // Format dates
          if (typeof value === 'string' && !isNaN(Date.parse(value))) {
            return new Date(value).toLocaleString();
          }
          return value;
        },
        footer: props => props.column.id,
      }))
    ];
  }, [data, columnFilterVisibility]);

  // Format header text
  const formatHeader = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      columnOrder,
      rowSelection,
      grouping,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: setRowSelection,
    onGroupingChange: setGrouping,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
  });

  // Handle column filter input changes
  const handleColumnFilterChange = (columnId, value) => {
    setColumnFilters(prev =>
      prev.filter(f => f.id !== columnId).concat(value ? { id: columnId, value } : [])
    );
  };

  // Toggle filter visibility for a specific column
  const toggleFilterVisibility = (columnId) => {
    setColumnFilterVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  // Column visibility dropdown
  const ColumnVisibilityDropdown = () => {
    return (
      <div className="dropdown">
        <button className="btn btn-outline dropdown-toggle">
          <EyeOff className="mr-2 h-4 w-4" />
          Columns
        </button>
        <div className="dropdown-menu">
          {table.getAllLeafColumns()
            .filter(column => column.getCanHide())
            .map(column => (
              <div key={column.id} className="dropdown-item">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    className="mr-2"
                  />
                  {formatHeader(column.id)}
                </label>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-2">
      {/* Global Filter */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search all columns..."
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="border rounded px-3 py-1 max-w-sm"
        />
        <ColumnVisibilityDropdown />
      </div>

      {/* Table */}
      <div className="border rounded">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                    className="p-2 text-left"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination and Row Selection Info */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Rows per page</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              {[5, 10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="btn btn-outline p-2"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronFirst className="h-4 w-4" />
            </button>
            <button
              className="btn btn-outline p-2"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="btn btn-outline p-2"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              className="btn btn-outline p-2"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronLast className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Checkbox component for row selection
const IndeterminateCheckbox = ({ indeterminate, className = '', ...rest }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof indeterminate === 'boolean' && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={`${className} h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500`}
      {...rest}
    />
  );
};

export default DataTable;