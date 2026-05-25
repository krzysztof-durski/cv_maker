import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SECTION_LABELS } from '../../utils/defaultData'

function SortableRow({ section, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 group"
    >
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-300 group-hover:text-gray-400 select-none text-lg leading-none"
        title="Drag to reorder"
      >
        ⠿
      </span>
      <span className="flex-1 text-sm text-gray-700">{SECTION_LABELS[section.id]}</span>
      <input
        type="checkbox"
        checked={section.enabled}
        onChange={() => onToggle(section.id)}
        className="h-4 w-4 accent-gray-700 cursor-pointer"
      />
    </div>
  )
}

export default function SectionManager({ sectionOrder, onChange }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.findIndex(s => s.id === active.id)
      const newIndex = sectionOrder.findIndex(s => s.id === over.id)
      onChange(arrayMove(sectionOrder, oldIndex, newIndex))
    }
  }

  const handleToggle = (id) => {
    onChange(sectionOrder.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  return (
    <div className="mb-4 border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sections</p>
        <p className="text-xs text-gray-400 mt-0.5">Toggle on/off · Drag to reorder</p>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionOrder.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="p-2">
            {sectionOrder.map(section => (
              <SortableRow key={section.id} section={section} onToggle={handleToggle} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
