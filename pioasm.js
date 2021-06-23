/** pioasm in Web Assembly
 * Copyright (C) 2021, Uri Shaked
 */

/// <reference types="emscripten" />

import wasm from '#pioasm-emcc';

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
 * PIO Assembler wrapper class
 */
export class PIOAssembler {
  /** @private */
  exitCode = 0;
  /** @private */
  outputBuffer = [];
  /** @private */
  instance;

  constructor() {}

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
  async load(options) {
    if (!this.instance) {
      this.instance = wasm({
        noInitialRun: true,
        print: (msg) => {
          this.outputBuffer.push(msg);
        },
        printErr: (msg) => {
          this.outputBuffer.push(msg);
        },
        quit: (code) => {
          this.exitCode = code;
        },
        ...options,
      });
    }
    return this.instance;
  }

  /**
   * Compiles the given PIO source file.
   *
   * @param {string} source PIO source to compile
   * @param {PioOutputFormat} [format='c-sdk'] Output format
   * @param {string} [outputParam] Add a parameter to be passed to the output format generator
   * @returns Promise<{output: string, exitCode: number}>
   */
  async assemble(source, format = 'c-sdk', outputParam) {
    const runtime = await this.load();
    runtime.FS_writeFile('/input.pio', source);
    this.outputBuffer = [];
    this.exitCode = 0;
    const argv = ['-o', format];
    if (outputParam) {
      argv.push('-p', outputParam);
    }
    argv.push('input.pio');
    runtime.callMain(argv);
    return {
      output: this.outputBuffer.join('\n'),
      exitCode: this.exitCode,
    };
  }
}
