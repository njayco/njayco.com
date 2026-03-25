import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Division, Artist, Album, Track, Document, AdminStats, DivisionUpdate } from "@workspace/api-client-react";
import { 
  getDivisions, getArtists, getAlbums, getTracks, getDocuments, getAdminStats, updateDivision 
} from "@workspace/api-client-react";

export function useGetDivisions() {
  return useQuery<Division[]>({
    queryKey: ['/api/divisions'],
    queryFn: () => getDivisions().catch((): Division[] => []),
  });
}

export function useGetArtists() {
  return useQuery<Artist[]>({
    queryKey: ['/api/artists'],
    queryFn: () => getArtists().catch((): Artist[] => []),
  });
}

export function useGetAlbums() {
  return useQuery<Album[]>({
    queryKey: ['/api/albums'],
    queryFn: () => getAlbums().catch((): Album[] => []),
  });
}

export function useGetTracks() {
  return useQuery<Track[]>({
    queryKey: ['/api/tracks'],
    queryFn: () => getTracks().catch((): Track[] => []),
  });
}

export function useGetDocuments() {
  return useQuery<Document[]>({
    queryKey: ['/api/documents'],
    queryFn: () => getDocuments().catch((): Document[] => []),
  });
}

export function useGetAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    queryFn: () => getAdminStats().catch((): AdminStats => ({
      totalDivisions: 0,
      activeDivisions: 0,
      totalTracks: 0,
      totalArtists: 0,
      totalDocuments: 0
    })),
  });
}

export function useUpdateDivision() {
  const queryClient = useQueryClient();
  const adminToken = import.meta.env.VITE_ADMIN_TOKEN as string | undefined;
  return useMutation<Division, Error, DivisionUpdate>({
    mutationFn: (data: DivisionUpdate) => updateDivision(data, {
      headers: adminToken ? { 'x-admin-token': adminToken } : {},
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/divisions'] });
    }
  });
}
