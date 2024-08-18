import React, { useEffect, useRef, useState } from 'react';

interface PdfViewerProps {
  pdfBytes: Uint8Array;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfBytes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1); // Initial zoom scale
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isRendering = useRef(false); // Flag to track rendering state
  const isDragging = useRef(false); // Flag to track dragging state
  const startDrag = useRef<{ x: number; y: number } | null>(null); // Start position for dragging

  useEffect(() => {
    const loadPdf = async () => {
      if (isRendering.current) return; // Prevent new render if one is in progress
      isRendering.current = true; // Set rendering flag

      try {
        const pdfjsLib = (window as any).pdfjsLib;

        // Set the worker source
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';

        if (!containerRef.current || !canvasRef.current) return;

        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        const pdf = await loadingTask.promise;

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const a4Width = 210; // A4 width in mm
        const a4Height = 297; // A4 height in mm

        const a4WidthPx = (a4Width / 25.4) * 72; // Convert mm to points (1 point = 1/72 inch)
        const a4HeightPx = (a4Height / 25.4) * 72;

        // Calculate the scale factor to fit the height of the container
        const scaleFactor = containerHeight / a4HeightPx;
        const resolutionScale = 2; // Higher resolution for better quality
        const effectiveScale = scaleFactor * resolutionScale;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
          canvas.height = containerHeight;
          canvas.width = containerHeight * a4WidthPx / a4HeightPx; // Maintain aspect ratio

          // Center the canvas horizontally
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;

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

            await page.render(renderContext).promise; // Wait for the render to complete
          }
        }
      } catch (error) {
        console.error('Error rendering PDF:', error);
        setError('Failed to render PDF. Please try again.');
      } finally {
        isRendering.current = false; // Reset rendering flag
      }
    };

    loadPdf();
  }, [pdfBytes, scale]);

  const handleWheel = (event: React.WheelEvent) => {
    const newScale = Math.max(0.1, scale + event.deltaY * -0.001); // Adjust zoom factor
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

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-black"
      style={{ width: '100%', height: '80vh' }} // Adjust height as needed
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        className="relative"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          cursor: 'grab',
        }}
      >
        {/* PDF pages will be dynamically added here */}
      </canvas>
    </div>
  );
};

export default PdfViewer;
