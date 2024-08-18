import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Formdata } from '../types';

export const generatePdf = async (formData: Formdata, sections: string[]) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const pageSize: [number, number] = [595, 842]; // A4 page size in points
  let page = pdfDoc.addPage(pageSize);
  const margin = 50;
  const lineHeight = 20;
  let { height } = page.getSize();
  let y = height - margin;

  const addNewPageIfNeeded = () => {
    if (y < margin) {
      page = pdfDoc.addPage(pageSize);
      y = height - margin;
    }
  };

  const drawText = (text: string) => {
    addNewPageIfNeeded();
    page.drawText(text, {
      x: margin,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    y -= lineHeight;
  };

  const addSection = (section: string) => {
    if (section === 'personaldetails' && formData.personaldetails) {
      const { firstname, lastname, email, phoneno, summary, linkedin, github, portfolio } = formData.personaldetails;
      if (firstname || lastname) drawText(`${firstname || ''} ${lastname || ''}`);
      if (email) drawText(`Email: ${email}`);
      if (phoneno) drawText(`Phone Number: ${phoneno}`);
      if (summary) drawText(`Summary: ${summary}`);
      if (linkedin) drawText(`LinkedIn: ${linkedin}`);
      if (github) drawText(`GitHub: ${github}`);
      if (portfolio) drawText(`Portfolio: ${portfolio}`);
    }

    if (section === 'address' && formData.address) {
      const { street, city, state, postalCode, country } = formData.address;
      const addressLines = [street, city, state, postalCode, country].filter(line => line).join(', ');
      if (addressLines) drawText(`Address: ${addressLines}`);
    }

    // Add more sections as needed
  };

  sections.forEach(section => addSection(section));

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
