import SlotGrid from './SlotGrid';
import { AvailableSlot } from './types';

interface MonthSectionProps {
  month: string;
  slots: AvailableSlot[];
  selectedSlot: AvailableSlot | null;
  onSelectSlot: (slot: AvailableSlot) => void;
}



const MonthSection = ({ month, slots, selectedSlot, onSelectSlot }: MonthSectionProps) => (
  <div>
    <h3>{month}</h3>
    <SlotGrid slots={slots} selectedSlot={selectedSlot} onSelectSlot={onSelectSlot} />
  </div>
);

export default MonthSection;
