import express, { Application } from 'express';
import connect from './connect/connect';
import dotenv from 'dotenv';
import router from './routes/routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app: Application = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

const PORT: number = parseInt(process.env.PORT || '8000', 10); // Parse PORT as number

app.use("/", router);

app.listen(PORT, () => {
  connect();
  console.log(`Server running on ${PORT}`);
});
