import { colord } from 'colord';
import { ColorSettings } from '../models/models';

export const defaultColorSettings: ColorSettings = {
  unvisited: {
    text: 'Unvisited Node',
    colorName: '--unvisited-border-color',
    colorGradName: '--unvisited-background-gradient',
    primaryColorRgb: colord('rgba(98, 0, 234, 0.75)').toRgb(),
    secondaryColorRgb: colord('rgb(98, 0, 234)').toRgb(),
    tempColor: 'rgba(98, 0, 234, 0.75)',
    tempColorGrad: 'radial-gradient(rgba(98, 0, 234, 0.75), rgba(98, 0, 234, 0))',
    menuAnchorEl: null,
    useColorGrad: true,
    seperatePrimaryAndSecondary: false,
    secondaryOpen: false
  },
  visisted: {
    text: 'Visited Node',
    colorName: '--visited-border-color',
    colorGradName: '--visited-background-gradient',
    primaryColorRgb: colord('rgba(0, 188, 212, 1)').toRgb(),
    secondaryColorRgb: colord('rgb(0, 188, 212)').toRgb(),
    tempColor: 'rgba(0, 188, 212, 1)',
    tempColorGrad: 'radial-gradient(rgba(0, 188, 212, 0), rgba(0, 188, 212, 0.5))',
    menuAnchorEl: null,
    useColorGrad: true,
    seperatePrimaryAndSecondary: false,
    secondaryOpen: false
  },
  start: {
    text: 'Start Node',
    colorName: '--start-border-color',
    colorGradName: '--start-background-gradient',
    primaryColorRgb: colord('rgba(255, 235, 59, 1)').toRgb(),
    secondaryColorRgb: colord('rgb(255, 235, 59)').toRgb(),
    tempColor: 'rgba(255, 235, 59, 1)',
    tempColorGrad: 'radial-gradient(rgba(255, 235, 59, 0), rgba(255, 235, 59, 0.5))',
    menuAnchorEl: null,
    useColorGrad: true,
    seperatePrimaryAndSecondary: false,
    secondaryOpen: false
  },
  end: {
    text: 'End Node',
    colorName: '--end-border-color',
    colorGradName: '--end-background-gradient',
    primaryColorRgb: colord('rgba(118, 255, 5, 1)').toRgb(),
    secondaryColorRgb: colord('rgb(118, 255, 5)').toRgb(),
    tempColor: 'rgba(118, 255, 5, 1)',
    tempColorGrad: 'radial-gradient(rgba(118, 255, 5, 0), rgba(118, 255, 5, 0.5))',
    menuAnchorEl: null,
    useColorGrad: true,
    seperatePrimaryAndSecondary: false,
    secondaryOpen: false
  },
  wall: {
    text: 'Wall Node',
    colorName: '--wall-border-color',
    colorGradName: '--wall-background-gradient',
    primaryColorRgb: colord('rgba(244, 67, 54, 1)').toRgb(),
    secondaryColorRgb: colord('rgb(244, 67, 54)').toRgb(),
    tempColor: 'rgba(244, 67, 54, 1)',
    tempColorGrad: 'radial-gradient(rgba(213, 0, 0, 0), rgba(213, 0, 0, 0.5))',
    menuAnchorEl: null,
    useColorGrad: true,
    seperatePrimaryAndSecondary: false,
    secondaryOpen: false
  },
  weight: {
    text: 'Weighted Node',
    colorName: '--weight-border-color',
    colorGradName: '--weight-background-gradient',
    primaryColorRgb: colord('rgba(255, 87, 34, 1)').toRgb(),
    secondaryColorRgb: colord('rgb(255, 87, 34)').toRgb(),
    tempColor: 'rgba(255, 87, 34, 1)',
    tempColorGrad: 'radial-gradient(rgba(255, 87, 34, 0), rgba(255, 87, 34, 0.5))',
    menuAnchorEl: null,
    useColorGrad: true,
    seperatePrimaryAndSecondary: false,
    secondaryOpen: false
  },
  path: {
    text: 'Path Node',
    colorName: '--path-border-color',
    colorGradName: '--path-background-gradient',
    primaryColorRgb: colord('rgba(76, 175, 80, 1)').toRgb(),
    secondaryColorRgb: colord('rgb(76, 175, 80)').toRgb(),
    tempColor: 'rgba(76, 175, 80, 1)',
    tempColorGrad: 'radial-gradient(rgba(76, 175, 80, 0), rgba(76, 175, 80, 0.5))',
    menuAnchorEl: null,
    useColorGrad: true,
    seperatePrimaryAndSecondary: false,
    secondaryOpen: false
  },
  'weighted-path': {
    text: 'Weighted Path Node',
    colorName: '--path-weight-border-color',
    colorGradName: '--path-weight-background-gradient',
    primaryColorRgb: colord('rgba(125, 151, 67, 1)').toRgb(),
    secondaryColorRgb: colord('rgb(125, 151, 67)').toRgb(),
    tempColor: 'rgba(125, 151, 67, 1)',
    tempColorGrad: 'radial-gradient(rgba(125, 151, 67, 0), rgba(125, 151, 67, 0.5))',
    menuAnchorEl: null,
    useColorGrad: true,
    seperatePrimaryAndSecondary: false,
    secondaryOpen: false
  },
  'weighted-visited': {
    text: 'Weighted Visited Node',
    colorName: '--visited-weight-border-color',
    colorGradName: '--visited-weight-background-gradient',
    primaryColorRgb: colord('rgba(185, 115, 83, 1)').toRgb(),
    secondaryColorRgb: colord('rgb(185, 115, 83)').toRgb(),
    tempColor: 'rgba(185, 115, 83, 1)',
    tempColorGrad: 'radial-gradient(rgba(185, 115, 83, 0), rgba(185, 115, 83, 0.5))',
    menuAnchorEl: null,
    useColorGrad: true,
    seperatePrimaryAndSecondary: false,
    secondaryOpen: false
  }
};
