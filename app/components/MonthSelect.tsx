import SlotGrid from "./SlotGrid";
import { AvailableSlot } from "./types"; // Ensure the correct path

// Define the Slot interface if it's not imported
interface Slot {
  id: number;
  date: string;
  day: string;
  time_slot: string;
  booked: boolean; // Ensure this matches what SlotGrid expects
}

interface MonthSectionProps {
  month: string;
  slots: AvailableSlot[];
  selectedSlot: AvailableSlot | null;
  onSelectSlot: (slot: AvailableSlot) => void;
}

const MonthSection = ({ month, slots, selectedSlot, onSelectSlot }: MonthSectionProps) => {
  // Convert AvailableSlot[] to Slot[]
  const transformedSlots: Slot[] = slots.map((slot) => ({
    ...slot,
    booked: slot.booked, // Convert is_booked to booked
  }));

  return (
    <div>
      <h3>{month}</h3>
      <SlotGrid slots={transformedSlots} selectedSlot={selectedSlot} onSelectSlot={onSelectSlot} />
    </div>
  );
};

export default MonthSection;
