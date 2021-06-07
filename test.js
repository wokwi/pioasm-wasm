/*
 * pioasm-wasm test code
 */

import assert from 'assert';
import { pioasm } from './pioasm.js';

const testInput = `
  .program blink
  pull block
  out y, 32
`;

const expectedOutput = `# -------------------------------------------------- #
# This file is autogenerated by pioasm; do not edit! #
# -------------------------------------------------- #

import rp2
from machine import Pin
# ----- #
# blink #
# ----- #

@rp2.asm_pio()
def blink():
    wrap_target()
    pull(block)                           # 0
    out(y, 32)                            # 1
    wrap()

`;

async function main() {
  assert.strictEqual(await pioasm(testInput, 'python'), expectedOutput);
  assert.strictEqual(await pioasm(testInput, 'hex'), '80a0\n6040');
  console.log('Test passed successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
