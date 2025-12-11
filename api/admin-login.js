export default function handler(req, res) {
  if (req.method === 'POST') {
    // Example: check password and return token
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
      res.status(200).json({ token: 'your-token' });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } else {
    res.status(405).end();
  }
}
