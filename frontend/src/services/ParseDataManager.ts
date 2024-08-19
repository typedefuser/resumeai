import { Formdata } from "../types";

const namePattern = /\b([A-Z][a-zA-Z'-]+)\s+([A-Z][a-zA-Z'-]+)\b/;
const emailPattern = /\s*([\w.-]+@[\w.-]+\.[a-zA-Z]{2,})/;
const phonePattern = /\s*(\+?\d[\d\s-]*)/;

class ParseDataManager {
  private static formData: Formdata = {};

static async parseData(textItems: string): Promise<{data?: Formdata;}> {
  const nameMatch = textItems.match(namePattern);
  const emailMatch = textItems.match(emailPattern);
  const phoneMatch = textItems.match(phonePattern);

  if (!this.formData.personaldetails) {
    this.formData.personaldetails = {};
  }

  if (nameMatch) {
    this.formData.personaldetails.firstname = nameMatch[1];
    this.formData.personaldetails.lastname = nameMatch[2];
  }
  if (emailMatch) {
    this.formData.personaldetails.email = emailMatch[1];
  }
  if (phoneMatch) {
    this.formData.personaldetails.phoneno = phoneMatch[1];
  }

  const hasData = Object.keys(this.formData.personaldetails).length > 0;

  return hasData ? { data: this.formData } : {};
  }
}


export default ParseDataManager;