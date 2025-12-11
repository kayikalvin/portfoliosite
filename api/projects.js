export default function handler(req, res) {
  if (req.method === 'GET') {
    // Example: return a list of projects
    res.status(200).json({ projects: [] });
  } else if (req.method === 'POST') {
    // Example: create a new project
    res.status(201).json({ message: 'Project created' });
  } else if (req.method === 'PUT') {
    // Example: update a project
    res.status(200).json({ message: 'Project updated' });
  } else if (req.method === 'DELETE') {
    // Example: delete a project
    res.status(200).json({ message: 'Project deleted' });
  } else {
    res.status(405).end();
  }
}
