import html2canvas from 'html2canvas-pro';
 
export function captureElementToImage(element: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(element);
} 