import { createContext, FC, useEffect, useState } from 'react';

export const ViewportContext = createContext({} as ViewportProps);

export const ViewportProvider: FC<{ children: JSX.Element | JSX.Element[] }> = ({ children }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const handleResize = (): void => {
    const newInnerWidth = window.innerWidth;
    const newInnerHeight = window.innerHeight;

    // eslint-disable-next-line no-restricted-globals
    if (!screen.orientation) {
      setWidth(newInnerWidth);
      setHeight(newInnerHeight);
    } else if (newInnerHeight !== height && newInnerWidth !== width) {
      setWidth(newInnerWidth);
      setHeight(newInnerHeight);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  return <ViewportContext.Provider value={{ width, height }}>{children}</ViewportContext.Provider>;
};

interface ViewportProps {
  width: number;
  height: number;
}
