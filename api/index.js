require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

app.use(express.json())
app.use(cors())

const secretKey = process.env.SECRET_KEY

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