const Sequelize = require('sequelize')
const sequelize = new Sequelize('afcdxd_mlluiz29', 'afcdxd_mlluiz29', 'Julia2912@', {
  host: 'mysql-ag-br1-11.conteige.cloud',
  dialect: 'mysql',
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

  module.exports = sequelize