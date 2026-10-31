import axios from "@/src/lib/axios";
import type { AxiosError } from "axios";
import { queryClient } from "@/src/components/providers";
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  CreatePlaylistInput,
  CreatePlaylistResponse,
  Playlist,
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
): Promise<CreatePlaylistResponse> {
  const { data } = await axios.post<CreatePlaylistResponse>(
    "/playlist/",
    input,
  );
  return data;
}

export async function deletePlaylist({
  id,
  channels,
}: {
  id: number;
  channels: boolean;
}): Promise<void> {
  await axios.delete(`/playlist/${id}`, { params: { channels } });
}

export async function updatePlaylistStatus({
  id,
  active,
}: {
  id: number;
  active: boolean;
}): Promise<Playlist> {
  const { data } = await axios.patch<Playlist>(`/playlist/${id}`, { active });
  return data;
}

export function useFindAllPlaylists() {
  return useQuery({
    queryKey: playlistQueryKeys.all,
    queryFn: fetchPlaylists,
  });
}

export function useFindPlaylist(id: number) {
  return useQuery({
    queryKey: playlistQueryKeys.detail(id),
    queryFn: () => fetchPlaylist(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useUpdatePlaylistStatus() {
  return useMutation<
    Playlist,
    AxiosError<{ message?: string }>,
    { id: number; active: boolean }
  >({
    mutationFn: updatePlaylistStatus,
    onSuccess: (updatedPlaylist) => {
      queryClient.setQueryData(
        playlistQueryKeys.detail(updatedPlaylist.id),
        updatedPlaylist,
      );
      queryClient.setQueryData<Playlist[]>(playlistQueryKeys.all, (playlists) =>
        playlists?.map((playlist) =>
          playlist.id === updatedPlaylist.id
            ? { ...playlist, active: updatedPlaylist.active }
            : playlist,
        ),
      );
    },
  });
}

export function useDeletePlaylist() {
  return useMutation<
    void,
    AxiosError<{ message?: string }>,
    { id: number; channels: boolean }
  >({
    mutationFn: deletePlaylist,
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({ queryKey: playlistQueryKeys.all });
      queryClient.removeQueries({ queryKey: playlistQueryKeys.detail(id) });
    },
  });
}

export function useSavePlaylist() {
  return useMutation<
    CreatePlaylistResponse,
    AxiosError<{ message?: string }>,
    CreatePlaylistInput
  >({
    mutationFn: createPlaylist,
    onSuccess: async (createdPlaylist) => {
      await queryClient.invalidateQueries({ queryKey: playlistQueryKeys.all });
      queryClient.setQueryData(
        playlistQueryKeys.detail(createdPlaylist.playlist.id),
        createdPlaylist.playlist,
      );
    },
  });
}
