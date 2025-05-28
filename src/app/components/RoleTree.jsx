'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';

import styles from '../styles/leads.module.css';


function SortableItem({ id, label }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={styles.roleCard}>
      <input
        className={styles.roleInput}
        value={label}
        onChange={(e) => {}}
        readOnly
      />
    </div>
  );
}

export default function RoleTree() {
  const [items, setItems] = useState([
    { id: '1', label: 'Managing Director' },
    { id: '2', label: 'Director' },
    { id: '3', label: 'Engineering Head' },
    { id: '4', label: 'Manager - Engineering' },
    { id: '5', label: 'Lead Engineer' },
    { id: '6', label: 'Area Engineer' },
    { id: '7', label: 'Sr. Engineer' },
    { id: '8', label: 'Trainee Engineer' },
  ]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over?.id);
      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className={styles.content}>
      <h2 className={styles.title}>Role Hierarchy</h2>
      <div className={styles.treeContainer}>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id} label={item.label} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}