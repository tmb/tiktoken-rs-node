import { getEncoding, encodingForModel } from "../index.js";
import * as mitata from "mitata";

// Sample texts of different sizes
const smallText = ("Hello, world!");
const mediumText = ("A".repeat(1000));
const largeText = ("B".repeat(10000));

// Get different encodings
const cl100k = getEncoding("cl100k_base");
const p50k = getEncoding("p50k_base");
const gpt2 = getEncoding("gpt2");

// Benchmark encoding with different models and text sizes
mitata.bench("cl100k_base - encode small text", () => {
  cl100k.encode(smallText);
});

mitata.bench("cl100k_base - encode medium text", () => {
  cl100k.encode(mediumText);
});

mitata.bench("cl100k_base - encode large text", () => {
  cl100k.encode(largeText);
});

mitata.bench("p50k_base - encode small text", () => {
  p50k.encode(smallText);
});

mitata.bench("p50k_base - encode medium text", () => {
  p50k.encode(mediumText);
});

mitata.bench("gpt2 - encode small text", () => {
  gpt2.encode(smallText);
});

// Benchmark decoding
const smallTokens = cl100k.encode(smallText);
const mediumTokens = cl100k.encode(mediumText);
const largeTokens = cl100k.encode(largeText);

mitata.bench("cl100k_base - decode small tokens", () => {
  cl100k.decode(smallTokens);
});

mitata.bench("cl100k_base - decode medium tokens", () => {
  cl100k.decode(mediumTokens);
});

mitata.bench("cl100k_base - decode large tokens", () => {
  cl100k.decode(largeTokens);
});

// Benchmark encodingForModel
mitata.bench("encodingForModel - gpt-4", () => {
  encodingForModel("gpt-4");
});

mitata.bench("encodingForModel - gpt-3.5-turbo", () => {
  encodingForModel("gpt-3.5-turbo");
});

// Run all benchmarks
mitata.run({
  colors: true,
});
