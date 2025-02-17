import { AvailableSlot } from './types';

interface SlotCardProps {
  slot: AvailableSlot;
  isSelected: boolean;
  onClick: () => void;
}


interface SlotCardProps {
    slot: AvailableSlot;
    isSelected: boolean;
    onClick: () => void;
  }
  
  const SlotCard = ({ slot, isSelected, onClick }: SlotCardProps) => (
    <button
      onClick={onClick}
      style={{
        padding: "10px",
        border: isSelected ? "2px solid blue" : "1px solid #ccc",
        backgroundColor: slot.is_booked ? "#f8d7da" : "#d4edda",
        cursor: slot.is_booked ? "not-allowed" : "pointer",
        color: slot.is_booked ? "#721c24" : "#155724",
      }}
      disabled={slot.is_booked}
    >
      <strong>{slot.date}</strong>
      <br />
      {slot.day} - {slot.time_slot}
      <br />
      {slot.is_booked ? "Unavailable" : "Available"}
    </button>
  );
  
  export default SlotCard;
  