import { useCallback, useEffect, useState } from "react";
import { api, Hotel, Room } from "../services/api";

export function useHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Hotel[]>("/hotels");
      setHotels(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return { hotels, loading, refetch: fetchHotels };
}

export function useHotel(id?: string) {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHotel = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await api.get<Hotel>(`/hotels/${id}`);
      setHotel(data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHotel();
  }, [fetchHotel]);

  return { hotel, loading, refetch: fetchHotel };
}

export async function fetchHotelRooms(hotelId: number) {
  const { data } = await api.get<Room[]>(`/hotels/${hotelId}/rooms`);
  return data;
}
