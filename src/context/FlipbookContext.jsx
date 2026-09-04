import React, { createContext, useContext, useState, useCallback } from 'react';
import DearFlipModal from '../components/common/DearFlipModal';

const FlipbookContext = createContext({
  openFlipbook: () => {},
  closeFlipbook: () => {},
  isOpen: false
});

export function FlipbookProvider({ children }) {
  const [flipbookState, setFlipbookState] = useState({
    isOpen: false,
    pdfUrl: null,
    title: '',
    options: {}
  });

  const openFlipbook = useCallback((pdfUrl, title = 'Document Viewer', options = {}) => {
    if (!pdfUrl) return;
    setFlipbookState({
      isOpen: true,
      pdfUrl,
      title,
      options
    });
  }, []);

  const closeFlipbook = useCallback(() => {
    setFlipbookState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  return (
    <FlipbookContext.Provider value={{ openFlipbook, closeFlipbook, isOpen: flipbookState.isOpen }}>
      {children}
      <DearFlipModal
        isOpen={flipbookState.isOpen}
        onClose={closeFlipbook}
        pdfUrl={flipbookState.pdfUrl}
        title={flipbookState.title}
        options={flipbookState.options}
      />
    </FlipbookContext.Provider>
  );
}

export function useFlipbook() {
  const context = useContext(FlipbookContext);
  if (!context) {
    throw new Error('useFlipbook must be used within a FlipbookProvider');
  }
  return context;
}
