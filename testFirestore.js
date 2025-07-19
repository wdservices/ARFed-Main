const db = require('./firebase.js');

async function test() {
  const snapshot = await db.collection('users').get();
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
}

test();