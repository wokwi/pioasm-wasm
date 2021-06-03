# pioasm-wasm

Raspberry Pi Pico pioasm tool compiled to Web Assembly.

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
