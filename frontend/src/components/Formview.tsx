import React from 'react';
import { FORM_SECTIONS, FormviewProps, SUBTYPE_FIELDS, Formdata } from '../types';

const Formview: React.FC<FormviewProps> = ({ formdata, onFormChange }) => {
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
    <div className="space-y-4">
      {FORM_SECTIONS.map((section) => (
        <div key={section} className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold text-gray-800">{section}</h2>
          {renderInputs(section)}
        </div>
      ))}
    </div>
  );
};

export default Formview;