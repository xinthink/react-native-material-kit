/**
 * Created by ywu on 15/7/16.
 */
interface Palette {
  Amber: string
  Blue: string
  BlueGrey: string
  Brown: string
  Cyan: string
  DeepOrange: string
  DeepPurple: string
  Green: string
  Grey: string
  Indigo: string
  LightBlue: string
  LightGreen: string
  Lime: string
  Orange: string
  Pink: string
  Purple: string
  Red: string
  Silver: string
  Teal: string
  Yellow: string

  Transparent: string

  // RGB values
  RGBAmber: string
  RGBIndigo: string
  RGBPink: string
  RGBPurple: string
  RGBTeal: string

  // MDL palette (subset)
  palette_blue_400: string
  palette_green_500: string
  palette_red_500: string
  palette_yellow_600: string
}

const MkColor: Palette = {
  Amber: '#FFC107',
  Blue: '#2196F3',
  BlueGrey: '#607D8B',
  Brown: '#795548',
  Cyan: '#00BCD4',
  DeepOrange: '#FF5722',
  DeepPurple: '#673AB7',
  Green: '#4CAF50',
  Grey: '#9E9E9E',
  Indigo: '#3F51B5',
  LightBlue: '#03A9F4',
  LightGreen: '#8BC34A',
  Lime: '#CDDC39',
  Orange: '#FF9800',
  Pink: '#FF4081',
  Purple: '#9C27B0',
  Red: '#FF5252',
  Silver: '#EAEAEA', // opacity plain button background
  Teal: '#009688',
  Yellow: '#FFEB3B',

  Transparent: 'transparent',

  // RGB values
  RGBAmber: '255,193,7',
  RGBIndigo: '63,81,181',
  RGBPink: '255,64,129',
  RGBPurple: '156,39,176',
  RGBTeal: '0,150,136',

  // MDL palette (subset)
  palette_blue_400: 'rgb(66,165,245)',
  palette_green_500: 'rgb(76,175,80)',
  palette_red_500: 'rgb(244,67,54)',
  palette_yellow_600: 'rgb(253,216,53)',
};

export default MkColor
