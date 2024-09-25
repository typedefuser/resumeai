import { useEffect, useState } from "react";
import Formview from "../components/Formview";
import Navbar from "../components/Navbar";
import PdfViewer from "../components/PdfViewer";
import { generatePdf } from '../services/pdfGenerator';
import { Formdata } from "../types";
import Pdfupload from "../components/Pdfupload";
import Chat from "./Chat";

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
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col relative">
        <h1 className="text-3xl font-bold mb-4">Create and View PDF</h1>
        {view ? (
          <>
            <Pdfupload formdata={formData} onFormChange={handleFormChange} onSectionsChange={handleSectionsChange} generatePDF={(formData) => generatePdf(formData, sections)}/>
            <Formview formdata={formData} onFormChange={handleFormChange} onSectionsChange={handleSectionsChange} generatePDF={(formData) => generatePdf(formData, sections)} />
          </>
        ) : (pdfBytes ? (
          <div className="flex flex-row h-[calc(100vh-180px)]">
            <div className="w-1/2 pr-2 h-full overflow-auto">
              <Chat />
            </div>
            <div className="w-1/2 pl-2 h-full">
              <PdfViewer pdfBytes={pdfBytes} />
            </div>
          </div>
        ) : (
          <p>Generating PDF...</p>
        ))}
        <button 
          onClick={handleView} 
          className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded fixed bottom-8 right-8 z-10"
        >
          {view ? "View PDF" : "Edit Resume"}
        </button>
      </main>
    </div>
  );
};

export default Home;
