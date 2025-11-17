// Usage: node generate_bcrypt_hash.js <your_password>
// The admin password is ZJSMM195 and its hash is 
// $2b$10$ep32tHl3NZIV.UV7ypYlbuIGgfyuLXvfC1aIjJLsiicsc/d/a1zwi
const bcrypt = require('bcrypt');
const password = process.argv[2];
if (!password) {
  console.error('Usage: node generate_bcrypt_hash.js <your_password>');
  process.exit(1);
}
bcrypt.hash(password, 10).then(hash => {
  console.log('Bcrypt hash:', hash);
});
