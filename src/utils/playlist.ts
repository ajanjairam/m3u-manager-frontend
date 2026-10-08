import axios from "@/src/lib/axios";
import type { AxiosError } from "axios";
import { queryClient } from "@/src/components/providers";
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  CreatePlaylistInput,
  Playlist,
  PlaylistWithChannels,
} from "../types/playlist";

export const playlistQueryKeys = {
  all: ["playlists"] as const,
  detail: (id: number) => ["playlist", id] as const,
};

export async function fetchPlaylists(): Promise<Playlist[]> {
  const { data } = await axios.get<Playlist[]>("/playlist/");
  return data;
}

export async function fetchPlaylist(id: number): Promise<Playlist> {
  const { data } = await axios.get<Playlist>(`/playlist/${id}`);
  return data;
}

export async function createPlaylist(
  input: CreatePlaylistInput,
): Promise<PlaylistWithChannels> {
  const { data } = await axios.post<PlaylistWithChannels>("/playlist/", input);
  return data;
}

export function getPlaylists() {
  return useQuery({
    queryKey: playlistQueryKeys.all,
    queryFn: fetchPlaylists,
  });
}

export function usePlaylist(id: number) {
  return useQuery({
    queryKey: playlistQueryKeys.detail(id),
    queryFn: () => fetchPlaylist(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useCreatePlaylist() {
  return useMutation<PlaylistWithChannels, AxiosError, CreatePlaylistInput>({
    mutationFn: createPlaylist,
    onSuccess: async (createdPlaylist) => {
      await queryClient.invalidateQueries({ queryKey: playlistQueryKeys.all });
      queryClient.setQueryData(
        playlistQueryKeys.detail(createdPlaylist.id),
        createdPlaylist,
      );
    },
  });
}
