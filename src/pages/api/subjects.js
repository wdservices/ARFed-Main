import db from '../../../firebaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const snapshot = await db.collection('subjects').get();
    const subjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(subjects);
  } else if (req.method === 'POST') {
    const subjectData = req.body;
    const docRef = await db.collection('subjects').add(subjectData);
    res.status(201).json({ id: docRef.id });
  } else {
    res.status(405).end();
  }
} 