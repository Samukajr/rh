const { Sequelize } = require('sequelize');

// Configuração do banco de dados
const config = {
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};

// Instância do Sequelize (para uso na aplicação)
const sequelize = new Sequelize(config);

// Exportar tanto a configuração (para CLI) quanto a instância (para a aplicação)
module.exports = config;
module.exports.sequelize = sequelize;