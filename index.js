const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan');
const cors = require('cors');

app.use(bodyParser.json())
app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('build'))

morgan.token('req-body', (req) => {
    return JSON.stringify(req.body);
  });

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

let phonebook = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
      },
      { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
      },
      { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
      },
      { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
      }

]

app.get('/api/persons', (req, res) => {
    res.json(phonebook);
  });
  

app.get('/info', (req, res) => {
    const currentDate = new Date()
    const responseText = ` <p>Phonebook has info for ${phonebook.length} people</p> <p>${currentDate}</p>`
  
    res.setHeader('Content-Type', 'text/html')
    res.send(responseText);
  })

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
  
    const person = phonebook.find((entry) => entry.id === id)
  
    if (person) {
      res.json(person)
    } else {
      res.status(404).json({ error: 'Person not found' })
    }
  })

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
  
    const index = phonebook.findIndex((entry) => entry.id === id)
  
    if (index !== -1) {
      phonebook = phonebook.filter((entry) => entry.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json({ error: 'Person not found' })
    }
  })

app.post('/api/persons', (req, res) => {
    const body = req.body
  
    if (!body.name || !body.number) {
      return res.status(400).json({ error: 'name and number are required' })
    }

    if (phonebook.some((entry) => entry.name === body.name)) {
        return res.status(400).json({ error: 'name must be unique' })
    }
  
    const newEntry = {
      id: generateRandomId(),
      name: body.name,
      number: body.number
    }
  
    phonebook = phonebook.concat(newEntry)
    res.json(newEntry)
  })
  
  generateRandomId = () => {
    return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  }

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
