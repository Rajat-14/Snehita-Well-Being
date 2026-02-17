const fs = require('fs');
const path = require('path');
const { Blob } = require('buffer');

async function testUpload() {
    try {
        const formData = new FormData();
        formData.append('title', 'Debug Blog Native');
        formData.append('content', 'Debug Content');
        formData.append('type', 'Habit');
        formData.append('link', 'http://example.com');

        const realImage = path.join(__dirname, '../client/src/components/assets/SWBLogo.png');
        let fileBuffer;

        if (fs.existsSync(realImage)) {
            console.log('Using real image:', realImage);
            fileBuffer = fs.readFileSync(realImage);
        } else {
            console.log('Real image not found, using dummy buffer');
            fileBuffer = Buffer.from('fake image content');
        }

        const blob = new Blob([fileBuffer], { type: 'image/png' });
        formData.append('pic', blob, 'test_image.png');

        const response = await fetch('http://localhost:8000/api/blogs', {
            method: 'POST',
            body: formData
        });

        console.log('Upload Status:', response.status);
        const text = await response.text();
        console.log('Upload Response:', text);
    } catch (error) {
        console.error('Upload Failed:', error);
    }
}

testUpload();
