export default function handler(req, res) {
  if (req.method === 'POST') {
    // Example: handle image upload
    res.status(200).json({ url: 'https://your-image-url.com/image.png' });
  } else {
    res.status(405).end();
  }
}
