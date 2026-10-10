import { useState } from "react";
import { LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { useFindAllPlaylists, useDeletePlaylist } from "@/src/utils/playlist";
import type { Playlist } from "@/src/types/playlist";
import { createFileRoute, Link } from "@tanstack/react-router";
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
import { Switch } from "@/src/components/ui/switch";
import { Button, buttonVariants } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";

export const Route = createFileRoute("/playlist/")({
  component: PlaylistPage,
});

const features = tableFeatures({});
const columnHelper = createColumnHelper<typeof features, Playlist>();

const emptyPlaylists: Playlist[] = [];

function PlaylistPage() {
  const [deletePlaylist, setDeletePlaylist] = useState<Playlist | null>(null);
  const [isDeleteChannels, setIsDeleteChannels] = useState(true);
  const deletePlaylistMutation = useDeletePlaylist();
  const {
    data: playlists,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useFindAllPlaylists();

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
        <Switch
          id={`playlist-status-${row.original.id}`}
          checked={getValue()}
        />
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${row.original.name}`}
            title={`Edit ${row.original.name}`}
          >
            <Pencil />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive"
            aria-label={`Delete ${row.original.name}`}
            title={`Delete ${row.original.name}`}
            onClick={() => {
              deletePlaylistMutation.reset();
              setDeletePlaylist(row.original);
              setIsDeleteChannels(true);
            }}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    }),
  ]);

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

      <div className="flex items-center justify-end">
        <Link to="/playlist/add" className={buttonVariants()}>
          Add <Plus />
        </Link>
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

      <Dialog
        open={deletePlaylist !== null}
        onOpenChange={(open) => {
          if (!open) setDeletePlaylist(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Playlist</DialogTitle>
            <DialogDescription>
              {deletePlaylist
                ? `Delete “${deletePlaylist.name}”? This action cannot be undone.`
                : "Delete? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3">
            <Switch
              id="delete-associated-channels"
              checked={isDeleteChannels}
              onCheckedChange={setIsDeleteChannels}
            />
            <Label htmlFor="delete-associated-channels">
              Delete channels associated with playlist?
            </Label>
          </div>
          {deletePlaylistMutation.isError && (
            <p className="text-sm text-destructive" role="alert">
              {deletePlaylistMutation.error.response?.data?.message ??
                "Unable to delete playlist. Please try again."}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                deletePlaylistMutation.reset();
                setDeletePlaylist(null);
              }}
              disabled={deletePlaylistMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!deletePlaylist || deletePlaylistMutation.isPending}
              onClick={() => {
                if (!deletePlaylist) return;

                deletePlaylistMutation.mutate(
                  {
                    id: deletePlaylist.id,
                    channels: isDeleteChannels,
                  },
                  {
                    onSuccess: () => setDeletePlaylist(null),
                  },
                );
              }}
            >
              {deletePlaylistMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
