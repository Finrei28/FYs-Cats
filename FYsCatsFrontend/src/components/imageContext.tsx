import React, { createContext, useState, useContext, ReactNode } from "react";

type Image = {
  _id: string;
  image: string;
  addedDate: Date;
  name: string;
};

interface ImageContextProps {
  currentImage: Image | null;
  setCurrentImage: (image: Image | null) => void;
}

const ImageContext = createContext<ImageContextProps | undefined>(undefined);

export const ImageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentImage, setCurrentImage] = useState<Image | null>(null);

  return (
    <ImageContext.Provider value={{ currentImage, setCurrentImage }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error("useImageContext must be used within an ImageProvider");
  }
  return context;
};
