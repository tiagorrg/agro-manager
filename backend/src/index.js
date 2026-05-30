const express = require('express');
const cors = require('cors');

const fieldsRouter     = require('./routes/fields');
const operationsRouter = require('./routes/operations');
const harvestsRouter   = require('./routes/harvests');
const dashboardRouter  = require('./routes/dashboard');
const reportsRouter    = require('./routes/reports');
const recommendationsRouter = require('./routes/recommendations');
const documentsRouter = require('./routes/documents');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

app.use('/fields',     fieldsRouter);
app.use('/operations', operationsRouter);
app.use('/harvests',   harvestsRouter);
app.use('/dashboard',  dashboardRouter);
app.use('/reports',    reportsRouter);
app.use('/recommendations', recommendationsRouter);
app.use('/documents', documentsRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`API сервер запущен на http://localhost:${PORT}`);
});
