
import { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from 'react-router-dom';
import { generatePdf } from '../services/pdfGenerator';
import { getResumebyResumeId as fetchResumeData } from '../services/apiservices/resumeService';
import { Formdata,convertNullToEmptyString  } from "../types";

interface ChatMessage {
  type: 'user' | 'response' | 'stream' | 'error' | 'streamComplete' | 'info';
  content: string;
}

const Formview = lazy(() => import("../components/Formview"));
const Navbar = lazy(() => import("../components/Navbar"));
const PdfViewer = lazy(() => import("../components/PdfViewer"));
const Pdfupload = lazy(() => import("../components/Pdfupload"));
const Chat = lazy(() => import("./Chat"));

const Home = (): JSX.Element => {
  const router = useParams();
  const [formData, setFormData] = useState<Formdata>({
    personalDetails: { firstname: '', lastname: '', email: '', phoneno: '', summary: '', linkedin: '', github: '', portfolio: '' },
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
    'personalDetails',
    'address',
    'education',
    'experience',
    'skills',
    'certifications',
    'projects',
    'languages',
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchResumeDetails = async () => {
      if (!router.resumeId)
          return
        setIsLoading(true);
        try {
          const data = await fetchResumeData(router.resumeId);
          const processeddata=convertNullToEmptyString(data)
          console.log(processeddata as Formdata)
          setFormData(processeddata as FormData);
        } catch (error) {
          console.error("Failed to fetch resume data:", error);
        }
        setIsLoading(false);
      
    };

    fetchResumeDetails();
    
  }, [router.resumeId]);

  useEffect(() => {
    const fetchPdf = async () => {
      const bytes = await generatePdf(formData, sections);
      setPdfBytes(bytes);
    };

    fetchPdf();
  }, [formData, sections,isLoading]);

  if (isLoading) {
    return <div>Loading resume data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </div>
  );
};

export default Home;