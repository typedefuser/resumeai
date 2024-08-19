import React, { useState } from 'react';
import ParseDataManager from '../services/ParseDataManager';
import { FormviewProps } from '../types';

const Pdfupload: React.FC<FormviewProps> = ({ formdata, onFormChange }) => {
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setLoading(true);
            const fileReader = new FileReader();
            fileReader.onload = async () => {
                const typedarray = new Uint8Array(fileReader.result as ArrayBuffer);
                const pdf = await (window as any).pdfjsLib.getDocument(typedarray).promise;
                const numPages = pdf.numPages;

                let accumulatedData = { ...formdata }; 

                for (let i = 1; i <= numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const textItems = content.items.map((item: any) => item.str).join(' ');

                    try {
                        const result = await ParseDataManager.parseData(textItems);
                        if (result.data) {
                            accumulatedData = { ...accumulatedData, ...result.data };
                        } else {
                            console.log('Could not parse');
                        }
                    } catch (error) {
                        console.error('Parsing error:', error);
                    }
                }

                onFormChange(accumulatedData);
                console.log('Parsed Formdata:', accumulatedData.personaldetails);
                setLoading(false);
            };
            fileReader.readAsArrayBuffer(file);
        }
    };

    return (
        <form action="" method="post" className="flex justify-center mb-4 border-2 border-white rounded-md bg-white">
            <span className="font-black text-black">Upload file:</span>
            <input
                type="file"
                id="fileInput"
                className="text-black border-2 border-white rounded-md"
                onChange={handleFileChange}
                disabled={loading}
            />
            <p>
                {loading ? 'Processing...' : 'Download Extracted Text'}
            </p>
        </form>
    );
};

export default Pdfupload;
