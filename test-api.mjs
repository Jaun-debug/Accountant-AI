import { PDFParse } from 'pdf-parse';
import fs from 'fs';
const fileBuf = fs.readFileSync('storage/statements/Jaun 02:01.pdf');
const parser = new PDFParse();
const text = await parser.parse(fileBuf);
console.log(text.text.substring(0, 50));
