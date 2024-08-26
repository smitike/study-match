// bcryptTest.js
const bcrypt = require('bcryptjs');

// Replace with the actual plain password and hash from your database
const plainPassword = '123';
const storedHash = '$2a$08$h/uPt32vvAyblFxeD3A1y.M1q/a/aVCljDFQfOSWWAoqRaN/63Kym'; // Example hash

bcrypt.compare(plainPassword, storedHash, (err, res) => {
    if (res) {
        console.log('Password matches!');
    } else {
        console.log('Password does NOT match!');
    }
});
