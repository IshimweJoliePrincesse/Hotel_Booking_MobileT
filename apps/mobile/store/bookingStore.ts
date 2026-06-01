import { create } from "zustand";
import { Booking } from "../services/api";

interface BookingState {
  selectedBooking: Booking | null;
  setSelectedBooking: (booking: Booking | null) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedBooking: null,
  setSelectedBooking: (booking) => set({ selectedBooking: booking })
}));
