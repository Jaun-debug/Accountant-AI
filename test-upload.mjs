import fs from 'fs';
import path from 'path';

async function testUpload() {
    const fileBuf = fs.readFileSync(path.join(process.cwd(), 'storage/statements/Jaun 02:01.pdf'));
    const blob = new Blob([fileBuf], { type: 'application/pdf' });

    // We can't use node-fetch or similar out of the box unless installed, let's use global fetch
    const formData = new FormData();
    formData.append('file', blob, 'Jaun 02:01.pdf');
    formData.append('keywords', 'Spar');
    formData.append('listName', 'groceries');

    try {
        const response = await fetch('http://localhost:3000/api/analyze-statement', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", data);
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

testUpload();
