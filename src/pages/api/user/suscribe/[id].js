import db from '../../../../../firebaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { plan, startDate, endDate, paymentId, flw_ref } = req.body;

    try {
      await db.collection('users').doc(id).update({
        plan,
        startDate,
        endDate,
        paymentId,
        flw_ref,
        lastPaymentDate: new Date().toISOString(),
        paymentStatus: 'verified'
      });
      res.status(200).json({ message: 'Subscription updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}