import { Badge } from "@/src/components/ui/badge";
import { Button, buttonVariants } from "@/src/components/ui/button";
import { Field, FieldLabel } from "@/src/components/ui/field";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/src/components/ui/item";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/src/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { getChannelPagination } from "@/src/utils/channel";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  LoaderCircle,
  Plus,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/channels/")({
  component: ChannelsPage,
});

function ChannelsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const {
    data: channels,
    isLoading,
    isError,
    isSuccess,
    error,
  } = getChannelPagination(page, pageSize);

  function handlePageChange(page: number, direction: -1 | 1) {
    if (direction === -1) {
      if (page === 1) setPage(1);
      else setPage(page - 1);
    } else {
      if (channels && channels.total_pages && page === channels.total_pages)
        setPage(channels.total_pages);
      else setPage(page + 1);
    }
  }
  return (
    <main className="min-w-0 flex-1 space-y-4 md:space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Channels</h1>
        {isSuccess && (
          <p className="text-sm text-muted-foreground">
            All Channels retreived from playlists in M3U Manager.
          </p>
        )}
        {isError && (
          <p className="text-sm text-destructive">
            Failed to load channels: {error.message}
          </p>
        )}
        {isLoading && <LoaderCircle className="animate-spin" />}
      </div>
      {isSuccess && (
        <>
          <div className="flex w-full flex-col gap-6">
            <ItemGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {channels.items.map((channel) => (
                <Item key={channel.id} variant="outline">
                  <ItemHeader>
                    <img
                      src={`https://wsrv.nl/?url=${channel.tvg_logo}&w=300&h=300&fit=fill`}
                      alt={channel.name}
                      className="aspect-square w-full rounded-sm object-cover"
                    />
                  </ItemHeader>
                  <ItemContent>
                    <ItemTitle>
                      {channel.tvg_name ?? channel.tvg_name}
                    </ItemTitle>
                    <ItemDescription>
                      <Badge variant="secondary">{channel.group.title}</Badge>
                    </ItemDescription>
                  </ItemContent>
                  <ItemFooter className="flex justify-end">
                    <a
                      target="_blank"
                      href={`http://eja.tv/?${encodeURIComponent(channel.uri)}`}
                      className={buttonVariants({
                        variant: "secondary",
                        size: "sm",
                      })}
                    >
                      <ExternalLink />
                    </a>
                    <Button variant="secondary" size="sm">
                      <Plus />
                    </Button>
                  </ItemFooter>
                </Item>
              ))}
            </ItemGroup>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Field orientation="horizontal" className="w-fit">
              <FieldLabel htmlFor="select-rows-per-page">
                Rows per page
              </FieldLabel>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-20" id="select-rows-per-page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    disabled={page === 1}
                    onClick={() => setPage(1)}
                  >
                    <ChevronsLeft />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page, -1)}
                  >
                    <ChevronLeft />
                  </Button>
                </PaginationItem>
                <Button variant="outline">
                  {page} / {channels.total_pages}
                </Button>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    disabled={page === channels.total_pages}
                    onClick={() => handlePageChange(page, 1)}
                  >
                    <ChevronRight />{" "}
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    disabled={page === channels.total_pages}
                    onClick={() => setPage(channels.total_pages)}
                  >
                    <ChevronsRight />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </main>
  );
}
