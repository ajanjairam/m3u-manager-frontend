export interface Channel {
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
}

export interface ChannelGroup {
  id: number;
  title: string;
  active: boolean;
  playlist_id: number | null;
}

export interface ChannelWithGroup {
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
  group: ChannelGroup;
}

export interface ChannelPage {
  items: ChannelWithGroup[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
