import React, { useState, useEffect, useRef } from 'react';

const PDFViewer = ({ pdfUrl }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);
  const viewerContainerRef = useRef(null);

  // Check if PDF URL is valid and attempt to load the document
  useEffect(() => {
    if (!pdfUrl) {
      setError("No PDF URL provided");
      setLoading(false);
      return;
    }

    // For blob URLs, we can't do a HEAD request, so just set loading to false
    if (pdfUrl.startsWith('blob:')) {
      setLoading(false);
      return;
    }

    // For regular URLs, check if the PDF exists
    const checkPdfExists = async () => {
      try {
        const response = await fetch(pdfUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`PDF not found (${response.status})`);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error checking PDF:", err);
        // For blob URLs or other errors, still try to load the PDF
        setLoading(false);
      }
    };

    checkPdfExists();
  }, [pdfUrl]);

  // Navigation functions
  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => {
      const newPage = prevPageNumber + offset;
      // Prevent going below page 1
      if (newPage < 1) return 1;
      // If we know total pages, prevent going beyond
      if (totalPages && newPage > totalPages) return totalPages;
      return newPage;
    });
  };

  const goToPage = (page) => {
    if (!page || isNaN(page)) return;
    
    const pageNum = parseInt(page, 10);
    if (pageNum < 1) return setPageNumber(1);
    if (totalPages && pageNum > totalPages) return setPageNumber(totalPages);
    setPageNumber(pageNum);
  };

  // Zoom functions
  const changeZoom = (newZoom) => {
    setZoom(Math.min(Math.max(newZoom, 50), 200)); // Limit zoom between 50% and 200%
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && viewerContainerRef.current) {
      viewerContainerRef.current.requestFullscreen().catch(err => {
        setError(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle direct page input
  const handlePageInputChange = (e) => {
    if (e.key === 'Enter') {
      goToPage(e.target.value);
      e.target.value = '';
    }
  };

  // Add handler for iframe load event
  const handleIframeLoad = () => {
    setLoading(false);
  };

  // Add handler for iframe error
  const handleIframeError = () => {
    setError("Failed to load PDF in viewer");
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
        <p className="text-lg">Loading PDF viewer...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-400 text-red-700 rounded">
        <p className="font-bold text-lg mb-2">Error</p>
        <p>{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => setError(null)}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full" ref={viewerContainerRef}>
      {/* PDF Controls (optional) - add navigation, zoom buttons here if needed */}
      
      {/* PDF Viewer */}
      <div 
        className="w-full border border-gray-300 rounded overflow-hidden"
        style={{ height: isFullscreen ? "calc(100vh - 70px)" : "100%" }}
      >
        <iframe
          ref={iframeRef}
          src={pdfUrl}
          className="w-full h-full"
          title="PDF Document"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>
    </div>
  );
};

export default PDFViewer;