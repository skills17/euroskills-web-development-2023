import express from 'express';
import cors from 'cors';
import { getArticles } from './articles';

let currentId = 0;

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(cors());

app.get('/api/news', (req, res) => {
    return res.json({ items: getArticles(currentId, `http://${req.headers.host}`) });
});

app.post('/api/news/publish', (req, res) => {
    currentId++;
    return res.status(201).send();
});

app.use('/images', express.static(`${__dirname}/../images`));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
