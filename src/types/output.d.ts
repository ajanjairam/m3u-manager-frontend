type OutputStream = {
  id: number;
  tvg_id: string;
  playlist_id: number;
  priority: number;
  channel_id: number;
  created_at: string;
  updated_at: string;
  uri: string;
};

type OutputChannel = {
  id: number;
  name: string;
  tvg_logo: string | null;
  group_id: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type OutputChannelWithStreams = OutputChannel & {
  group_name: string | null;
  streams: OutputStream[];
};
