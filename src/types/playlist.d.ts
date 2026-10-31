export type Playlist = {
  id: number;
  name: string;
  uri: string;
  active: boolean;
};

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

export type PlaylistWithChannels = Playlist & {
  channels: Channel[];
};

export type CreatePlaylistResponse = {
  playlist: Playlist;
  channels: Channel[];
};

export type CreatePlaylistInput = {
  name: string;
  uri: string;
};
