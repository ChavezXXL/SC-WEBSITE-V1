
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GalleryItem, DataContextType } from '../types';

// Write to localStorage, surfacing quota errors instead of silently dropping
// the write (uploaded images are stored as base64 and can overflow the ~5MB cap).
const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`[DataContext] localStorage write failed for "${key}":`, e);
    if (typeof window !== 'undefined') {
      alert(
        'Could not save — browser storage is full.\n\n' +
          'Uploaded images are stored locally in this browser and there is a ~5MB limit. ' +
          'Remove some gallery items or use smaller images, then try again.',
      );
    }
    return false;
  }
};

// Initial Hardcoded Data
const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  // New Yelp photos (top of gallery)
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
  // Existing portfolio shots — served locally (the old wsimg.com/imgur hotlinks
  // could fail or be blocked at any time, leaving invisible images)
  {
    id: 1,
    url: '/img/work/work-01.jpg',
    title: 'Complex Geometry Deburring'
  },
  {
    id: 2,
    url: '/img/work/work-02.jpg',
    title: 'Precision Surface Finishing'
  },
  {
    id: 3,
    url: '/img/work/work-03.jpg',
    title: 'Batch Processing'
  },
  {
    id: 4,
    url: '/img/work/work-04.jpg',
    title: 'High-Tolerance Components'
  },
  {
    id: 5,
    url: '/img/work/work-05.jpg',
    title: 'Edge Blending & Polishing'
  },
  {
    id: 6,
    url: '/img/work/work-06.jpg',
    title: 'Final Quality Inspection'
  },
  {
    id: 7,
    url: '/img/work/work-07.jpg',
    title: 'Before & After Comparison'
  }
];

// Left = Finished (Shiny/Polished)
const INITIAL_COMPARISON_LEFT = "/img/comparison/left.jpg";
// Right = Raw (Matte/Machined)
const INITIAL_COMPARISON_RIGHT = "/img/comparison/right.jpg";

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY_ITEMS);
  const [comparisonLeft, setComparisonLeft] = useState<string>(INITIAL_COMPARISON_LEFT);
  const [comparisonRight, setComparisonRight] = useState<string>(INITIAL_COMPARISON_RIGHT);

  // Load from local storage on mount
  useEffect(() => {
    const GALLERY_VERSION = '7'; // bumped: images moved from remote hotlinks to local /img/
    const storedVersion = localStorage.getItem('sc_gallery_version');
    if (storedVersion !== GALLERY_VERSION) {
      // Outdated cache — clear and use fresh defaults
      localStorage.removeItem('sc_gallery');
      localStorage.removeItem('sc_comp_left');
      localStorage.removeItem('sc_comp_right');
      localStorage.setItem('sc_gallery_version', GALLERY_VERSION);
    }

    const savedGallery = localStorage.getItem('sc_gallery');
    const savedLeft = localStorage.getItem('sc_comp_left');
    const savedRight = localStorage.getItem('sc_comp_right');

    if (savedGallery) {
      try {
        setGalleryItems(JSON.parse(savedGallery));
      } catch (e) {
        console.error("Failed to parse gallery items");
      }
    }

    if (savedLeft) setComparisonLeft(savedLeft);
    if (savedRight) setComparisonRight(savedRight);
  }, []);

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem = { ...item, id: Date.now() };
    const updated = [newItem, ...galleryItems];
    setGalleryItems(updated);
    safeSetItem('sc_gallery', JSON.stringify(updated));
  };

  const removeGalleryItem = (id: number) => {
    const updated = galleryItems.filter(item => item.id !== id);
    setGalleryItems(updated);
    safeSetItem('sc_gallery', JSON.stringify(updated));
  };

  const updateComparisonImages = (left: string, right: string) => {
    setComparisonLeft(left);
    setComparisonRight(right);
    safeSetItem('sc_comp_left', left);
    safeSetItem('sc_comp_right', right);
  };

  const resetToDefaults = () => {
    setGalleryItems(INITIAL_GALLERY_ITEMS);
    setComparisonLeft(INITIAL_COMPARISON_LEFT);
    setComparisonRight(INITIAL_COMPARISON_RIGHT);

    localStorage.removeItem('sc_gallery');
    localStorage.removeItem('sc_comp_left');
    localStorage.removeItem('sc_comp_right');
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
