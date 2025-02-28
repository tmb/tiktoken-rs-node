# tiktoken-rs-node

_(inspired by [tiktoken-node](https://github.com/ceifa/tiktoken-node))_

napi Rust bindings for [tiktoken-rs](https://github.com/zurawiki/tiktoken-rs), featuring zero-copy encode and no WASM.

## Installation

```bash
npm install tiktoken-rs-node
```

## Usage

```ts
import { getEncoding } from "tiktoken-rs-node";

// If you're doing this in a long-running process, make sure to do it once per-startup.
const encoding = getEncoding("gpt2");

const tokens = encoding.encode("Hello, world!");
const decodedString = encoding.decode(tokens);
```

## Supported encodings

- `gpt2`
- `r50k_base`
- `p50k_base`
- `p50k_edit`
- `cl100k_base`
- `o200k_base`

## Testing and Benchmarking

### Running Tests

```bash
yarn test
```

### Running Benchmarks

```bash
# Run basic benchmarks
yarn benchmark

# Run comprehensive benchmarks (tests all encodings with various text types)
yarn benchmark:comprehensive
```

### Running Both Tests and Benchmarks

```bash
yarn test:all
```

## Future improvements, PRs welcomed and encouraged:

[] Convert from UTF-8 to UTF-16 on the fly during decode so that the string can be zero-copy UTF-16 for V8.
[] Investigated modifying the BPE algorithm to optimize for a counting fast path (without storing every token in memory).
