export interface AvailableSlot {
  id: number;
  date: string;
  day: string;
  time_slot: string;
  booked: boolean;
}

export interface TimeSlot {
  time: string;
  id: number;
}
