import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Formdata } from '../types';

export const generatePdf = async (formData: Formdata, sections: string[]) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const pageSize: [number, number] = [595, 842]; // A4 page size in points
  const page = pdfDoc.addPage(pageSize);
  const { width, height } = page.getSize();
  const margin = 50;

  let y = height - margin;

  const drawText = (text: string, options: { 
    bold?: boolean, 
    italic?: boolean,
    size?: number, 
    x?: number,
    color?: [number, number, number],
    lineSpacing?: number
  } = {}) => {
    const lineSpacing = options.lineSpacing || 1.2;
    page.drawText(text, {
      x: options.x || margin, 
      y,
      size: options.size || 10,
      font: options.bold ? boldFont : (options.italic ? italicFont : font),
      color: rgb(...(options.color || [0, 0, 0])),
    });
    y -= (options.size || 10) * lineSpacing;
  };

  const drawLine = () => {
    page.drawLine({
      start: { x: margin, y: y + 5 },
      end: { x: width - margin, y: y + 5 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    y -= 8;
  };

  const drawSection = (title: string, content: any) => {
    if (content && (Array.isArray(content) ? content.length > 0 : Object.keys(content).length > 0)) {
      y -= 5; // Add space before each section
      drawText(title, { bold: true, size: 16, color: [0, 0.5, 0.5], lineSpacing: 1 });
      drawLine();
      
      if (Array.isArray(content)) {
        content.forEach((item, index) => {
          if (index > 0) y -= 5; // Add space between items in a section
          let datesDrawn = false; // Flag to track if dates have been drawn
          Object.entries(item).forEach(([key, value]) => {
            if (value) {
              if (key === 'responsibilities' || key === 'achievements') {
                drawText(key.charAt(0).toUpperCase() + key.slice(1) + ':', { bold: true, size: 10, lineSpacing: 1.3 });
                (value as string[]).forEach(point => {
                  drawText(`• ${point}`, { size: 9, lineSpacing: 1.2 });
                });
              } else if (key === 'institutionName' || key === 'companyName' || key === 'projectName' || key === 'certificationName') {
                drawText(`${value}`, { bold: true, size: 12, lineSpacing: 1.3 });
              } else if (key === 'startDate' || key === 'endDate') {
                // Only draw dates once for the whole item
                if (!datesDrawn) {
                  const startDate = item.startDate || '';
                  const endDate = item.endDate || '';
                  drawText(`${startDate} - ${endDate}`, { italic: true, size: 9, lineSpacing: 1.2 });
                  datesDrawn = true; // Set flag to true after drawing
                }
              } else {
                drawText(`${value}`, { size: 10, lineSpacing: 1.2 });
              }
            }
          });
        });
      } else if (typeof content === 'object') {
        Object.entries(content).forEach(([key, value]) => {
          if (value) {
            drawText(`${key}: ${value}`, { size: 10, lineSpacing: 1.2 });
          }
        });
      } else if (typeof content === 'string') {
        drawText(content, { size: 10, lineSpacing: 1.2 });
      }
      
      y -= 5; // Add space after each section
    }
  };

  // Personal Details
  if (formData.personaldetails && sections.includes('personaldetails')) {
    const { firstname, lastname,summary, ...rest } = formData.personaldetails;
    drawText(`${firstname} ${lastname}`, { bold: true, size: 28, color: [0, 0.5, 0.5], lineSpacing: 1, x: margin + 30 });
    
    const contactInfo = Object.values(rest).filter(Boolean);
    drawText(contactInfo.join(' • '), { size: 10, lineSpacing: 1 });
    y -= 5; // Add extra space after personal details

    drawSection("Summary",`${summary}`)
  }

  // Draw other sections based on the provided order
  sections.forEach(section => {
    if (section !== 'personaldetails' && formData[section as keyof Formdata]) {
      const sectionData = formData[section as keyof Formdata];
      if (Array.isArray(sectionData) ? sectionData.length > 0 : Object.keys(sectionData).length > 0) {
        drawSection(section.charAt(0).toUpperCase() + section.slice(1), sectionData);
      }
    }
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
