# @4relial/kursbca

Import-only library untuk mengambil **e-Rate** kurs BCA dari halaman publik.
Dual export **ESM** dan **CommonJS**. Tanpa server/CLI.

> Non-official.

## Instalasi (via GitHub)
```bash
npm i github:4relial/KursBCA
# atau
pnpm add github:4relial/KursBCA
# atau
yarn add github:4relial/KursBCA
```

## Pemakaian

### ESM
```js
import { kursBCA } from "@4relial/kursbca";

const result = await kursBCA();
console.log(result);
```

### CommonJS
```js
const { kursBCA } = require("@4relial/kursbca");

kursBCA().then(console.log);
```

## Output
```json
{
  "date": "2025-10-28T10:45:00+07:00",
  "data": [
    { "mts": "USD", "buy": 16000, "sell": 16100, "date": "2025-10-28T10:45:00+07:00" }
  ]
}
```

## API
- `kursBCA(): Promise<{ date: string|null, data: Array<{mts:string,buy:number,sell:number,date:string|null}> }>`

## Catatan
- Menggunakan **global `fetch`** (Node 18+). Jika Node di bawah itu, pasang polyfill `undici`.
- Selector DOM mengikuti struktur situs BCA saat ini; update jika ada perubahan.
