export interface Formdata {
personaldetails?:{
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneno?: string;
    summary?: string; // A brief summary or objective statement
    linkedin?: string; // LinkedIn profile URL
    github?: string; // GitHub profile URL
    portfolio?: string; // Portfolio or personal website URL
}
    address?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    education?: Array<{
        institutionName?: string;
        degree?: string;
        fieldOfStudy?: string;
        startDate?: string; // Consider using ISO date strings
        endDate?: string;   // Consider using ISO date strings
        grade?: string;
    }>;
    experience?: Array<{
        companyName?: string;
        jobTitle?: string;
        startDate?: string; // Consider using ISO date strings
        endDate?: string;   // Consider using ISO date strings
        responsibilities?: string[];
        achievements?: string[];
    }>;
    skills?: string[]; // List of skills
    certifications?: Array<{
        certificationName?: string;
        issuingOrganization?: string;
        issueDate?: string; // Consider using ISO date strings
        expirationDate?: string; // Consider using ISO date strings
    }>;
    projects?: Array<{
        projectName?: string;
        description?: string;
        technologiesUsed?: string[];
        startDate?: string; // Consider using ISO date strings
        endDate?: string;   // Consider using ISO date strings
        link?: string; // URL to the project or portfolio
    }>;
    languages?: Array<{
        language?: string;
        proficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent';
    }>;
    [key: string]: any;
  
}


export interface FormviewProps{
    formdata:Formdata;
    onFormChange:(data:Formdata)=>void;
    onSectionsChange: (sections: string[]) => void;
}

export interface PdfViewerProps {
    pdfBytes: Uint8Array;
  }

  // Define this in a separate file or at the top of your Formview component file
export const FORM_SECTIONS: string[] = [
    'personaldetails',
    'address',
    'education',
    'experience',
    'skills',
    'certifications',
    'projects',
    'languages'
  ];
  
  export const SUBTYPE_FIELDS: Record<string, { name: string; placeholder: string }[]> = {
    personaldetails: [
      { name: 'firstname', placeholder: 'First Name' },
      { name: 'lastname', placeholder: 'Last Name' },
      { name: 'email', placeholder: 'Email' },
      { name: 'phoneno', placeholder: 'Phone Number' },
      { name: 'summary', placeholder: 'Summary' },
      { name: 'linkedin', placeholder: 'LinkedIn' },
      { name: 'github', placeholder: 'GitHub' },
      { name: 'portfolio', placeholder: 'Portfolio' }
    ],
    address: [
      { name: 'street', placeholder: 'Street' },
      { name: 'city', placeholder: 'City' },
      { name: 'state', placeholder: 'State' },
      { name: 'postalCode', placeholder: 'Postal Code' },
      { name: 'country', placeholder: 'Country' }
    ],
    education: [
      { name: 'institutionName', placeholder: 'Institution Name' },
      { name: 'degree', placeholder: 'Degree' },
      { name: 'fieldOfStudy', placeholder: 'Field of Study' },
      { name: 'startDate', placeholder: 'Start Date' },
      { name: 'endDate', placeholder: 'End Date' },
      { name: 'grade', placeholder: 'Grade' }
    ],
    experience: [
      { name: 'companyName', placeholder: 'Company Name' },
      { name: 'jobTitle', placeholder: 'Job Title' },
      { name: 'startDate', placeholder: 'Start Date' },
      { name: 'endDate', placeholder: 'End Date' },
      { name: 'responsibilities', placeholder: 'Responsibilities' },
      { name: 'achievements', placeholder: 'Achievements' }
    ],
    skills: [
      { name: 'skill', placeholder: 'Skill' }
    ],
    certifications: [
      { name: 'certificationName', placeholder: 'Certification Name' },
      { name: 'issuingOrganization', placeholder: 'Issuing Organization' },
      { name: 'issueDate', placeholder: 'Issue Date' },
      { name: 'expirationDate', placeholder: 'Expiration Date' }
    ],
    projects: [
      { name: 'projectName', placeholder: 'Project Name' },
      { name: 'description', placeholder: 'Description' },
      { name: 'technologiesUsed', placeholder: 'Technologies Used' },
      { name: 'startDate', placeholder: 'Start Date' },
      { name: 'endDate', placeholder: 'End Date' },
      { name: 'link', placeholder: 'Link' }
    ],
    languages: [
      { name: 'language', placeholder: 'Language' },
      { name: 'proficiency', placeholder: 'Proficiency' }
    ]
  };
  