import { IApp } from '@/app/(mian)/type';
import Show from '@/components/show';
import { Badge } from '@/components/ui/badge';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<IApp.asObject>();

const defaultColumns = [
  columnHelper.accessor('name', {
    cell: ({ getValue }) => <div className="text-left">{getValue()}</div>,
  }),
  columnHelper.accessor('version', {
    cell: ({ getValue }) => <div className="text-left">{getValue()}</div>,
  }),
  columnHelper.accessor('lastVersion', {
    cell: ({ getValue, row }) => (
      <div className="text-left">
        {getValue()}
        <Show when={row.original.isNeedUpdate}>
          <Badge
            className="ml-2"
            variant={row.original.isNeedUpdate ? 'destructive' : 'default'}
          >
            需要更新
          </Badge>
        </Show>
      </div>
    ),
  }),
];
export default defaultColumns;
