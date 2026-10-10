import { useQuery } from "@tanstack/react-query";
import axios from "@/src/lib/axios";
import type { ChannelPage } from "../types/channel";

export const channelQueryKeys = {
  all: ["channels"] as const,
  page: (page: number, pageSize: number) =>
    ["channels-pagination", page, pageSize] as const,
};

export async function fetchChannelsPage(
  page: number,
  pageSize: number,
): Promise<ChannelPage> {
  const { data } = await axios.get<ChannelPage>("/channels/page", {
    params: { page, page_size: pageSize },
  });
  return data;
}

export function useFindChannelsWithPagination(
  page: number = 1,
  pageSize: number = 25,
) {
  return useQuery({
    queryKey: channelQueryKeys.page(page, pageSize),
    queryFn: () => fetchChannelsPage(page, pageSize),
    placeholderData: (previousPage) => previousPage,
  });
}
