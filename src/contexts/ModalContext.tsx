import React, { createContext, useContext, useState, ReactNode } from 'react';
import ApplicationTypeModal from '../components/credit/ApplicationTypeModal';

// Define modal types
export enum ModalType {
  APPLICATION_TYPE = 'APPLICATION_TYPE',
}

// Create context
type ModalContextType = {
  openModal: (modalType: ModalType) => void;
  closeModal: () => void;
  activeModal: ModalType | null;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Provider component
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const openModal = (modalType: ModalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, activeModal }}>
      {children}
      
      {/* Render modals based on activeModal */}
      <ApplicationTypeModal 
        isOpen={activeModal === ModalType.APPLICATION_TYPE} 
        onClose={closeModal} 
      />
    </ModalContext.Provider>
  );
};

// Custom hook for using the context
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export default ModalContext; 