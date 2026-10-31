import { Badge } from "@/src/components/ui/badge";
import { Button, buttonVariants } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
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
import type { ChannelPage } from "@/src/types/channel";
import { useFindChannelsWithPagination } from "@/src/utils/channel";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
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
import {
  useCreateOutputChannel,
  useFindAllOChannels,
} from "@/src/utils/output";
import { Spinner } from "@/src/components/ui/spinner";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/src/components/ui/combobox";

export const Route = createFileRoute("/channels/")({
  component: ChannelsPage,
});

function ChannelsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const {
    error: ocError,
    data: oChannels,
    isError: isOCError,
    isLoading: isOCLoading,
    isSuccess: isOCSuccess,
  } = useFindAllOChannels();
  const [addChannel, setAddChannel] = useState<ChannelPage["items"][0] | null>(
    null,
  );
  const [outputChannelQuery, setOutputChannelQuery] = useState("");
  const createOutputChannel = useCreateOutputChannel();
  const createForm = useForm({
    defaultValues: { name: "" },
    onSubmit: async ({ value }) => {
      if (!addChannel) return;

      await createOutputChannel.mutateAsync({
        channel_id: addChannel.id,
        name: value.name.trim(),
      });
      createForm.reset();
      setAddChannel(null);
    },
  });
  const addForm = useForm({
    defaultValues: { output_id: -1, channel_id: -1 },
  });
  const {
    data: channels,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useFindChannelsWithPagination(page, pageSize);

  const filteredOutputChannels = oChannels?.filter((channel) =>
    channel.name.toLowerCase().includes(outputChannelQuery.toLowerCase()),
  );

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
                    <ItemDescription className="space-x-1">
                      <Badge variant="default">{channel.playlist_name}</Badge>
                      <Badge variant="secondary">{channel.group_title}</Badge>
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
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        createOutputChannel.reset();
                        setAddChannel(channel);
                        setOutputChannelQuery("");
                        createForm.setFieldValue("name", channel.name);
                        addForm.setFieldValue("channel_id", channel.id);
                        addForm.setFieldValue("output_id", -1);
                      }}
                    >
                      <Plus />
                    </Button>
                  </ItemFooter>
                </Item>
              ))}
            </ItemGroup>
          </div>
          {channels.total_pages > 0 && (
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
                    {channels.total_pages === 0 ? 0 : page} /{" "}
                    {channels.total_pages}
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
          )}
        </>
      )}
      <Dialog
        open={addChannel != null}
        onOpenChange={(open) => {
          if (!open) setAddChannel(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Channel</DialogTitle>
            <DialogDescription>
              {addChannel !== null
                ? `Add/Create “${addChannel.name}” to the output ?`
                : "Add/Create the channel to the output ?"}
            </DialogDescription>
          </DialogHeader>
          <form
            id="create-form"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void createForm.handleSubmit();
            }}
          >
            <FieldGroup className="flex flex-row items-center gap-2">
              <createForm.Field
                name="name"
                children={(field) => (
                  <Field className="min-w-0 flex-1">
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                  </Field>
                )}
              />
              <Button
                type="submit"
                className="shrink-0"
                form="create-form"
                disabled={!addChannel || createOutputChannel.isPending}
              >
                {createOutputChannel.isPending ? "Creating..." : "Create"}
              </Button>
            </FieldGroup>
            {createOutputChannel.isError && (
              <FieldError
                errors={[
                  {
                    message:
                      createOutputChannel.error.response?.data?.message ??
                      "Unable to create output channel.",
                  },
                ]}
              />
            )}
          </form>
          {isOCLoading && <Spinner />}
          {isOCError && <FieldError errors={[{ message: ocError.message }]} />}
          {isOCSuccess && (
            <form
              id="add-form"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void addForm.handleSubmit();
              }}
            >
              <FieldGroup>
                <Combobox
                  items={filteredOutputChannels}
                  value={
                    oChannels?.find(
                      (channel) =>
                        channel.id === addForm.state.values.output_id,
                    ) ?? null
                  }
                  onValueChange={(channel: OutputChannel | null) =>
                    addForm.setFieldValue("output_id", channel?.id ?? -1)
                  }
                  inputValue={outputChannelQuery}
                  onInputValueChange={setOutputChannelQuery}
                  itemToStringValue={(channel: OutputChannel) => channel.name}
                >
                  <ComboboxInput placeholder="Search channels..." />
                  <ComboboxContent>
                    <ComboboxEmpty>No channels found.</ComboboxEmpty>
                    <ComboboxList>
                      {(channel) => (
                        <ComboboxItem key={channel.id} value={channel}>
                          {channel.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <Button>Add</Button>
              </FieldGroup>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
