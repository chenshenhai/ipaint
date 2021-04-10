
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


