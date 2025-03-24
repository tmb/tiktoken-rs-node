import { getEncoding, encodingForModel } from "../index.js";

describe("tiktoken-rs-node", () => {
  describe("getEncoding", () => {
    test("should get cl100k_base encoding", () => {
      const encoding = getEncoding("cl100k_base");
      expect(encoding).toBeDefined();
    });

    test("should get p50k_base encoding", () => {
      const encoding = getEncoding("p50k_base");
      expect(encoding).toBeDefined();
    });

    test("should throw for invalid encoding", () => {
      expect(() => getEncoding("invalid_encoding" as any)).toThrow();
    });
  });

  describe("encodingForModel", () => {
    test("should get encoding for gpt-4", () => {
      const encoding = encodingForModel("gpt-4");
      expect(encoding).toBeDefined();
    });

    test("should get encoding for gpt-3.5-turbo", () => {
      const encoding = encodingForModel("gpt-3.5-turbo");
      expect(encoding).toBeDefined();
    });
  });

  describe("Encoding", () => {
    test("should encode and decode text correctly", () => {
      const encoding = getEncoding("cl100k_base");
      const text = "Hello, world!";
      const textBytes = Buffer.from(text);
      const tokens = encoding.encode(textBytes);

      expect(ArrayBuffer.isView(tokens) && tokens.BYTES_PER_ELEMENT === 4).toBe(
        true
      );
      expect(tokens.length).toBeGreaterThan(0);

      const decoded = encoding.decode(tokens);
      expect(decoded).toBe(text);
    });

    test("should handle empty input", () => {
      const encoding = getEncoding("cl100k_base");
      const emptyBytes = Buffer.from("");
      const tokens = encoding.encode(emptyBytes);
      expect(ArrayBuffer.isView(tokens) && tokens.BYTES_PER_ELEMENT === 4).toBe(
        true
      );
      expect(tokens.length).toBe(0);

      const decoded = encoding.decode(new Uint32Array(0));
      expect(decoded).toBe("");
    });

    test("should handle special characters", () => {
      const encoding = getEncoding("cl100k_base");
      const text = "🚀 Special characters: äöü 你好 😊";
      const textBytes = Buffer.from(text);
      const tokens = encoding.encode(textBytes);

      const decoded = encoding.decode(tokens);
      expect(decoded).toBe(text);
    });

    test("should throw error for invalid UTF-8 input", () => {
      const encoding = getEncoding("cl100k_base");
      // Create a buffer with an incomplete UTF-8 sequence (first byte of a 2-byte sequence)
      const invalidBytes = Buffer.from([0xc2]); // First byte of UTF-8 2-byte sequence

      // The encoding should throw an error for invalid UTF-8
      expect(() => encoding.encode(invalidBytes)).toThrow(
        "Error while encoding text to UTF-8"
      );
    });
  });
});
