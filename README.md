# pioasm-wasm

Raspberry Pi Pico pioasm tool compiled to Web Assembly.

## Online pioasm

The online version of pioasm allows you to compile PIO assembly code to C/Python/Ada right in your browser:

https://wokwi.com/tools/pioasm

## Library usage example

You can install the library from npm:

```
npm install --save pioasm
```

or yarn:

```
yarn add pioasm
```

Usage example:

```javascript
import { pioasm } from 'pioasm';

const source = `
  .program blink
  pull block
  out y, 32
`;

pioasm(source).then(result => {
  console.log(result);
})
```

## License

This project, excluding pioasm, is released under the MIT license. Consult [the LICENSE file](LICENSE) for more details.
