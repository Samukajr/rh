require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Rotas
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const medicalCertificateRoutes = require('./routes/medicalCertificates');
const leaveRequestRoutes = require('./routes/leaveRequests');
const timeEntryRoutes = require('./routes/timeEntries');
const payslipRoutes = require('./routes/payslips');
const importRoutes = require('./routes/import');
const dashboardRoutes = require('./routes/dashboard');

// Middleware
const errorHandler = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

// Database
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || 100),
  message: 'Muitas tentativas, tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Security & General Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);

// CORS
app.use(cors({
  origin: [
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'https://rh-k0eqvat5j-samuels-projects-20b0b165.vercel.app',
    'https://rh-nu.vercel.app',
    /^https:\/\/rh-.*\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (uploads)
app.use('/uploads', express.static('uploads'));

// Static files (public assets - logos, etc)
app.use('/public', express.static('public'));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root endpoint - API Information
app.get('/', (req, res) => {
  res.json({
    name: 'RH Plus API',
    version: '1.0.0',
    description: 'API para Sistema de Gestão de Recursos Humanos',
    frontend: 'http://localhost:3001',
    documentation: 'http://localhost:3000/api-docs',
    endpoints: {
      auth: '/api/auth',
      employees: '/api/employees',
      timeEntries: '/api/time-entries',
      leaveRequests: '/api/leave-requests',
      medicalCertificates: '/api/medical-certificates',
      payslips: '/api/payslips'
    },
    health: '/health',
    timestamp: new Date().toISOString()
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', authenticateToken, employeeRoutes);
app.use('/api/medical-certificates', authenticateToken, medicalCertificateRoutes);
app.use('/api/leave-requests', authenticateToken, leaveRequestRoutes);
app.use('/api/time-entries', authenticateToken, timeEntryRoutes);
app.use('/api/payslips', authenticateToken, payslipRoutes);
app.use('/api/import', authenticateToken, importRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

// Error Handler
app.use(errorHandler);

// Database Connection & Server Start
async function startServer() {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida');

    // Sync models (simplified to avoid infinite loops)
    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync({ force: false });
      
      // Adicionar coluna email se não existir
      try {
        await db.sequelize.query("ALTER TABLE employees ADD COLUMN email VARCHAR(255);");
        console.log('✅ Coluna email adicionada');
      } catch (error) {
        if (error.parent && error.parent.code === 'SQLITE_ERROR' && error.parent.message.includes('duplicate column')) {
          console.log('✅ Coluna email já existe');
        } else {
          console.log('⚠️ Tentativa de adicionar coluna email:', error.message);
        }
      }
      
      console.log('✅ Modelos sincronizados');
    }

    // Create default admin user
    const createDefaultUser = require('../seeders/default-user');
    await createDefaultUser();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Servidor RHPlus rodando na porta ${PORT}`);
      console.log(`📚 Documentação API: http://localhost:${PORT}/api-docs`);
      console.log(`🩺 Health Check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('👋 Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 Encerrando servidor...');
  process.exit(0);
});

startServer();

module.exports = app;