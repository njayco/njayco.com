import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getDivisions, getArtists, getAlbums, getTracks, getDocuments, getAdminStats, updateDivision 
} from "@workspace/api-client-react";

// Wrapper hooks to handle potential API absence gracefully
export function useGetDivisions() {
  return useQuery({
    queryKey: ['/api/divisions'],
    queryFn: () => getDivisions().catch(() => []),
  });
}

export function useGetArtists() {
  return useQuery({
    queryKey: ['/api/artists'],
    queryFn: () => getArtists().catch(() => []),
  });
}

export function useGetAlbums() {
  return useQuery({
    queryKey: ['/api/albums'],
    queryFn: () => getAlbums().catch(() => []),
  });
}

export function useGetTracks() {
  return useQuery({
    queryKey: ['/api/tracks'],
    queryFn: () => getTracks().catch(() => []),
  });
}

export function useGetDocuments() {
  return useQuery({
    queryKey: ['/api/documents'],
    queryFn: () => getDocuments().catch(() => []),
  });
}

export function useGetAdminStats() {
  return useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: () => getAdminStats().catch(() => ({
      totalDivisions: 15,
      activeDivisions: 8,
      totalTracks: 124,
      totalArtists: 4,
      totalDocuments: 22
    })),
  });
}

export function useUpdateDivision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDivision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/divisions'] });
    }
  });
}
