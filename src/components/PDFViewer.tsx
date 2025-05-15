import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Maximize2, Minimize2, X } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl: string;
  pdfTitle: string;
  notes?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, pdfTitle, notes }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const handleIframeLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    const iframe = event.currentTarget;
    iframe.contentWindow?.addEventListener('scroll', () => {
      // Get scroll position and document height
      const { scrollTop, scrollHeight, clientHeight } = iframe.contentWindow.document.documentElement;
      
      // Calculate if we're near the bottom (within 100px)
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      // Send message to parent window
      window.parent.postMessage({
        type: 'pdf-scroll',
        currentPage: Math.ceil(scrollTop / clientHeight),
        totalPages: Math.ceil(scrollHeight / clientHeight),
        isNearBottom
      }, '*');
    });
  };

  return (
    <>
      {/* Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Notes Modal */}
      {showNotes && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold z-10 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center shadow"
              onClick={() => setShowNotes(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Lesson Notes
            </h2>
            <div className="prose max-w-none text-sm text-gray-800 whitespace-pre-line">
              {notes || 'No notes available for this lesson.'}
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Card */}
      <Card 
        className={`w-full transition-all duration-300 ${
          isExpanded 
            ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] z-50 bg-background shadow-2xl' 
            : ''
        }`}
      >
        <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isExpanded ? 'border-b' : ''}`}>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>{pdfTitle}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotes(true)}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Notes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="h-4 w-4" />
                  Minimize
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4" />
                  Expand
                </>
              )}
            </Button>
            {isExpanded && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(pdfUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            )}
            {isExpanded && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className={`h-full w-full p-0 ${isExpanded ? 'flex-1' : ''}`} style={{ height: isExpanded ? 'calc(90vh - 3.5rem)' : undefined }}>
          <div 
            className={`w-full bg-muted rounded-lg overflow-hidden transition-all duration-300 ${
              isExpanded 
                ? 'h-full rounded-none' 
                : 'aspect-[4/3]'
            }`}
          >
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              title={pdfTitle}
              className="w-full h-full"
              style={{ border: 'none' }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}; 