// Enterprise Mall - MUI Theme Type Augmentation
// Extends MUI Palette to support custom 'accent' color palette

import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
  }
  interface PaletteOptions {
    accent: PaletteOptions['primary'];
  }
}
