import istype from './istype';

export const mergeCSS2StyleAttr = function(
  cssMap: {[key: string]: string} = {}
): string {
  const cssList = [];
  if (istype.json(cssMap) === true) {
    for (const key in cssMap) {
      let cssKey: string = `${key}`;
      let cssVal: string = `${cssMap[key]}`;
      cssKey = cssKey.trim();
      cssVal = cssVal.trim();
      cssList.push(`${cssKey}:${cssVal}`);
    }
  }
  const styleAttr = cssList.join('; ');
  return styleAttr;
}


export function setStyle(
  dom: HTMLElement, 
  style: {[key: string]: string} ) {
  const keys: string[] = Object.keys(style);
  let styleStr = '';
  keys.forEach((key: string) => {
    styleStr += `${key}:${style[key] || ''};`
  });
  dom.setAttribute('style', styleStr);
}

export function getDomTransform(dom: HTMLElement): {
  scaleX: number;
  skewY: number;
  skewX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
} {
  // transform: matrix( scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY() )
  // matrix(1, 2, -1, 1, 80, 80)
  const style = getComputedStyle(dom) || {};
  const { transform } = style;
  const matrixStr = transform.replace(/^matrix\(|\)$/ig, '');
  const matrixList = matrixStr.split(',').map((str) => {
    const val = parseFloat(str);
    return isNaN(val) ? 0 : val;
  });
  const matrix = {
    scaleX: matrixList[0],
    skewY: matrixList[1],
    skewX: matrixList[2],
    scaleY: matrixList[3],
    translateX: matrixList[4],
    translateY: matrixList[5],
  }
  return matrix;
}


export function setDomTransform(dom: HTMLElement, matrix: {
  scaleX: number;
  skewY: number;
  skewX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
}) {
  // transform: matrix( scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY() )
  // matrix(1, 2, -1, 1, 80, 80)
  const transform = `matrix(${matrix.scaleX}, ${matrix.skewY}, ${matrix.skewX}, ${matrix.scaleY}, ${matrix.translateX}, ${matrix.translateY})`;
  dom.style.setProperty('transform', transform);
}