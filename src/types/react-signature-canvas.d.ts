declare module 'react-signature-canvas' {
  import * as React from 'react';
  
  export interface SignatureCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
    canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    clearOnResize?: boolean;
    minWidth?: number;
    maxWidth?: number;
    penColor?: string;
    velocityFilterWeight?: number;
    backgroundColor?: string;
    onEnd?: () => void;
  }
  
  export default class SignatureCanvas extends React.Component<SignatureCanvasProps> {
    clear(): void;
    isEmpty(): boolean;
    getTrimmedCanvas(): HTMLCanvasElement;
    getCanvas(): HTMLCanvasElement;
    fromDataURL(dataURL: string): void;
    toDataURL(type?: string, encoderOptions?: number): string;
    fromData(data: Array<any>): void;
    toData(): Array<any>;
  }
} 