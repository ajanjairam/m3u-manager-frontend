export type Channel = {
  id: number;
  name: string;
  length: number | null;
  uri: string;
  tvg_id: string | null;
  tvg_name: string | null;
  tvg_logo: string | null;
  group_id: number | null;
  active: boolean;
  playlist_id: number | null;
};

export type ChannelGroup = {
  id: number;
  title: string;
  active: boolean;
  playlist_id: number | null;
};

export type ChannelPage = {
  items: (Channel & {
    group_title: string;
    playlist_name: string;
  })[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};
