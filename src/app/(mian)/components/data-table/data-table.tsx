import Show from '@/components/show';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { flexRender } from '@tanstack/react-table';
import type { Table as Itable } from '@tanstack/react-table';

import { IApp } from '../../type';

interface DataTableProps {
  table: Itable<IApp.asObject>;
}

export default function Page({ table }: DataTableProps) {
  function Empty() {
    return (
      <TableRow>
        <TableCell
          colSpan={table.getAllColumns().length}
          className="h-24 text-center"
        >
          No results.
        </TableCell>
      </TableRow>
    );
  }
  return (
    <div className="overflow-auto border rounded-lg">
      <Table className=" ">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          <Show
            when={Boolean(table.getRowModel().rows?.length)}
            fallback={<Empty />}
          >
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="nth-[2n]:bg-muted"
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </Show>
        </TableBody>
      </Table>
    </div>
  );
}
