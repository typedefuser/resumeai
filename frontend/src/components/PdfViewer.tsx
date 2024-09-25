import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize, Download } from 'lucide-react';

interface ToolbarButtonProps {
  icon: React.ElementType;
  onClick: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-200"
  >
    <Icon size={18} color="white" />
  </button>
);

interface PdfViewerProps {
  pdfBytes: Uint8Array | null;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfBytes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [_, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(0.75);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isRendering = useRef(false);
  const isDragging = useRef(false);
  const startDrag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      if (!pdfBytes || isRendering.current) return;
      isRendering.current = true;

      try {
        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';

        if (!containerRef.current || !canvasRef.current) return;

        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        const pdf = await loadingTask.promise;

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const a4Width = 210;
        const a4Height = 297;

        const a4WidthPx = (a4Width / 25.4) * 72;
        const a4HeightPx = (a4Height / 25.4) * 72;

        const scaleFactor = containerHeight / a4HeightPx;
        const resolutionScale = 2;
        const effectiveScale = scaleFactor * resolutionScale * scale;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
          canvas.height = containerHeight;
          canvas.width = containerHeight * a4WidthPx / a4HeightPx;

          const canvasWidth = canvas.width;
          const containerCenterX = containerWidth / 2;
          const contentCenterX = canvasWidth / 2;

          setOffset({ x: containerCenterX - contentCenterX, y: 0 });

          context.clearRect(0, 0, canvas.width, canvas.height);

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: effectiveScale });

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport,
            };

            await page.render(renderContext).promise;
          }
        }
      } catch (error) {
        console.error('Error rendering PDF:', error);
        setError('Failed to render PDF. Please try again.');
      } finally {
        isRendering.current = false;
      }
    };

    loadPdf();
  }, [pdfBytes, scale]);

  const handleWheel = (event: React.WheelEvent) => {
    const newScale = Math.max(0.1, scale + event.deltaY * -0.001);
    setScale(newScale);
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    isDragging.current = true;
    startDrag.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging.current || !startDrag.current || !canvasRef.current) return;

    const dx = event.clientX - startDrag.current.x;
    const dy = event.clientY - startDrag.current.y;

    setOffset(prevOffset => ({
      x: prevOffset.x + dx,
      y: prevOffset.y + dy,
    }));

    startDrag.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    startDrag.current = null;
  };

  const handleZoomIn = () => setScale(prevScale => Math.min(prevScale + 0.1, 3));
  const handleZoomOut = () => setScale(prevScale => Math.max(prevScale - 0.1, 0.1));
  const handleReset = () => {
    setScale(0.75);
    setOffset({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    if (!pdfBytes) return;
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-black shadow-lg overflow-hidden">
      {pdfBytes ? (
        <>
          <div
            ref={containerRef}
            className="flex-grow relative bg-black overflow-hidden"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              className="absolute transition-transform duration-100 ease-out"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: '0 0',
                cursor: isDragging.current ? 'grabbing' : 'grab',
              }}
            />
          </div>
          <div className="flex items-center justify-center space-x-2 bg-gray-900 p-2">
            <ToolbarButton icon={ZoomIn} onClick={handleZoomIn} />
            <ToolbarButton icon={ZoomOut} onClick={handleZoomOut} />
            <ToolbarButton icon={Maximize} onClick={handleReset} />
            <ToolbarButton icon={Download} onClick={handleDownload} />
            <span className="text-white">Zoom: {(scale * 100).toFixed(0)}%</span>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-white">
          No PDF loaded
        </div>
      )}
    </div>
  );
};

export default PdfViewer;