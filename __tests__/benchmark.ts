import { getEncoding, encodingForModel } from "../index.js";
import { bench, run } from "mitata";

// Sample texts of different sizes
const smallText = Buffer.from("Hello, world!");
const mediumText = Buffer.from("A".repeat(1000));
const largeText = Buffer.from("B".repeat(10000));

// Get different encodings
const cl100k = getEncoding("cl100k_base");
const p50k = getEncoding("p50k_base");
const gpt2 = getEncoding("gpt2");

// Benchmark encoding with different models and text sizes
bench("cl100k_base - encode small text", () => {
  cl100k.encode(smallText);
});

bench("cl100k_base - encode medium text", () => {
  cl100k.encode(mediumText);
});

bench("cl100k_base - encode large text", () => {
  cl100k.encode(largeText);
});

bench("p50k_base - encode small text", () => {
  p50k.encode(smallText);
});

bench("p50k_base - encode medium text", () => {
  p50k.encode(mediumText);
});

bench("gpt2 - encode small text", () => {
  gpt2.encode(smallText);
});

// Benchmark decoding
const smallTokens = cl100k.encode(smallText);
const mediumTokens = cl100k.encode(mediumText);
const largeTokens = cl100k.encode(largeText);

bench("cl100k_base - decode small tokens", () => {
  cl100k.decode(smallTokens);
});

bench("cl100k_base - decode medium tokens", () => {
  cl100k.decode(mediumTokens);
});

bench("cl100k_base - decode large tokens", () => {
  cl100k.decode(largeTokens);
});

// Benchmark encodingForModel
bench("encodingForModel - gpt-4", () => {
  encodingForModel("gpt-4");
});

bench("encodingForModel - gpt-3.5-turbo", () => {
  encodingForModel("gpt-3.5-turbo");
});

// Run all benchmarks
run({
  colors: true,
});
