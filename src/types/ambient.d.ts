declare module 'jszip' {
  export interface JSZipObject {
    dir: boolean;
    async(type: 'text'): Promise<string>;
    async(type: 'nodebuffer'): Promise<Buffer>;
  }

  export default class JSZip {
    files: { [key: string]: JSZipObject };
    static loadAsync(data: ArrayBuffer): Promise<JSZip>;
    generateAsync(options: { type: 'blob' }): Promise<Blob>;
    file(name: string, data: string | Buffer): void;
  }
}

declare module 'file-saver' {
  export function saveAs(blob: Blob, filename: string): void;
}
