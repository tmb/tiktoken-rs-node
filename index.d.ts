/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export declare function getEncoding(encoding: 'gpt2' | 'r50k_base' | 'p50k_base' | 'p50k_edit' | 'cl100k_base' | 'o200k_base'): Encoding
export declare function encodingForModel(modelName: string): Encoding
export declare class Encoding {
  encode(text: Uint8Array): Uint32Array
  decode(tokens: Uint32Array): string
}
