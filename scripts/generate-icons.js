import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, r, g, b) {
  // 8-byte PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth: 8
  ihdrData.writeUInt8(6, 9); // color type: 6 (RGBA)
  ihdrData.writeUInt8(0, 10); // compression method: 0
  ihdrData.writeUInt8(0, 11); // filter method: 0
  ihdrData.writeUInt8(0, 12); // interlace method: 0
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw image scanlines (each row starts with filter byte 0)
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;
  const innerRadius = width * 0.35;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < innerRadius) {
        // Inner golden / plate
        rawData[pxOffset] = 254;     // R
        rawData[pxOffset + 1] = 243; // G
        rawData[pxOffset + 2] = 199; // B
        rawData[pxOffset + 3] = 255; // A
      } else if (dist < radius) {
        // Border ring
        rawData[pxOffset] = 245;
        rawData[pxOffset + 1] = 158;
        rawData[pxOffset + 2] = 11;
        rawData[pxOffset + 3] = 255;
      } else {
        // Background rounded card
        const cornerR = width * 0.22;
        const inCorner =
          (x < cornerR || x > width - cornerR) &&
          (y < cornerR || y > height - cornerR);
        let alpha = 255;
        if (inCorner) {
          const cornerX = x < cornerR ? cornerR : width - cornerR;
          const cornerY = y < cornerR ? cornerR : height - cornerR;
          const cDist = Math.hypot(x - cornerX, y - cornerY);
          if (cDist > cornerR) alpha = 0;
        }

        rawData[pxOffset] = r;
        rawData[pxOffset + 1] = g;
        rawData[pxOffset + 2] = b;
        rawData[pxOffset + 3] = alpha;
      }
    }
  }

  // IDAT chunk
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);

  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// Generate 192x192 and 512x512 PNGs with rich orange (#ea580c)
const icon192 = createPNG(192, 192, 234, 88, 12);
fs.writeFileSync('public/icons/icon-192.png', icon192);

const icon512 = createPNG(512, 512, 234, 88, 12);
fs.writeFileSync('public/icons/icon-512.png', icon512);

console.log('PNG Icons successfully generated in public/icons/');

