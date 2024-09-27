import React, { useEffect, useCallback } from 'react';
import { FORM_SECTIONS, FormviewProps, SUBTYPE_FIELDS, Formdata } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DatePicker } from './DatePicker';
import { Textarea } from '../components/ui/textarea';


const getInputWidth = (name: string): string => {
  const shortInputs = ['firstname', 'lastname', 'email', 'phoneno'];
  const mediumInputs = ['linkedin', 'github', 'portfolio'];
  
  if (shortInputs.includes(name)) return 'w-full sm:w-1/2 lg:w-1/4';
  if (mediumInputs.includes(name)) return 'w-full sm:w-1/2';
  return 'w-full';
};
const Formview: React.FC<FormviewProps> = ({ formdata, onFormChange, generatePDF }) => {
  useEffect(() => {
    generatePDF(formdata);
  }, [formdata, generatePDF]);

  const handleChange = useCallback((name: string, value: string) => {
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
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionData.map((item, index) => (
            <Card key={`${section}-${index}`} className="mb-4">
              <CardContent className="p-4">
                {fields.map(({ name, placeholder }) => (
                  <div key={`${section}-${index}-${name}`} className={`mb-2 ${getInputWidth(name)}`}>
                    {(name === 'startDate' || name === 'endDate') ? (
                    <DatePicker
                    date={item[name] ? new Date(item[name]) : undefined}
                    setDate={(date) => handleDateChange(date === undefined ? null : date, `${section}.${name}.${index}`)} // Convert undefined to null
                    placeholder='Pick a date'
                  />
                    ) : name === 'proficiency' ? (
                      <Select
                        onValueChange={(value) => handleChange(`${section}.${name}.${index}`, value)}
                        defaultValue={item[name] || ''}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {['Beginner', 'Intermediate', 'Advanced', 'Fluent'].map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : ['responsibilities', 'achievements', 'description'].includes(name) ? (
                      <Textarea
                        id={`${section}-${index}-${name}`}
                        name={`${section}.${name}.${index}`}
                        value={item[name] || ''}
                        onChange={(e) => handleChange(`${section}.${name}.${index}`, e.target.value)}
                        placeholder={placeholder}
                        className="min-h-[100px]"
                      />
                    ) : (
                      <Input
                        id={`${section}-${index}-${name}`}
                        name={`${section}.${name}.${index}`}
                        value={item[name] || ''}
                        onChange={(e) => handleChange(`${section}.${name}.${index}`, e.target.value)}
                        placeholder={placeholder}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }else {
      return fields.map(({ name, placeholder }) => (
        <div key={`${section}-${name}`} className={`mb-4 ${getInputWidth(name)}`}>
          {['summary'].includes(name) ? (
            <Textarea
              id={`${section}-${name}`}
              name={`${section}.${name}`}
              value={formdata[section] && name in formdata[section] ? formdata[section][name] : ''}
              onChange={(e) => handleChange(`${section}.${name}`, e.target.value)}
              placeholder={placeholder}
              className="min-h-[100px]"
            />
          ) : (
            <Input
              id={`${section}-${name}`}
              name={`${section}.${name}`}
              value={formdata[section] && name in formdata[section] ? formdata[section][name] : ''}
              onChange={(e) => handleChange(`${section}.${name}`, e.target.value)}
              placeholder={placeholder}
            />
          )}
        </div>
      ));
    }
  }, [formdata, handleChange, handleDateChange]);

  return (
    <div className="space-y-4">
      {FORM_SECTIONS.map((section) => (
        <Card key={section}>
          <CardHeader className="pb-2">
            <CardTitle>{section.charAt(0).toUpperCase() + section.slice(1)}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderInputs(section)}
            {Array.isArray(formdata[section]) && (
              <div className="flex space-x-2 mt-4">
                <Button
                  onClick={() => handleAddInstance(section)}
                  variant="outline"
                  size="sm"
                >
                  Add {section}
                </Button>
                <Button
                  onClick={() => handleDeleteInstance(section)}
                  variant="destructive"
                  size="sm"
                >
                  Delete {section}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Formview;