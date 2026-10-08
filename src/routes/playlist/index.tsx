import { LoaderCircle } from "lucide-react";
import { getPlaylists } from "@/src/utils/playlist";
import type { Playlist } from "@/src/types/playlist";
import { createFileRoute } from "@tanstack/react-router";
import { PlaylistStatusToggle } from "@/src/components/playlist-table";
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

export const Route = createFileRoute("/playlist/")({
  component: PlaylistPage,
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

function PlaylistPage() {
  const {
    data: playlists,
    isLoading,
    isError,
    isSuccess,
    error,
  } = getPlaylists();
  const table = useTable(
    {
      features,
      columns,
      data: playlists ?? emptyPlaylists,
    },
    (state) => state,
  );

  return (
    <main className="min-w-0 flex-1 space-y-4 md:space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Playlists</h1>
        {isSuccess && (
          <p className="text-sm text-muted-foreground">
            All playlists configured in M3U Manager.
          </p>
        )}
        {isError && (
          <p className="text-sm text-destructive">
            Failed to load playlists: {error.message}
          </p>
        )}
        {isLoading && <LoaderCircle className="animate-spin" />}
      </div>

      {isSuccess && (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getAllCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-muted-foreground"
                  >
                    No playlists found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
