export default function handler(req: any, res: any) {
  const { email, password } = req.body;
  if (email && password) {
    const role = email.includes('admin') ? 'admin' : email.includes('org') ? 'organizer' : 'user';
    res.status(200).json({ token: 'mockToken123', role });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}
