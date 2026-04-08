import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userApi from './backend/services/user.api.ts';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api/users', userApi);

app.get('/', (req: Request, res: Response) => {
  res.send('User API backend is running.');
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
