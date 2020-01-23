import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/route';

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(router);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to AnnouneIT!',
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`AnnounceIT running on port ${port}`);
});

export default app;
