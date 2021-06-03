/** pioasm in Web Assembly
 * Copyright (C) 2021, Uri Shaked
 */

/// <reference types="emscripten" />

import wasm from '#pioasm-emcc';

let instance = null;
let outputBuffer = [];

/**
 * PIO Output format:
 * - c-sdk: C header suitable for use with the Raspberry Pi Pico SDK
 * - python: Python file suitable for use with MicroPython
 * - hex: Raw hex output (only valid for single program inputs)
 * - ada: Ada specification
 *
 * @typedef {'c-sdk'|'python'|'hex'|'ada'} PioOutputFormat
 */

/**
 * Loads the pioasm Web Assembly module. Normally, `pioasm()` will load the module for
 * you, but you can use the `load()` method to pre-loader the Web Assembly module, or
 * if you need to provide custom options to EMScripten.
 *
 * For instance, you can override the `locateFile(url: string, scriptDirectory: string)`
 * method to configure the URL for the compiled web assembly module.
 *
 * @param {Partial<EmscriptenModule>} [options]
 * @returns {Promise<EmscriptenModule>}
 */
export async function load(options) {
  if (!instance) {
    instance = wasm({
      noInitialRun: true,
      print(msg) {
        outputBuffer.push(msg);
      },
      ...options,
    });
  }
  return await instance;
}

/**
 * Compiles the given PIO source file.
 *
 * @param {string} source PIO source to compile
 * @param {PioOutputFormat} [format='c-sdk'] Output format
 * @param {string} [outputParam] Add a parameter to be passed to the output format generator
 * @returns Promise<String>
 */
export async function pioasm(source, format = 'c-sdk', outputParam) {
  const runtime = await load();
  runtime.FS_writeFile('/input.pio', source);
  outputBuffer = [];
  const argv = ['-o', format];
  if (outputParam) {
    argv.push('-p', outputParam);
  }
  argv.push('input.pio');
  runtime.callMain(argv);
  return outputBuffer.join('\n');
}
