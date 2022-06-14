const express = require('express')
const { randomUUID } = require('crypto')
const fs = require('fs')
const cors = require('cors')  

const port = process.env.PORT || 3001
const app = express()

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

let users = []

const usersFile = data => {
  fs.writeFile('users.json', JSON.stringify(users), err => {
    if (err) {
      return console.log(err)
    } else {
      console.log(data)
    }
  })
}

fs.readFile('users.json', (error, data) => {
  if (error) {
    console.log(error)
  } else {
    users = JSON.parse(data)
  }
})

app.post('/users', (req, res) => {
  const { name, email } = req.body
  let user = {
    id: randomUUID(),
    name,
    email,
  }
  users.push(user)

  usersFile('Usuário cadastrado com sucesso')

  return res.status(201).json(user)
})

app.get('/users', (req, res) => {
  return res.json(users)
})

app.get('/users/:id', (req, res) => {
  //const identificador = req.params.id
  const { id } = req.params
  const user = users.find(user => user.id === id)

  return res.json(user)
})

app.put('/users/:id', (req, res) => {
  // - PUT faz alteração completa
  const { id } = req.params // pega o id para alterar
  const { name, email } = req.body // pega os dados enviados no corpo
  const index = users.findIndex(user => user.id === id) // busca o index do usuário que tem o id passado
  users[index] = {
    ...users[index],
    name,
    email,
  }
  usersFile('Usuário atualizado com sucesso')

  return res.json(users)
})

app.patch('/users/:id', (req, res) => {
  // - PATCH faz alteração parcial
  const { id } = req.params
  const { name, email } = req.body

  const user = users.find(user => user.id === id)

  if (!user) {
    res.status(404).json({ error: 'User not found!' })
  }
  user.name = name
  user.email = email

  return res.json('Usuário atualizado com sucesso!')
})

app.delete('/users/:id', (req, res) => {
  const { id } = req.params

  const index = users.findIndex(user => user.id === id)

  if (index < 0) {
    return res.status(404).json({ error: 'Usuário não encontrado!' })
  }
  users.splice(index, 1)

  usersFile('Usuário excluído com sucesso')

  return res.status(204).json()
})

app.listen(port, () =>
  console.log(`🚀 Server started in http://localhost:${port}`)
)
