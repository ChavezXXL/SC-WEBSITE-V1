
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GalleryItem, DataContextType } from '../types';

// MOVED DEFAULT INSTRUCTION HERE TO REMOVE DEPENDENCY ON GEMINI.TS
const DEFAULT_SYSTEM_INSTRUCTION = `
You are the "Precision AI Consultant" for SC Precision Deburring. 
Your goal is to help potential customers understand metal finishing processes and guide them to the right service.
`;

// Initial Hardcoded Data
const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 200,
    url: '/gallery/yelp-2.jpg',
    title: 'Multi-Bore Aerospace Manifold'
  },
  {
    id: 202,
    url: '/gallery/yelp-4.jpg',
    title: 'Multi-Port Aerospace Manifold'
  },
  {
    id: 201,
    url: '/gallery/yelp-1.jpg',
    title: 'Hydraulic Valve Body'
  },
  {
    id: 203,
    url: '/gallery/yelp-3.jpg',
    title: 'Finished Stainless Spool'
  },
  {
    id: 1,
    url: 'https://img1.wsimg.com/isteam/ip/951b1fa8-8dbe-4e71-b72c-33034345220a/6925DBE8-1DD0-4031-B285-C6D87AE7C34B.jpeg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1023,h:1531',
    title: 'Complex Geometry Deburring'
  },
  {
    id: 2,
    url: 'https://img1.wsimg.com/isteam/ip/951b1fa8-8dbe-4e71-b72c-33034345220a/707F082E-C45A-40A5-9307-387589F36D1A.jpeg/:/rs=w:1023,h:1531',
    title: 'Precision Surface Finishing'
  },
  {
    id: 3,
    url: 'https://img1.wsimg.com/isteam/ip/951b1fa8-8dbe-4e71-b72c-33034345220a/IMG_2962.jpeg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1023,h:767',
    title: 'Batch Processing'
  },
  {
    id: 4,
    url: 'https://img1.wsimg.com/isteam/ip/951b1fa8-8dbe-4e71-b72c-33034345220a/5%20part%206%3A23.JPG/:/cr=t:0%25,l:5.57%25,w:88.86%25,h:100%25/rs=w:1023,h:769',
    title: 'High-Tolerance Components'
  },
  {
    id: 5,
    url: 'https://img1.wsimg.com/isteam/ip/951b1fa8-8dbe-4e71-b72c-33034345220a/1%20part%206-23.JPG/:/cr=t:0%25,l:5.56%25,w:88.89%25,h:100%25/rs=w:1023,h:769',
    title: 'Edge Blending & Polishing'
  },
  {
    id: 6,
    url: 'https://img1.wsimg.com/isteam/ip/951b1fa8-8dbe-4e71-b72c-33034345220a/june%2027%20part%203.JPG/:/cr=t:0%25,l:5.56%25,w:88.89%25,h:100%25/rs=w:1023,h:769',
    title: 'Final Quality Inspection'
  },
  {
    id: 7,
    url: 'https://img1.wsimg.com/isteam/ip/951b1fa8-8dbe-4e71-b72c-33034345220a/b%20and%20f%202.JPEG/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1023,h:1023',
    title: 'Before & After Comparison'
  }
];

// UPDATED DEFAULTS with user provided Imgur links
// Left = Finished (Shiny/Polished)
const INITIAL_COMPARISON_LEFT = "https://i.imgur.com/biKqUOl.jpeg";
// Right = Raw (Matte/Machined)
const INITIAL_COMPARISON_RIGHT = "https://i.imgur.com/tkJmxW2.jpeg";

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY_ITEMS);
  const [comparisonLeft, setComparisonLeft] = useState<string>(INITIAL_COMPARISON_LEFT);
  const [comparisonRight, setComparisonRight] = useState<string>(INITIAL_COMPARISON_RIGHT);
  const [aiInstruction, setAiInstruction] = useState<string>(DEFAULT_SYSTEM_INSTRUCTION);

  // Load from local storage on mount
  useEffect(() => {
    const GALLERY_VERSION = '4';
    const storedVersion = localStorage.getItem('sc_gallery_version');
    if (storedVersion !== GALLERY_VERSION) {
      // Outdated cache — clear and use fresh defaults
      localStorage.removeItem('sc_gallery');
      localStorage.setItem('sc_gallery_version', GALLERY_VERSION);
    }

    const savedGallery = localStorage.getItem('sc_gallery');
    const savedLeft = localStorage.getItem('sc_comp_left');
    const savedRight = localStorage.getItem('sc_comp_right');
    const savedAiInst = localStorage.getItem('sc_ai_instruction');

    if (savedGallery) {
      try {
        setGalleryItems(JSON.parse(savedGallery));
      } catch (e) {
        console.error("Failed to parse gallery items");
      }
    }

    if (savedLeft) setComparisonLeft(savedLeft);
    if (savedRight) setComparisonRight(savedRight);
    if (savedAiInst) setAiInstruction(savedAiInst);
  }, []);

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem = { ...item, id: Date.now() };
    const updated = [newItem, ...galleryItems];
    setGalleryItems(updated);
    localStorage.setItem('sc_gallery', JSON.stringify(updated));
  };

  const removeGalleryItem = (id: number) => {
    const updated = galleryItems.filter(item => item.id !== id);
    setGalleryItems(updated);
    localStorage.setItem('sc_gallery', JSON.stringify(updated));
  };

  const updateComparisonImages = (left: string, right: string) => {
    setComparisonLeft(left);
    setComparisonRight(right);
    localStorage.setItem('sc_comp_left', left);
    localStorage.setItem('sc_comp_right', right);
  };

  const updateAiInstruction = (instruction: string) => {
    setAiInstruction(instruction);
    localStorage.setItem('sc_ai_instruction', instruction);
  };

  const resetToDefaults = () => {
    setGalleryItems(INITIAL_GALLERY_ITEMS);
    setComparisonLeft(INITIAL_COMPARISON_LEFT);
    setComparisonRight(INITIAL_COMPARISON_RIGHT);
    setAiInstruction(DEFAULT_SYSTEM_INSTRUCTION);
    
    localStorage.removeItem('sc_gallery');
    localStorage.removeItem('sc_comp_left');
    localStorage.removeItem('sc_comp_right');
    localStorage.removeItem('sc_ai_instruction');
  };

  return (
    <DataContext.Provider value={{
      galleryItems,
      addGalleryItem,
      removeGalleryItem,
      comparisonLeft,
      comparisonRight,
      updateComparisonImages,
      resetToDefaults,
      aiInstruction,
      updateAiInstruction
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
