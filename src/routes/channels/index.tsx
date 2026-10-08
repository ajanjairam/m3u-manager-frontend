import { Badge } from "@/src/components/ui/badge";
import { Button, buttonVariants } from "@/src/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/src/components/ui/item";
import { getChannelPagination } from "@/src/utils/channel";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/channels/")({
  component: ChannelsPage,
});

function ChannelsPage() {
  const [page, setPage] = useState(1);
  const {
    data: channels,
    isLoading,
    isError,
    isSuccess,
    error,
  } = getChannelPagination(page);
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
        <div className="flex w-full 2xl:max-w-xl flex-col gap-6">
          <ItemGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {channels.items.map((channel) => (
              <Item key={channel.id} variant="outline">
                <ItemHeader>
                  <img
                    src={channel.tvg_logo!}
                    alt={channel.name}
                    className="aspect-square w-full rounded-sm object-cover"
                  />
                </ItemHeader>
                <ItemContent>
                  <ItemTitle>{channel.tvg_name ?? channel.tvg_name}</ItemTitle>
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
      )}
    </main>
  );
}

function encodeChannelUri(uri: string) {
  const hashIndex = uri.indexOf("#");
  const streamUri = hashIndex === -1 ? uri : uri.slice(0, hashIndex);
  const token = hashIndex === -1 ? "" : `#${uri.slice(hashIndex + 1)}`;
  const encodedStreamUri = encodeURIComponent(streamUri).replace(
    /%[0-9A-F]{2}/g,
    (encoded) => encoded.toLowerCase(),
  );

  return `${encodedStreamUri}${token}`;
}
