import db from '../../../firebaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const snapshot = await db.collection('payments').get();
    const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(payments);
  } else if (req.method === 'POST') {
    const paymentData = req.body;
    const docRef = await db.collection('payments').add(paymentData);
    res.status(201).json({ id: docRef.id });
  } else {
    res.status(405).end();
  }
} 