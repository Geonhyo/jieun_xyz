export interface ImageInfo {
  type: "image";
  src: string;
  width: number;
  height: number;
}

export interface TextInfo {
  type: "text";
  text: string;
  size: number;
  color: string;
  family: string;
  bold: boolean;
}

export interface ObjectModel {
  id: string;
  x: number;
  y: number;
  z: number;
  rotation: number;
  width: number;
  height: number;
  data: ImageInfo | TextInfo;
  disabled: boolean;
  isSelected: boolean;
}
