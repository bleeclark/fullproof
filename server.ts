import express, { Request, Response } from 'express';

const server = express();
const port = 3000;

server.use(express.json());

server.post('/print', (req: Request, res: Response) => {
    const { str1, str2 } = req.body;

    if (typeof str1 !== 'string' || typeof str2 !== 'string') {
        return res.status(400).json({ error: 'Both inputs must be strings' });
    }

    console.log(`Received strings: ${str1}, ${str2}`);
    res.json({ message: 'Strings printed successfully' });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
