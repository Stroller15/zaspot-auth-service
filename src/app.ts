import express, { Request, Response, Application } from 'express';

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to auth service');
});

export default app;
