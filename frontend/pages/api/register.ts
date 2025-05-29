export default function handler(req: any, res: any) {
  const { email, password } = req.body;
  if (email && password) {
    res.status(200).json({ token: 'mockToken123', role: 'user' });
  } else {
    res.status(400).json({ error: 'Invalid data' });
  }
}
