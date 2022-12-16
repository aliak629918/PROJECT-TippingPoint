const express = require('express')
const app = express()


let items = [
  {id: 1,
    name: "table",
category: "furniture"
},
{id: 2,
    name: "TV",
category: "electronics"
}
]

app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/items', (request, response) => {
  response.json(items)
})

app.get('/api/items/:id', (request, response) => {
    const id = Number(request.params.id)
    const item = items.find(item => item.id === id)
    if (item) {
        response.json(item)
    } else {
        response.status(404).send({msg: "Not Found"})
    }
  })

  app.delete('/api/items/:id', (request, response) => {
    const id = Number(request.params.id)
    items = items.filter(item => item.id !== id)
  
    response.status(204).send({msg: "Item Deleted"})
  })

  app.post('/api/items', (request, response) => {
    const maxId = items.lenght > 0
    ? Math.max(...items.map(i => i.id))
    :0
    const item = request.body

    if (!item.name || !item.category) {
        return response.status(400).json({ 
          error: 'parameters missing' 
        })
    }
        const newItem = {
            id: item.id,
            name: item.name,
            category: item.category,
        }
    items = items.concat(newItem)
    response.json(newItem)
  })
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})