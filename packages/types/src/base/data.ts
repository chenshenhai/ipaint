export type TypeData = {
  brushMap: {[name: string]: TypeDataBrush},
  paths: TypeDataPath[],
}

export type TypeDataBrush = {
  name: string;
  src: string;
}

export type TypeDataPath = {
  brush: string,
  size: number;
  positions: TypeDataPosition[]
}

export type TypeDataPosition = {
  x: number,
  y: number,
  t: number,
}
