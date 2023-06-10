export enum ThemeType {
  Light = 'light',
  Dark = 'dark',
  FollowOs = 'followOs'
}

export enum PrimaryColorType {
  Polar_Green = 'polar-green',
  Golden_Purple = 'golden-purple',
  Polar_Blue = 'polar-blue'
}


export interface ITheme {
  backgroundColor: ThemeType;
  primaryColor: PrimaryColorType;
}