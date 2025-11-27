import React from 'react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GalleryItem {
  id: number;
  url: string;
  title: string;
}

export interface DataContextType {
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  removeGalleryItem: (id: number) => void;
  aiInstruction: string;
  updateAiInstruction: (instruction: string) => void;
  comparisonLeft: string;
  comparisonRight: string;
  updateComparisonImages: (left: string, right: string) => void;
  resetToDefaults: () => void;
}