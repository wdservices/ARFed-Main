import db from '../../../firebaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get all models
    const snapshot = await db.collection('models').get();
    const models = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(models);
  } else if (req.method === 'POST') {
    // Add a new model
    const modelData = req.body;
    const docRef = await db.collection('models').add(modelData);
    res.status(201).json({ id: docRef.id });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}