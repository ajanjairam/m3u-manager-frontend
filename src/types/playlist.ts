export interface Playlist {
  id: number;
  name: string;
  uri: string;
  active: boolean;
}

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

export interface PlaylistWithChannels extends Playlist {
  channels: Channel[];
}

export interface CreatePlaylistInput {
  name: string;
  uri: string;
}
