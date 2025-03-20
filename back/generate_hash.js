const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'test123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Nouveau hash pour le mot de passe "test123":');
  console.log(hash);
  process.exit(0);
}

generateHash().catch(console.error); 