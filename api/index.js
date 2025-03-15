require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const axios = require('axios')

app.use(express.json())
app.use(cors())

const secretKey = process.env.SECRET_KEY

const ZAP_API_URL = process.env.ZAP_URL
const ZAP_API_KEY = process.env.ZAP_API

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
})

db.connect((error) => {
    if (error) {
        console.error('Erreur de connexion Mysql : ', error)
    } else {
        console.log('connected')
    }
})

app.get('/zap/status', (req, response) => {
    axios.get(`${ZAP_API_URL}/JSON/core/view/version/?apikey=${ZAP_API_KEY}`)
        .then(zapResponse => {
            if (zapResponse.data && zapResponse.data.version) {
                response.json({ status: 'connected', version: zapResponse.data.version})
            } else {
                response.status(500).json({status: 'error', error: 'Réponse ZAP invalide'})
            }
        })
        .catch(error => {
            console.error('Erreur lors de la connexion à ZAP:', error)
            response.status(500).json({status: 'disconnected', error: 'Impossible de se connecter à ZAP'
            })
        })
})

// route de connexion
app.post('/authentication', (request, response) => {
    const {username, password} = request.body

    db.query('select * from users where username = ?', username, (error, result) => {
        if (error) {
            console.log(error)
            return response.json(error)
        }

        if (result.length === 0) {
            return response.status(401).json({message: 'username introuvable'})
        }

        const username = result[0]

        bcrypt.compare(password, username.password, (error, match) => {
            if (error) {
                console.log(error)
                return response.json(error)
            }

            if (!match) {
                return response.status(401).json({message: 'mot de passe incorrect'})
            }

            const token = jwt.sign({id: username.user_id}, secretKey, {expiresIn: '1h'})
            return response.json({ token })
        })
    })
})

// creation d'un utilisateur
app.post('/register', (request, response) => {
    const {username, password} = request.body
    const saltRound = 12

    bcrypt.genSalt(saltRound, (error, salt) => {
        if (error) {
            console.log(error)
        }

        bcrypt.hash(password, salt, (error, hash) => {
            if (error) {
                console.log(error)
            }

            db.query('insert into users (username, password) values (?, ?)', [username, hash], (error) => {
                if (error) {
                    console.log(error)
                } else {
                    response.json('values inserted')
                }
            })
        })
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})