import { useEffect, useState } from "react";
import Formview from "../components/Formview";
import Navbar from "../components/Navbar";
import PdfViewer from "../components/PdfViewer";
import { generatePdf } from '../components/pdfGenerator';
import { Formdata } from "../types";

const Home = (): JSX.Element => {
  const [formData, setFormData] = useState<Formdata>({
    personaldetails: { firstname: '', lastname: '', email: '', phoneno: '', summary: '', linkedin: '', github: '', portfolio: '' },
    address: { street: '', city: '', state: '', postalCode: '', country: '' },
    education: [],
    experience: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
  });
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [view, setView] = useState(true);
  const [sections, setSections] = useState<string[]>([
    'personaldetails',
    'address',
    'education',
    'experience',
    'skills',
    'certifications',
    'projects',
    'languages',
  ]);

  const handleView = () => {
    setView(!view);
  };

  const handleFormChange = (data: Formdata) => {
    setFormData(data);
  };

  const handleSectionsChange = (newSections: string[]) => {
    setSections(newSections);
  };

  useEffect(() => {
    const fetchPdf = async () => {
      const bytes = await generatePdf(formData, sections);
      setPdfBytes(bytes);
    };

    fetchPdf();
  }, [formData, sections]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <main className="pt-20 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Create and View PDF</h1>
        {view ? (
          <Formview formdata={formData} onFormChange={handleFormChange} onSectionsChange={handleSectionsChange} />
        ) : (pdfBytes ? (
          <PdfViewer pdfBytes={pdfBytes} />
        ) : (
          <p>Generating PDF...</p>
        ))}
        <button onClick={handleView} className="bg-green-400 rounded-sm p-2 ml-72 mt-5">View PDF</button>
      </main>
    </div>
  );
};

export default Home;
