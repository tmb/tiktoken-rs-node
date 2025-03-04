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

## Supported encodings via `tiktoken-rs`

- `o200k_base`
- `cl100k_base`
- `p50k_edit`
- `p50k_base`
- `r50k_base`
- `gpt2`

## Testing and Benchmarking

```bash
yarn test # Run all tests
yarn benchmark # Run smoke-test bench marks
yarn benchmark:comprehensive # Run a benchmark on every encoding w/ various text lengths
yarn test:all # Run all tests and benchmarks
```


## Future improvements, PRs welcomed and encouraged:

- [ ] Convert from UTF-8 to UTF-16 on the fly during decode so that the string can be zero-copy UTF-16 for V8.
- [ ] Investigate modifying the BPE algorithm to optimize for a counting fast path (without storing every token in memory).
