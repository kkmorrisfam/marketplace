"use client";

// React, Next.js
import { createContext, useContext, useState } from "react";

// Prisma models
import { User, Category } from "@/generated/prisma/client";

interface ModalProviderProps {
  children: React.ReactNode;
}

export type ModalData = {
  user?: User | null;
  rowData?: Category | null;
};

type ModalContextType = {
  data: ModalData;
  isOpen: boolean;
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<ModalData>) => void;
  setClose: () => void;
};

/*export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<ModalData>) => {},
  setClose: () => {},
});
*/
export const ModalContext =
  createContext<ModalContextType | undefined>(undefined);

const ModalProvider: React.FC<ModalProviderProps> = ({ children}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>({});
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null);
  //const [isMounted, setIsMounted] = useState(false);

  /*useEffect(() => {
    setIsMounted(true);
  }, []);
*/
  const setOpen = async (
    modal: React.ReactNode,
    fetchData?: () => Promise<ModalData>
  ) => {
    if (modal) {
      if (fetchData) {
     //   setData({ ...data, ...(await fetchData()) } || {});
        const fetchedData = await fetchData();
        setData((prevData) => ({
            ...prevData,
            ...fetchedData,
        }));
      }
      setShowingModal(modal);
      setIsOpen(true);
    }
  };

  const setClose = () => {
    setIsOpen(false);
    setData({});
  };

  //if (!isMounted) return null;

  return (
    <ModalContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within the modal provider");
  }
  return context;
};

export default ModalProvider;