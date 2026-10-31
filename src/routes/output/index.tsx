import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ExternalLink, LoaderCircle } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/src/components/ui/item";
import { useFindOutputChannelsWithStreams } from "@/src/utils/output";

export const Route = createFileRoute("/output/")({
  component: OutputPage,
});

function OutputPage() {
  const {
    data: channels,
    isLoading,
    isError,
    error,
  } = useFindOutputChannelsWithStreams();

  return (
    <main className="min-w-0 flex-1 space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Output</h1>
        <p className="text-sm text-muted-foreground">
          Output channels and their configured streams.
        </p>
      </header>

      {isLoading && (
        <div className="flex justify-center p-8" role="status">
          <LoaderCircle className="size-6 animate-spin" />
          <span className="sr-only">Loading output channels</span>
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive" role="alert">
          Failed to load output channels: {error.message}
        </p>
      )}

      {channels && channels.length > 0 && (
        <ItemGroup className="gap-3">
          {channels.map((channel) => (
            <Collapsible key={channel.id}>
              <Item variant="outline" className="block overflow-hidden p-0">
                <CollapsibleTrigger className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-muted/50">
                  <ItemMedia variant="image" className="size-12 rounded-md">
                    {channel.tvg_logo ? (
                      <img src={channel.tvg_logo} alt="" loading="lazy" />
                    ) : (
                      <span className="text-lg font-semibold text-muted-foreground">
                        {channel.name.charAt(0).toUpperCase() || "?"}
                      </span>
                    )}
                  </ItemMedia>
                  <ItemContent className="min-w-0">
                    <ItemTitle className="max-w-full truncate">
                      {channel.name}
                    </ItemTitle>
                    <ItemDescription className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">
                        {channel.group_name || "Ungrouped"}
                      </Badge>
                      <span>
                        {channel.streams.length}{" "}
                        {channel.streams.length === 1 ? "stream" : "streams"}
                      </span>
                    </ItemDescription>
                  </ItemContent>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform data-[panel-open]:rotate-180" />
                </CollapsibleTrigger>

                <CollapsibleContent className="border-t bg-muted/20 px-4 py-3">
                  {channel.streams.length > 0 ? (
                    <ItemGroup className="gap-2">
                      {channel.streams.map((stream) => (
                        <Item
                          key={stream.id}
                          size="sm"
                          variant="muted"
                          className="flex-nowrap"
                        >
                          <ItemContent className="min-w-0">
                            <ItemTitle className="max-w-full truncate">
                              TVG ID: {stream.tvg_id}
                            </ItemTitle>
                            <ItemDescription
                              className="truncate"
                              title={stream.uri}
                            >
                              {stream.uri}
                            </ItemDescription>
                          </ItemContent>
                          <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                            <span>Priority {stream.priority}</span>
                            <a
                              href={stream.uri}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Open stream ${stream.tvg_id} in a new tab`}
                              title="Open stream in a new tab"
                              className="rounded-sm p-1 text-foreground hover:bg-accent hover:text-accent-foreground"
                            >
                              <ExternalLink className="size-4" />
                            </a>
                          </div>
                        </Item>
                      ))}
                    </ItemGroup>
                  ) : (
                    <p className="py-2 text-sm text-muted-foreground">
                      No streams configured for this channel.
                    </p>
                  )}
                </CollapsibleContent>
              </Item>
            </Collapsible>
          ))}
        </ItemGroup>
      )}

      {channels && channels.length === 0 && (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          No output channels found.
        </div>
      )}
    </main>
  );
}
