import axios from "../lib/axios";
import type { AxiosError } from "axios";
import { queryClient } from "@/src/components/providers";
import { useMutation, useQuery } from "@tanstack/react-query";

export const outputQueryKeys = {
  all: ["output"] as const,
  streams: ["output", "streams"] as const,
};

export interface CreateOutputChannelInput {
  channel_id: number;
  name: string;
}

export async function createOutputChannel(
  input: CreateOutputChannelInput,
): Promise<OutputChannel> {
  const { data } = await axios.post<OutputChannel>("/output/create", input);
  return data;
}

export async function fetchOutputChannelStreams(): Promise<
  OutputChannelWithStreams[]
> {
  const { data } =
    await axios.get<OutputChannelWithStreams[]>("/output/streams");
  return data;
}

export async function fetchOutputChannels(): Promise<OutputChannel[]> {
  const { data } = await axios.get<OutputChannel[]>("/output/");
  return data;
}

export function useCreateOutputChannel() {
  return useMutation<
    OutputChannel,
    AxiosError<{ message?: string }>,
    CreateOutputChannelInput
  >({
    mutationFn: createOutputChannel,
    onSuccess: (createdChannel) => {
      queryClient.setQueryData<OutputChannel[]>(
        outputQueryKeys.all,
        (channels) =>
          channels ? [...channels, createdChannel] : [createdChannel],
      );
    },
  });
}

export function useFindOutputChannelsWithStreams() {
  return useQuery({
    queryKey: outputQueryKeys.streams,
    queryFn: fetchOutputChannelStreams,
  });
}

export function useFindAllOChannels() {
  return useQuery({
    queryKey: outputQueryKeys.all,
    queryFn: fetchOutputChannels,
  });
}
