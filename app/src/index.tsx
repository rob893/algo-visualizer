/* eslint-disable @typescript-eslint/no-empty-interface */
import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { bindLinqToNativeTypes } from 'typescript-extended-linq';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { wasmService } from './services/WasmService';
import theme from './theme';
import { ViewportProvider } from './contexts/ViewportContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { localStorageService } from './services/LocalStorageService';
import { LocalStorageKey } from './models/enums';
import { ColorSettings } from './models/models';
import { loadColorScheme } from './utilities/utilities';

bindLinqToNativeTypes();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

console.log('Initializing WASM...');
wasmService
  .init()
  .then(() => {
    ReactDOM.render(
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <ViewportProvider>
            <CssBaseline />
            <App />
          </ViewportProvider>
        </ThemeProvider>
      </React.StrictMode>,
      document.getElementById('root')
    );

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
  })
  .catch(e => {
    console.log('WASM failed to init', e);
  });

console.log('Loading local storage entries into cache...');
const t0 = performance.now();
localStorageService.loadEntriesIntoCache();
console.log(`Local storage entries loaded into cache in ${performance.now() - t0}ms.`);

const ct0 = performance.now();
console.log('Loading initial color settings...');
const savedColorSettings = localStorageService.getParsedItem<ColorSettings>(LocalStorageKey.ColorSettings);

if (savedColorSettings) {
  loadColorScheme(savedColorSettings);
}

console.log(`Initial color settings loaded in ${performance.now() - ct0}ms`);
