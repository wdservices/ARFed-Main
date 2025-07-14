import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { token, owner, repo, path = '' } = req.body;
  if (!token || !owner || !repo) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const ghRes = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    if (!ghRes.ok) {
      return res.status(ghRes.status).json({ error: 'GitHub API error', details: await ghRes.text() });
    }
    const data = await ghRes.json();
    // data can be an array (directory) or object (file)
    if (Array.isArray(data)) {
      const files = data.map(f => ({ name: f.name, path: f.path, type: f.type }));
      return res.status(200).json({ files });
    } else {
      return res.status(200).json({ files: [{ name: data.name, path: data.path, type: data.type }] });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
} 