

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Formdata } from '../types';

export const generatePdf = async (formData: Formdata, sections: string[]) => {
  console.log(formData);
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pageSize: [number, number] = [595, 842]; // A4 page size in points
  let page = pdfDoc.addPage(pageSize);
  const margin = 50;
  const lineHeight = 16;
  let { width, height } = page.getSize();
  let y = height - margin;

  const addNewPageIfNeeded = () => {
    if (y < margin) {
      page = pdfDoc.addPage(pageSize);
      y = height - margin;
    }
  };

  const drawText = (text: string, options: { bold?: boolean, size?: number, x?: number } = {}) => {
    addNewPageIfNeeded();
    page.drawText(text, {
      x: options.x || margin,
      y,
      size: options.size || 10,
      font: options.bold ? boldFont : font,
      color: rgb(0, 0, 0),
    });
    y -= lineHeight;
  };

  const drawLine = () => {
    addNewPageIfNeeded();
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    y -= lineHeight;
  };

  const addSection = (section: string) => {
    switch (section) {
      case 'personaldetails':
        if (formData.personaldetails) {
          const { firstname, lastname, email, phoneno, linkedin, github, portfolio, summary } = formData.personaldetails;
          if (firstname || lastname) {
            drawText(`${firstname || ''} ${lastname || ''}`.toUpperCase(), { bold: true, size: 24 });
            y -= lineHeight;
          }
          const contactInfo = [email, phoneno, linkedin, github, portfolio].filter(Boolean).join(' • ');
          drawText(contactInfo, { size: 10 });
          y -= lineHeight;
          
          if (summary) {
            drawText('SUMMARY', { bold: true, size: 14 });
            drawLine();
            drawText(summary);
            y -= lineHeight;
          }
        }
        break;

      case 'education':
        if (formData.education && formData.education.length > 0) {
          drawText('EDUCATION', { bold: true, size: 14 });
          drawLine();
          formData.education.forEach(edu => {
            const { institutionName, degree, startDate, endDate, fieldOfStudy, grade } = edu;
            if (degree) drawText(degree, { bold: true });
            if (institutionName) drawText(institutionName);
            if (startDate && endDate) drawText(`${startDate} - ${endDate}`);
            if (fieldOfStudy) drawText(`Field of Study: ${fieldOfStudy}`);
            if (grade) drawText(`Grade: ${grade}`);
            y -= lineHeight;
          });
        }
        break;

      case 'skills':
        if (formData.skills && formData.skills.length > 0) {
          drawText('SKILLS', { bold: true, size: 14 });
          drawLine();
          console.log(formData.skills);
          drawText(formData.skills.join(', '));
          y -= lineHeight;
        }
        break;

      case 'experience':
        if (formData.experience && formData.experience.length > 0) {
          drawText('EXPERIENCE', { bold: true, size: 14 });
          drawLine();
          formData.experience.forEach(exp => {
            if (exp.companyName) drawText(exp.companyName, { bold: true });
            if (exp.jobTitle) drawText(exp.jobTitle);
            if (exp.startDate && exp.endDate) drawText(`${exp.startDate} - ${exp.endDate}`);
            if (exp.responsibilities) {
              exp.responsibilities.forEach(resp => drawText(`• ${resp}`));
            }
            if (exp.achievements) {
              exp.achievements.forEach(ach => drawText(`• ${ach}`));
            }
            y -= lineHeight;
          });
        }
        break;

      case 'projects':
        if (formData.projects && formData.projects.length > 0) {
          drawText('PROJECTS', { bold: true, size: 14 });
          drawLine();
          formData.projects.forEach(project => {
            if (project.projectName) drawText(project.projectName, { bold: true });
            if (project.description) drawText(project.description);
            if (project.technologiesUsed) drawText(` ${project.technologiesUsed}`);
            if (project.startDate && project.endDate) drawText(`${project.startDate} - ${project.endDate}`);
            if (project.link) drawText(`Link: ${project.link}`);
            y -= lineHeight;
          });
        }
        break;

      case 'certifications':
        if (formData.certifications && formData.certifications.length > 0) {
          drawText('CERTIFICATIONS', { bold: true, size: 14 });
          drawLine();
          formData.certifications.forEach(cert => {
            if (cert.certificationName) drawText(cert.certificationName, { bold: true });
            if (cert.issuingOrganization) drawText(cert.issuingOrganization);
            if (cert.issueDate) drawText(cert.issueDate);
            y -= lineHeight;
          });
        }
        break;

      case 'languages':
        if (formData.languages && formData.languages.length > 0) {
          drawText('LANGUAGES', { bold: true, size: 14 });
          drawLine();
          formData.languages.forEach(lang => {
            if (lang.language || lang.proficiency) {
              drawText(lang.language || '', { bold: true });
              drawText(lang.proficiency || '', { bold: true });
            }
          });
          y -= lineHeight;
        }
        break;
    }
  };

  sections.forEach(section => addSection(section));

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};