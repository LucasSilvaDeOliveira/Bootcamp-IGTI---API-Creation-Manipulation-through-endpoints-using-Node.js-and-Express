import express from 'express';
import { promises } from 'fs';
import dataRouter from './routes/data.js';

//Declaração de variáveis

const { readFile, writeFile } = promises;
const app = express();
global.fileName = 'grades.json';

//Reconhecendo requisições

app.use(express.json());
app.use('/data', dataRouter);

app.listen(3000, () => {
  console.log('API STARTED:');
});
