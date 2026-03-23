const express = require('express');
const cors = require('cors');

const fieldsRouter     = require('./routes/fields');
const operationsRouter = require('./routes/operations');
const harvestsRouter   = require('./routes/harvests');
const dashboardRouter  = require('./routes/dashboard');
const reportsRouter    = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/fields',     fieldsRouter);
app.use('/operations', operationsRouter);
app.use('/harvests',   harvestsRouter);
app.use('/dashboard',  dashboardRouter);
app.use('/reports',    reportsRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`API сервер запущен на http://localhost:${PORT}`);
});
