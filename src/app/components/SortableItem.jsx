'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableItem({ id, name }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });
  
const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  padding: '12px 20px',
  marginBottom: '12px',
  backgroundColor: '#fff',
  borderRadius: '6px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: '500',
  border: '1px solid #ddd',
  width: '400px', // ✅ Add this line to reduce width
  margin: '0 auto' // ✅ Center the box
};

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {name}
      <div className="actionButtons">
        <button className="editButton">✏️</button>
        <button className="deleteButton">🗑️</button>
      </div>
    </div>
  );
}