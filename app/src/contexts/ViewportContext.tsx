import { createContext, FC, useEffect, useState } from 'react';

export const ViewportContext = createContext({} as ViewportProps);

export const ViewportProvider: FC = ({ children }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const handleResize = (): void => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return <ViewportContext.Provider value={{ width, height }}>{children}</ViewportContext.Provider>;
};

interface ViewportProps {
  width: number;
  height: number;
}
