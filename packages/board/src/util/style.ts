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
