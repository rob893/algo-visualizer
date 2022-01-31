import { useContext } from 'react';
import { ViewportContext } from '../contexts/ViewportContext';

export const useViewport = (): { width: number; height: number } => {
  const { width, height } = useContext(ViewportContext);
  return { width, height };
};
