import axios from 'axios';

export default async function handler(req, res) {
  const { method } = req;

  // Get the auth token from headers
  const authToken = req.headers['auth-token'];

  if (!authToken) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'auth-token': authToken,
  };

  try {
    switch (method) {
      case 'GET':
        // Fetch all ads
        const getResponse = await axios.get('https://arfed-api.onrender.com/api/ads', { headers });
        return res.status(200).json(getResponse.data);

      case 'POST':
        // Create new ad
        const postResponse = await axios.post('https://arfed-api.onrender.com/api/ads', req.body, { headers });
        return res.status(201).json(postResponse.data);

      case 'PUT':
        // Update ad - this is the missing endpoint
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'Ad ID is required' });
        }
        
        // Since the external API doesn't support PUT, we'll implement a workaround
        // by deleting the old ad and creating a new one with the updated data
        try {
          // First, delete the existing ad
          await axios.delete(`https://arfed-api.onrender.com/api/ads/${id}`, { headers });
          
          // Then create a new ad with the updated data
          const updateResponse = await axios.post('https://arfed-api.onrender.com/api/ads', req.body, { headers });
          
          return res.status(200).json({
            ...updateResponse.data,
            message: 'Ad updated successfully'
          });
        } catch (error) {
          console.error('Error updating ad:', error);
          return res.status(500).json({ error: 'Failed to update ad' });
        }

      case 'DELETE':
        // Delete ad
        const { id: deleteId } = req.query;
        if (!deleteId) {
          return res.status(400).json({ error: 'Ad ID is required' });
        }
        
        await axios.delete(`https://arfed-api.onrender.com/api/ads/${deleteId}`, { headers });
        return res.status(200).json({ message: 'Ad deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.status(error.response.status).json({
        error: error.response.data?.error || 'API request failed',
        details: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(503).json({ error: 'No response from external API' });
    } else {
      // Something happened in setting up the request that triggered an Error
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
} 