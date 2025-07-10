import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      tx_ref, 
      transaction_id, 
      status, 
      amount, 
      currency, 
      customer, 
      payment_plan,
      flw_ref 
    } = req.body;

    // Verify webhook signature (you'll need to add your Flutterwave secret hash)
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
    const signature = req.headers['verif-hash'];
    
    if (secretHash && signature !== secretHash) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Only process successful payments
    if (status !== 'successful') {
      console.log(`Payment ${transaction_id} not successful: ${status}`);
      return res.status(200).json({ message: 'Payment not successful' });
    }

    // Map payment plan IDs to plan names
    const planMapping = {
      142602: 'daily',    // NGN Daily
      143651: 'daily',    // USD Daily
      143575: 'weekly',   // NGN Weekly
      143652: 'weekly',   // USD Weekly
      142599: 'monthly',  // NGN Monthly
      143599: 'monthly',  // USD Monthly
      142601: 'termly',   // NGN Termly
      143601: 'termly',   // USD Termly
      142600: 'yearly',   // NGN Yearly
      143602: 'yearly'    // USD Yearly
    };

    const planId = planMapping[payment_plan];
    if (!planId) {
      console.error(`Unknown payment plan: ${payment_plan}`);
      return res.status(400).json({ error: 'Unknown payment plan' });
    }

    // Calculate end date based on plan
    const calculateEndDate = (planId) => {
      const now = new Date();
      switch (planId) {
        case 'daily':
          return new Date(now.setDate(now.getDate() + 1)).toISOString();
        case 'weekly':
          return new Date(now.setDate(now.getDate() + 7)).toISOString();
        case 'monthly':
          return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
        case 'termly':
          return new Date(now.setMonth(now.getMonth() + 3)).toISOString();
        case 'yearly':
          return new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();
        default:
          return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
      }
    };

    // Update user subscription in your database
    const updateData = {
      plan: planId,
      startDate: new Date().toISOString(),
      endDate: calculateEndDate(planId),
      paymentId: transaction_id,
      flw_ref: flw_ref,
      lastPaymentDate: new Date().toISOString(),
      paymentStatus: 'verified'
    };

    // Make API call to your backend to update user subscription
    const response = await fetch(`https://arfed-api.onrender.com/api/user/suscribe/${customer.email}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // You might need to add appropriate authentication here
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error(`Failed to update subscription: ${response.statusText}`);
    }

    console.log(`Successfully updated subscription for user ${customer.email}, plan: ${planId}`);
    
    res.status(200).json({ 
      message: 'Webhook processed successfully',
      plan: planId,
      transaction_id 
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
} 