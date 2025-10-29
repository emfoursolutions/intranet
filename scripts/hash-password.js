// ABOUTME: Utility script to generate bcrypt password hashes for admin users
// ABOUTME: Run with: node scripts/hash-password.js your-password
const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.js <password>');
  process.exit(1);
}

if (password.length < 8) {
  console.error('Password must be at least 8 characters long');
  process.exit(1);
}

bcrypt.hash(password, 10).then(hash => {
  console.log('\nPassword Hash Generated:');
  console.log('------------------------');
  console.log(hash);
  console.log('\nYou can now insert this into the database:');
  console.log('\nINSERT INTO users (id, email, password_hash, role, created_at, updated_at)');
  console.log('VALUES (');
  console.log('  \'admin001\',');
  console.log('  \'admin@example.com\',');
  console.log(`  '${hash}',`);
  console.log('  \'admin\',');
  console.log('  NOW(),');
  console.log('  NOW()');
  console.log(');\n');
}).catch(err => {
  console.error('Error generating hash:', err);
  process.exit(1);
});
