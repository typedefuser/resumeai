import React, { useEffect, useCallback } from 'react';
import { FORM_SECTIONS, FormviewProps, SUBTYPE_FIELDS, Formdata } from '../types';
import { Button } from './ui/button';
import { DatePicker } from './DatePicker'


const Formview: React.FC<FormviewProps> = ({ formdata, onFormChange, generatePDF }) => {
  useEffect(() => {
    generatePDF(formdata);
  }, [formdata, generatePDF]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field, index] = name.split('.');

    if (section in formdata) {
      const newFormData: Formdata = {
        ...formdata,
        [section]: Array.isArray(formdata[section])
          ? formdata[section].map((item, i) => i === parseInt(index) ? { ...item, [field]: value } : item)
          : { ...formdata[section], [field]: value },
      };
      onFormChange(newFormData);
    }
  }, [formdata, onFormChange]);

  const handleAddInstance = useCallback((section: string) => {
    const newFormData: Formdata = {
      ...formdata,
      [section]: [...(formdata[section] || []), {}],
    };
    onFormChange(newFormData);
  }, [formdata, onFormChange]);

  const handleDeleteInstance = useCallback((section: string) => {
    const newFormData: Formdata = {
      ...formdata,
      [section]: formdata[section].slice(0, -1),
    };
    onFormChange(newFormData);
  }, [formdata, onFormChange]);

  const handleDateChange = useCallback((date: Date | null, name: string) => {
    const [section, field, index] = name.split('.');
    const formattedDate = date ? date.toISOString().split('T')[0] : '';

    if (section in formdata) {
      const newFormData: Formdata = {
        ...formdata,
        [section]: Array.isArray(formdata[section])
          ? formdata[section].map((item, i) => i === parseInt(index) ? { ...item, [field]: formattedDate } : item)
          : { ...formdata[section], [field]: formattedDate },
      };
      onFormChange(newFormData);
    }
  }, [formdata, onFormChange]);

  const renderInputs = useCallback((section: string) => {
    const fields = SUBTYPE_FIELDS[section] || [];
    const sectionData = formdata[section] || [];

    if (Array.isArray(sectionData)) {
      return sectionData.map((item, index) => (
        <div key={`${section}-${index}`} className="mb-4">
          {fields.map(({ name, placeholder }) => (
            <div key={`${section}-${index}-${name}`}>
              <label htmlFor={`${section}-${index}-${name}`} className="sr-only">{placeholder}</label>
              {(section === 'education' || section === 'experience') && (name === 'startDate' || name === 'endDate') ? (
                <DatePicker
                  date={item[name] ? new Date(item[name]) : undefined}
                  onDateChange={(date) => handleDateChange(date, `${section}.${name}.${index}`)}
                />
              ) : (
                <input
                  id={`${section}-${index}-${name}`}
                  type="text"
                  name={`${section}.${name}.${index}`}
                  value={item[name] || ''}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full mb-2 p-2 bg-gray-100 text-gray-800 rounded"
                />
              )}
            </div>
          ))}
        </div>
      ));
    } else {
      return fields.map(({ name, placeholder }) => (
        <div key={`${section}-${name}`}>
          <label htmlFor={`${section}-${name}`} className="sr-only">{placeholder}</label>
          <input
            id={`${section}-${name}`}
            type="text"
            name={`${section}.${name}`}
            value={formdata[section] && name in formdata[section] ? formdata[section][name] : ''}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full mb-2 p-2 bg-gray-100 text-gray-800 rounded"
          />
        </div>
      ));
    }
  }, [formdata, handleChange, handleDateChange]);

  return (
    <div className="space-y-4">
      {FORM_SECTIONS.map((section) => (
        <div key={section} className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold text-gray-800">{section}</h2>
          {renderInputs(section)}
          {Array.isArray(formdata[section]) && (
            <><Button
              type="button"
              onClick={() => handleAddInstance(section)}
              className="mt-2 p-2 bg-blue-500 text-white rounded"
            >
              Add {section}
            </Button><Button
              type="button"
              onClick={() => handleDeleteInstance(section)}
              className="mt-2 p-2 bg-red-500 text-white rounded"
            >
                Delete {section}
              </Button></>
          )}
        </div>
      ))}
    </div>
  );
};

export default Formview;