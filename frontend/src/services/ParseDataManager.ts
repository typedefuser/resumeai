import { Formdata } from "../types";

class ParseDataManager {
  private static readonly patterns = {
    name: /\b([A-Z][a-zA-Z'-]+)\s+([A-Z][a-zA-Z'-]+)\b/,
    email: /\s*([\w.-]+@[\w.-]+\.[a-zA-Z]{2,})/,
    phone: /\s*(\+?\d[\d\s-]*)/,
    github: /\b(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-]+)\b/,
    linkedin: /\b(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|profile)\/([a-zA-Z0-9-]+)\b/,
    twitter: /\b(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)\b/,
  };

  static async parseData(textItems: string): Promise<{ data?: Formdata }> {
    const personalDetails: Formdata["personaldetails"] = {};

    Object.entries(this.patterns).forEach(([key, pattern]) => {
      const match = textItems.match(pattern);
      if (match) {
        switch (key) {
          case 'name':
            personalDetails.firstname = match[1];
            personalDetails.lastname = match[2];
            break;
          case 'email':
            personalDetails.email = match[1];
            break;
          case 'phone':
            personalDetails.phoneno = match[1];
            break;
          case 'github':
            personalDetails.github = match[1];
            console.log(match[1]);
            break;
          case 'linkedin':
            personalDetails.linkedin = match[1];
            break;
        }
      }
    });

    return Object.keys(personalDetails).length > 0
      ? { data: { personaldetails: personalDetails } }
      : {};
  }
}

export default ParseDataManager;