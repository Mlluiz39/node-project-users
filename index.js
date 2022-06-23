const express = require('express')
const { randomUUID } = require('crypto')
const cors = require('cors')

const port = process.env.PORT || 3000
const app = express()

const User = require('./models/User')

app.use(express.json())
app.use(cors())

/*
- Query params => ?nome=valor&idade=valor  => req.query (objeto) Filtros de busca
- Route params => /users/:id (users/1) => req.params BUSCAR, DELETAR, ATUALIZAR
- Request Body => { "name": "Marcelo", "email": "mlluiz@gmail.com" } => req.body (objeto)

- GET: Buscar uma informação do back-end
- POST: Criar uma informação no back-end
- PUT / PATCH: Atualizar uma informação no back-end
- DELETE: Deletar uma informação no back-end
*/

app.post('/users', async (req, res) => {
  const { name, email } = req.body
  const user = await User.create({ id: User.id, name, email })

  return res.json(user)
})

app.get('/users', async (req, res) => {
  const users = await User.findAll()
  return res.json(users)
})

app.get('/users/:id', async (req, res) => {
  //const identificador = req.params.id
  const { id } = req.params
  const user = await User.findByPk(id === id ? id : randomUUID())

  return res.json(user)
})

app.put('/users/:id', async (req, res) => {
  // - PUT faz alteração completa
  const { id } = req.params // pega o id para alterar
  const { name, email } = req.body // pega os dados enviados no corpo
  await User.update({ name, email }, { where: { id } }) // atualiza o usuário

  return res.json(User.findByPk(id))
})

app.patch('/users/:id', (req, res) => {
  // - PATCH faz alteração parcial
  const { id } = req.params
  const { name, email } = req.body

  const user = User.update({ where: { id } }, name, email)

  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado!' })
  }
  user.name = name
  user.email = email

  return res.json('Usuário atualizado com sucesso!')
})

app.delete('/users/:id', (req, res) => {
  const { id } = req.params

  const index = User.destroy({ where: { id } })

  if (index < 0) {
    return res.status(404).json({ error: 'Usuário não encontrado!' })
  }

  return res.json({ message: 'Usuário Deletado!' })
})

app.listen(port, () =>
  console.log(`🚀 Server started in http://localhost:${port}`)
)
