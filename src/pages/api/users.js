import db from '../../../firebaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get all users
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } else if (req.method === 'POST') {
    // Add a new user
    const userData = req.body;
    const docRef = await db.collection('users').add(userData);
    res.status(201).json({ id: docRef.id });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}