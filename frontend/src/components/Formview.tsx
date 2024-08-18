import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { FORM_SECTIONS, FormviewProps, SUBTYPE_FIELDS, Formdata } from '../types';

const Formview: React.FC<FormviewProps> = ({ formdata, onFormChange, onSectionsChange }) => {
  const [sections, setSections] = useState<string[]>(FORM_SECTIONS);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newSections = Array.from(sections);
    const [reorderedSection] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, reorderedSection);

    setSections(newSections);
    onSectionsChange(newSections);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');

    if (section in formdata) {
      const newFormData: Formdata = {
        ...formdata,
        [section]: {
          ...formdata[section],
          [field]: value,
        },
      };
      onFormChange(newFormData);
    }
  };

  const renderInputs = (section: string) => {
    const fields = SUBTYPE_FIELDS[section] || [];
    return fields.map(({ name, placeholder }, index) => (
      <input
        key={`${section}-${index}`}
        type="text"
        name={`${section}.${name}`}
        value={formdata[section]?.[name] || ''}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full mb-2 p-2 bg-gray-100 text-gray-800 rounded"
      />
    ));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
            {sections.map((section, index) => (
              <Draggable key={section} draggableId={section} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`bg-white p-4 rounded-md shadow-md ${
                      snapshot.isDragging ? 'shadow-lg' : ''
                    }`}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className="flex justify-between items-center mb-2"
                    >
                      <h2 className="text-lg font-semibold text-gray-800">{section}</h2>
                      <div className="cursor-move text-gray-500">
                        ☰
                      </div>
                    </div>
                    {renderInputs(section)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Formview;