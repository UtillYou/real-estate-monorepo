// Usage: node generate_bcrypt_hash.js <your_password>

const bcrypt = require('bcrypt');
const password = process.argv[2];
if (!password) {
  console.error('Usage: node generate_bcrypt_hash.js <your_password>');
  process.exit(1);
}
bcrypt.hash(password, 10).then(hash => {
  console.log('Bcrypt hash:', hash);
});
