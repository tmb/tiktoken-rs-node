import { Encoding, getEncoding, encodingForModel } from "../index.js";
import * as mitata from "mitata";

// All supported encodings
const ENCODINGS = [
  "gpt2",
  "r50k_base",
  "p50k_base",
  "p50k_edit",
  "cl100k_base",
  "o200k_base",
] as const;

// Sample texts of different sizes and content
const TEXTS = {
  small: Buffer.from("Hello, world!"),
  medium: Buffer.from("A".repeat(1000)),
  large: Buffer.from("B".repeat(10000)),
  mixed: Buffer.from(
    "This is a mixed text with some numbers 12345 and special characters !@#$%^&*() and emojis 😊🚀💻"
  ),
  unicode: Buffer.from(
    "Unicode characters: äöü 你好 こんにちは 안녕하세요 Привет"
  ),
};

// Models to benchmark
const MODELS = [
  "gpt-4",
  "gpt-3.5-turbo",
  "text-davinci-003",
  "text-embedding-ada-002",
];

// Initialize encodings
const encodings = ENCODINGS.reduce((acc, name) => {
  acc[name] = getEncoding(name);
  return acc;
}, {} as Record<(typeof ENCODINGS)[number], Encoding>);

// Benchmark encoding for each encoding and text
Object.entries(encodings).forEach(([name, encoding]) => {
  Object.entries(TEXTS).forEach(([textType, text]) => {
    mitata.bench(`${name} - encode ${textType} text`, () => {
      encoding.encode(text);
    });
  });
});

// Benchmark decoding
Object.entries(encodings).forEach(([name, encoding]) => {
  Object.entries(TEXTS).forEach(([textType, text]) => {
    const tokens = encoding.encode(text);
    mitata.bench(`${name} - decode ${textType} tokens`, () => {
      encoding.decode(tokens);
    });
  });
});

// Benchmark encodingForModel
MODELS.forEach((model) => {
  mitata.bench(`encodingForModel - ${model}`, () => {
    encodingForModel(model);
  });
});

// Run all benchmarks
mitata.run({
  colors: true,
});
