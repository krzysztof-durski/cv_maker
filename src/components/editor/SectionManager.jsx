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
      className="group flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab select-none text-lg leading-none text-gray-300 group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-400"
        title="Drag to reorder"
      >
        ⠿
      </span>
      <span className={`flex-1 text-sm ${section.enabled ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>
        {SECTION_LABELS[section.id]}
      </span>
      <input
        type="checkbox"
        checked={section.enabled}
        onChange={() => onToggle(section.id)}
        className="h-4 w-4 cursor-pointer accent-indigo-600"
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
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-750">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Sections</p>
        <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Toggle on/off · Drag to reorder</p>
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
