import { Formdata } from "../types";

class ParseDataManager {
  private static readonly patterns = {
    name: /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/,
    email: /([\w.-]+@[\w.-]+\.[a-zA-Z]{2,})/,
    phone: /(\+?\d[\d\s-]{8,})/,
    github: /github\.com\/(\S+)/i,
    linkedin: /linkedin\.com\/(?:in|profile)\/(\S+)/i,
    twitter: /(?:twitter\.com|x\.com)\/(\S+)/i,
    portfolio: /(?:Portfolio|Website):\s*(https?:\/\/\S+)/i,
    summary: /Summary([\s\S]*?)(?:\n\s*\n|\n(?=[A-Z]))/i,
    education: /(?:Education|University|College)([\s\S]*?)(?:\n\s*\n|\n(?=[A-Z][a-z]+:))/i,
    experience: /(?:Experience|Work|Employment)([\s\S]*?)(?:\n\s*\n|\n(?=[A-Z][a-z]+:))/i,
    skills: /(?:Skills|Technical Skills)([\s\S]*?)(?:\n\s*\n|\n(?=[A-Z][a-z]+:))/i,
    projects: /(?:Projects|Personal Projects)([\s\S]*?)(?:\n\s*\n|\n(?=[A-Z][a-z]+:))/i,
    certifications: /(?:Certifications|Certificates)([\s\S]*?)(?:\n\s*\n|\n(?=[A-Z][a-z]+:))/i,
    languages: /(?:Languages|Language Proficiency)([\s\S]*?)(?:\n\s*\n|\n(?=[A-Z][a-z]+:))/i,
  };

  static async parseData(textItems: string): Promise<{ data?: Formdata }> {
    const formData: Formdata = {
      personaldetails: {},
      education: [],
      experience: [],
      skills: [],
      certifications: [],
      projects: [],
      languages: [],
    };

    Object.entries(this.patterns).forEach(([key, pattern]) => {
      const match = textItems.match(pattern);
      if (match) {
        switch (key) {
          case 'name':
            const [firstName, ...lastNameParts] = match[1].split(' ');
            formData.personaldetails!.firstname = firstName;
            formData.personaldetails!.lastname = lastNameParts.join(' ');
            break;
          case 'email':
            formData.personaldetails!.email = match[1];
            break;
          case 'phone':
            formData.personaldetails!.phoneno = match[1];
            break;
          case 'github':
            formData.personaldetails!.github = match[1];
            break;
          case 'linkedin':
            formData.personaldetails!.linkedin = match[1];
            break;
          case 'portfolio':
            formData.personaldetails!.portfolio = match[1];
            break;
          case 'summary':
            formData.personaldetails!.summary = match[1].trim();
            break;
          case 'education':
            formData.education = this.parseEducation(match[1]);
            break;
          case 'experience':
            formData.experience = this.parseExperience(match[1]);
            break;
          case 'skills':
            formData.skills = this.parseSkills(match[1]);
            break;
          case 'projects':
            formData.projects = this.parseProjects(match[1]);
            break;
          case 'certifications':
            formData.certifications = this.parseCertifications(match[1]);
            break;
          case 'languages':
            formData.languages = this.parseLanguages(match[1]);
            break;
        }
      }
    });

    return Object.keys(formData).some(key => 
      Array.isArray(formData[key as keyof Formdata]) 
        ? (formData[key as keyof Formdata] as any[]).length > 0
        : Object.keys(formData[key as keyof Formdata] || {}).length > 0
    ) ? { data: formData } : {};
  }

  private static parseEducation(text: string): Formdata['education'] {
    const educationEntries = text.split(/\n(?=\S)/);
    return educationEntries.map(entry => {
      const [institutionName, ...details] = entry.split('\n');
      const degreeMatch = details.join(' ').match(/([^\d]+)/);
      const dateMatch = details.join(' ').match(/(\d{4})\s*[–-]\s*(\d{4}|Present)/);
      return {
        institutionName: institutionName.trim(),
        degree: degreeMatch ? degreeMatch[1].trim() : undefined,
        startDate: dateMatch ? dateMatch[1] : undefined,
        endDate: dateMatch ? dateMatch[2] : undefined,
      };
    });
  }

  private static parseExperience(text: string): Formdata['experience'] {
    const experienceEntries = text.split(/\n(?=\S)/);
    return experienceEntries.map(entry => {
      const [companyAndTitle, ...details] = entry.split('\n');
      const [companyName, jobTitle] = companyAndTitle.split(/[-–]/);
      const dateMatch = details.join(' ').match(/(\d{4})\s*[–-]\s*(\d{4}|Present)/);
      return {
        companyName: companyName ? companyName.trim() : undefined,
        jobTitle: jobTitle ? jobTitle.trim() : undefined,
        startDate: dateMatch ? dateMatch[1] : undefined,
        endDate: dateMatch ? dateMatch[2] : undefined,
        responsibilities: details.filter(d => d.trim().length > 0),
      };
    });
  }

  private static parseSkills(text: string): string[] {
    return text.split(/[,\n]/).map(skill => skill.trim()).filter(skill => skill.length > 0);
  }

  private static parseProjects(text: string): Formdata['projects'] {
    const projectEntries = text.split(/\n(?=\S)/);
    return projectEntries.map(entry => {
      const [projectName, ...details] = entry.split('\n');
      const dateMatch = details.join(' ').match(/(\w+\s+\d{4})\s*[–-]\s*(\w+\s+\d{4}|Present)/);
      return {
        projectName: projectName.trim(),
        description: details.join(' ').trim(),
        startDate: dateMatch ? dateMatch[1] : undefined,
        endDate: dateMatch ? dateMatch[2] : undefined,
      };
    });
  }

  private static parseCertifications(text: string): Formdata['certifications'] {
    const certificationEntries = text.split(/\n(?=\S)/);
    return certificationEntries.map(entry => {
      const [certificationName, ...details] = entry.split('\n');
      const dateMatch = details.join(' ').match(/(\w+\s+\d{4})/);
      return {
        certificationName: certificationName.trim(),
        issuingOrganization: details[0] ? details[0].trim() : undefined,
        issueDate: dateMatch ? dateMatch[1] : undefined,
      };
    });
  }

  private static parseLanguages(text: string): Formdata['languages'] {
    return text.split(/[,\n]/).map(lang => {
      const [language, proficiency] = lang.split(/[-–]/);
      return {
        language: language ? language.trim() : undefined,
        proficiency: proficiency ? proficiency.trim() as any : undefined,
      };
    }).filter(lang => lang.language);
  }
}

export default ParseDataManager;