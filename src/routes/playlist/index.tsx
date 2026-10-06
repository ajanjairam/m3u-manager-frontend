import { getPlaylists } from "@/src/utils/playlist";
import type { Playlist } from "@/src/types/playlist";
import { createFileRoute } from "@tanstack/react-router";
import { PlaylistStatusToggle } from "@/components/table";
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

export const Route = createFileRoute("/playlist/")({
  component: RouteComponent,
});

const features = tableFeatures({});
const columnHelper = createColumnHelper<typeof features, Playlist>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("uri", {
    header: "URL",
    cell: (info) => (
      <span className="block max-w-xl truncate" title={info.getValue()}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("active", {
    header: "Status",
    cell: ({ row, getValue }) => (
      <PlaylistStatusToggle
        playlistId={row.original.id}
        initialActive={getValue()}
      />
    ),
  }),
]);

const emptyPlaylists: Playlist[] = [];

function RouteComponent() {
  const { data, isLoading, isError, error } = getPlaylists();
  const table = useTable(
    {
      features,
      columns,
      data: data ?? emptyPlaylists,
    },
    (state) => state,
  );

  if (isLoading) {
    return <main className="p-6">Loading playlists…</main>;
  }

  if (isError) {
    return (
      <main className="p-6 text-destructive">
        Failed to load playlists: {error.message}
      </main>
    );
  }

  return (
    <main className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Playlists</h1>
        <p className="text-sm text-muted-foreground">
          All playlists configured in M3U Manager.
        </p>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-medium">
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t">
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No playlists found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
