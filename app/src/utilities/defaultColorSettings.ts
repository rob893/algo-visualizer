import { ColorSettings } from '../models/models';

export const defaultColorSettings: ColorSettings = {
  unvisited: {
    text: 'Unvisited Node',
    colorName: '--unvisited-border-color',
    colorGradName: '--unvisited-background-gradient',
    tempColor: 'rgba(98, 0, 234, 0.75)',
    tempColorGrad: 'radial-gradient(rgba(98, 0, 234, 0.75), rgba(98, 0, 234, 0))',
    useColorGrad: true,
    seperatePrimaryAndSecondary: false
  },
  visisted: {
    text: 'Visited Node',
    colorName: '--visited-border-color',
    colorGradName: '--visited-background-gradient',
    tempColor: 'rgba(0, 188, 212, 1)',
    tempColorGrad: 'radial-gradient(rgba(0, 188, 212, 0), rgba(0, 188, 212, 0.5))',
    useColorGrad: true,
    seperatePrimaryAndSecondary: false
  },
  start: {
    text: 'Start Node',
    colorName: '--start-border-color',
    colorGradName: '--start-background-gradient',
    tempColor: 'rgba(255, 235, 59, 1)',
    tempColorGrad: 'radial-gradient(rgba(255, 235, 59, 0), rgba(255, 235, 59, 0.5))',
    useColorGrad: true,
    seperatePrimaryAndSecondary: false
  },
  end: {
    text: 'End Node',
    colorName: '--end-border-color',
    colorGradName: '--end-background-gradient',
    tempColor: 'rgba(118, 255, 5, 1)',
    tempColorGrad: 'radial-gradient(rgba(118, 255, 5, 0), rgba(118, 255, 5, 0.5))',
    useColorGrad: true,
    seperatePrimaryAndSecondary: false
  },
  wall: {
    text: 'Wall Node',
    colorName: '--wall-border-color',
    colorGradName: '--wall-background-gradient',
    tempColor: 'rgba(244, 67, 54, 1)',
    tempColorGrad: 'radial-gradient(rgba(213, 0, 0, 0), rgba(213, 0, 0, 0.5))',
    useColorGrad: true,
    seperatePrimaryAndSecondary: false
  },
  weight: {
    text: 'Weighted Node',
    colorName: '--weight-border-color',
    colorGradName: '--weight-background-gradient',
    tempColor: 'rgba(255, 87, 34, 1)',
    tempColorGrad: 'radial-gradient(rgba(255, 87, 34, 0), rgba(255, 87, 34, 0.5))',
    useColorGrad: true,
    seperatePrimaryAndSecondary: false
  },
  path: {
    text: 'Path Node',
    colorName: '--path-border-color',
    colorGradName: '--path-background-gradient',
    tempColor: 'rgba(76, 175, 80, 1)',
    tempColorGrad: 'radial-gradient(rgba(76, 175, 80, 0), rgba(76, 175, 80, 0.5))',
    useColorGrad: true,
    seperatePrimaryAndSecondary: false
  },
  'weighted-path': {
    text: 'Weighted Path Node',
    colorName: '--path-weight-border-color',
    colorGradName: '--path-weight-background-gradient',
    tempColor: 'rgba(125, 151, 67, 1)',
    tempColorGrad: 'radial-gradient(rgba(125, 151, 67, 0), rgba(125, 151, 67, 0.5))',
    useColorGrad: true,
    seperatePrimaryAndSecondary: false
  },
  'weighted-visited': {
    text: 'Weighted Visited Node',
    colorName: '--visited-weight-border-color',
    colorGradName: '--visited-weight-background-gradient',
    tempColor: 'rgba(185, 115, 83, 1)',
    tempColorGrad: 'radial-gradient(rgba(185, 115, 83, 0), rgba(185, 115, 83, 0.5))',
    useColorGrad: true,
    seperatePrimaryAndSecondary: false
  }
};
