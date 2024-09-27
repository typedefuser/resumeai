import { useEffect, useState } from "react";
import Formview from "../components/Formview";
import Navbar from "../components/Navbar";
import PdfViewer from "../components/PdfViewer";
import { generatePdf } from '../services/pdfGenerator';
import { Formdata } from "../types";
import Pdfupload from "../components/Pdfupload";
import Chat from "./Chat";

interface ChatMessage {
  type: 'user' | 'response' | 'stream' | 'error' | 'streamComplete' | 'info';
  content: string;
}

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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const handleView = () => {
    setView(!view);
  };

  const handleFormChange = (data: Formdata) => {
    setFormData(data);
  };

  const handleSectionsChange = (newSections: string[]) => {
    setSections(newSections);
  };

  const handleChatMessages = (newMessages: ChatMessage[]) => {
    setChatMessages(newMessages);
  };

  useEffect(() => {
    const fetchPdf = async () => {
      const bytes = await generatePdf(formData, sections);
      setPdfBytes(bytes);
    };

    fetchPdf();
  }, [formData, sections]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col relative">
        {view ? (
          <>
            <Pdfupload formdata={formData} onFormChange={handleFormChange} onSectionsChange={handleSectionsChange} generatePDF={(formData) => generatePdf(formData, sections)}/>
            <Formview formdata={formData} onFormChange={handleFormChange} onSectionsChange={handleSectionsChange} generatePDF={(formData) => generatePdf(formData, sections)} />
          </>
        ) : (
          <div className="flex flex-col md:flex-row h-[calc(100vh-120px)] bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
              <Chat messages={chatMessages} onMessagesChange={handleChatMessages} />
            </div>
            <div className="w-full md:w-1/2 h-1/2 md:h-full border-t md:border-t-0 md:border-l border-gray-200">
              {pdfBytes ? (
                <PdfViewer pdfBytes={pdfBytes} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Generating PDF...</p>
                </div>
              )}
            </div>
          </div>
        )}
        <button 
          onClick={handleView} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full fixed bottom-8 right-8 z-10 shadow-lg transition-colors duration-200"
        >
          {view ? "View PDF" : "Edit Resume"}
        </button>
      </main>
    </div>
  );
};

export default Home;