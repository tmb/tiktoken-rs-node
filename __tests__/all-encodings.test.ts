import { Encoding, getEncoding } from "../index";

const SUPPORTED_ENCODINGS = [
  "gpt2",
  "r50k_base",
  "p50k_base",
  "p50k_edit",
  "cl100k_base",
  "o200k_base",
] as const;

const TEST_STRINGS = [
  "Hello, world!",
  "This is a test of the tiktoken-rs-node package.",
  "🚀 Special characters: äöü 你好 😊",
  "A".repeat(100),
  "",
  "1234567890",
  "The quick brown fox jumps over the lazy dog.",
];

describe("All Encodings", () => {
  SUPPORTED_ENCODINGS.forEach((encodingName) => {
    describe(`${encodingName} encoding`, () => {
      let encoding: Encoding;

      beforeAll(() => {
        encoding = getEncoding(encodingName);
      });

      test("should be defined", () => {
        expect(encoding).toBeDefined();
      });

      TEST_STRINGS.forEach((testString) => {
        test(`should encode and decode "${testString.substring(0, 20)}${
          testString.length > 20 ? "..." : ""
        }" correctly`, () => {
          const textBytes = Buffer.from(testString);
          const tokens = encoding.encode(textBytes);
          expect(
            ArrayBuffer.isView(tokens) && tokens.BYTES_PER_ELEMENT === 4
          ).toBe(true);

          if (testString.length > 0) {
            expect(tokens.length).toBeGreaterThan(0);
          } else {
            expect(tokens.length).toBe(0);
          }

          const decoded = encoding.decode(tokens);
          expect(decoded).toBe(testString);
        });
      });

      test("should handle empty Uint32Array for decoding", () => {
        const decoded = encoding.decode(new Uint32Array(0));
        expect(decoded).toBe("");
      });
    });
  });
});
