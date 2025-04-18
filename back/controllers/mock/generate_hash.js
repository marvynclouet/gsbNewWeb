const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hash généré :', hashedPassword);
  console.log('\nScript SQL complet :');
  console.log(`INSERT INTO users (email, password, role) 
VALUES (
    'admin@gsb.com',
    '${hashedPassword}',
    'admin'
);`);
}

generateHash(); 