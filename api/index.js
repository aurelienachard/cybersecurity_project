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

// verifier qu'on peut se connecter a la page zap
app.get('/zap/status', (request, response) => {
    axios.get(`${ZAP_API_URL}/JSON/core/view/version/?apikey=${ZAP_API_KEY}`)
        .then(reponse => {
            if (reponse.data && reponse.data.version) {
                response.json({ status: 'connected', version: reponse.data.version})
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

// demarrer le spider scan
app.post('/zap/spider', (request, response) => {
    const {targetURL} = request.body

    if (!targetURL) {
        return response.status(400).json({ status: 'error', error: 'URL cible requis'})
    }

    axios.get(`${ZAP_API_URL}/JSON/spider/action/scan/?apikey=${ZAP_API_KEY}&url=${encodeURIComponent(targetURL)}`)
    .then(zapReponse => {
        if (zapReponse.data && zapReponse.data.scan) {
            response.json({status: 'success', scanID: zapReponse.data.scan})
        } else {
            response.status(500).json({status: 'error', error: 'Response ZAP Invalide'})
        }
    })
    .catch(error => {
        console.log('Erreur lors du chargement du lancement du spider scan:', error)
        response.status(500).json({status: 'error', error: 'Impossible de lancer le spider scan'})
    })
})

// voir le pourcentage d'un spider scan
app.get('/zap/spider/status/:scanID', (request, response) => {
    const {scanID} = request.params

    axios.get(`${ZAP_API_URL}/JSON/spider/view/status/?apikey=${ZAP_API_KEY}&scanId=${scanID}`)
    .then(zapReponse => {
        if (zapReponse.data && zapReponse.data.status !== undefined) {
            response.json({status: 'success', progress: zapReponse.data.status, completed: zapReponse.data.status === "100"})
        } else {
            response.status(500).json({status: 'error', error: 'Réponse ZAP Invalide'})
        }
    })
    .catch(error =>{
        console.log('Erreur lors de la vérification du statut du scan:', error)
        response.status(500).json({status: 'error', error: 'Impossible de vérifier le statut du scan'})
    })
})

// stop le spider scan
app.get('/zap/spider/stop/:scanID', (request, response) => {
    const {scanID} = request.params
    axios.get(`${ZAP_API_URL}/JSON/spider/action/stop/?apikey=${ZAP_API_KEY}&scanId=${scanID}`)
    .then(zapResponse => {
        if (zapResponse.data && zapResponse.data.Result) {
            response.json({status: 'succes', message: 'Spider scan arrêté'})  // Utilisez response, pas zapResponse
        } else { 
            response.status(500).json({status: 'error', error: 'Réponse ZAP Invalide'})  // Utilisez response, pas zapResponse
        }
    })
    .catch(error =>{
        console.log('Erreur lors de l\'arrêt du spider scan:', error)
        response.status(500).json({status: 'error', error: 'Impossible d\'arrêter le spider scan'})
    })
})

// pause le spider scan
app.get('/zap/spider/pause/:scanID', (request, response) => {
    const {scanID} = request.params
    axios.get(`${ZAP_API_URL}/JSON/spider/action/pause/?apikey=${ZAP_API_KEY}&scanId=${scanID}`)
    .then(zapResponse => {
        if (zapResponse.data && zapResponse.data.Result) {
            response.json({status: 'succes', message: 'Spider scan mis en pause'})  // Utilisez response, pas zapResponse
        } else { 
            response.status(500).json({status: 'error', error: 'Réponse ZAP invalide'})  // Utilisez response, pas zapResponse
        }
    })
    .catch(error =>{
        console.log('Erreur lors de la mise en pause du spider scan:', error)
        response.status(500).json({status: 'error', error: 'Impossible de mettre en pause le spider scan'})
    })
})

// reprendre le spider scan
app.get('/zap/spider/resume/:scanID', (request, response) => {
    const {scanID} = request.params
    axios.get(`${ZAP_API_URL}/JSON/spider/action/resume/?apikey=${ZAP_API_KEY}&scanId=${scanID}`)
    .then(zapResponse => {
        if (zapResponse.data && zapResponse.data.Result) {
            response.json({status: 'succes', message: 'Spider scan repris'})  // Utilisez response, pas zapResponse
        } else { 
            response.status(500).json({status: 'error', error: 'Response ZAP Invalide'})  // Utilisez response, pas zapResponse
        }
    })
    .catch(error =>{
        console.log('Erreur lors de la reprise du spider scan:', error)
        response.status(500).json({status: 'error', error: 'Impossible de reprendre le spider scan'})
    })
})

// lancer un scan active
app.post('/zap/activescan', (request, response) => {
    const {targetURL} = request.body

    if (!targetURL) {
        return response.status(400).json({ status: 'error', error: 'URL cible requis'})
    }
    axios.get(`${ZAP_API_URL}/JSON/ascan/action/scan/?apikey=${ZAP_API_KEY}&url=${encodeURIComponent(targetURL)}&recurse=true&inScopeOnly=&scanPolicyName=&method=&postData=&contextId=`)
    .then(zapReponse => {
        if (zapReponse.data && zapReponse.data.scan) {
            response.json({status: 'success', scanID: zapReponse.data.scan})
        } else {
            response.status(500).json({status: 'error', error: 'Reponse ZAP Invalide'})
        }
    })
    .catch(error => {
        console.log('Erreur lors du lancement de l\'Active Scan:', error)
        response.status(500).json({status: 'error', error: 'Impossible de lancer Active Scan'})
    })
})

// voir le status d'un active scan
app.get('/zap/activescan/status/:scanID', (request, response) => {
    const {scanID} = request.params

    axios.get(`${ZAP_API_URL}/JSON/ascan/view/status/?apikey=${ZAP_API_KEY}&scanId=${scanID}`)
    .then(zapReponse => {
        if (zapReponse.data && zapReponse.data.status !== undefined) {
            response.json({status: 'success', progress: zapReponse.data.status, completed: zapReponse.data.status === "100"})
        } else {
            response.status(500).json({status: 'error', error: 'Réponse ZAP Invalide'})
        }
    })
    .catch(error => {
        console.log('Erreur lors de la vérification du statut de l\'Active Scan:', error)
        response.status(500).json({status: 'error', error: 'Impossible de vérifier le statut de l\'Active Scan'})
    })
})

// voir les alertes du scan active
app.get('/zap/activescan/status', (request, response) => {
    const {targetURL} = request.body

    if (!targetURL) {
        return response.status(400).json({ status: 'error', error: 'URL cible requis'})
    }

    axios.get(`${ZAP_API_URL}/JSON/core/view/alerts/?apikey=${ZAP_API_KEY}&baseurl=${encodeURIComponent(targetURL)}&start=0&count=10`)
    .then(zapReponse => {
        if (zapReponse.data && zapReponse.data.alerts !== undefined) {
            response.json({status: 'success', alerts: zapReponse.data.alerts})
        } else {
            response.status(500).json({status: 'error', error: 'Réponse ZAP Invalide'})
        }
    })
    .catch(error =>{
        console.log('Erreur lors de la récupération des alertes:', error)
        response.status(500).json({status: 'error', error: 'Impossible de récupérer les alertes'})
    })
})

// arreter un active scan
app.get('/zap/activescan/stop/:scanID', (request, response) => {
    const {scanID} = request.params

    axios.get(`${ZAP_API_URL}/JSON/ascan/action/stop/?apikey=${ZAP_API_KEY}&scanId=${scanID}`)
    .then(zapReponse => {
        if (zapReponse.data && zapReponse.data.Result) {
            response.json({status: 'succes', message: 'Active Scan arrêté'})
        } else {
            response.status(500).json({status: 'error', error: 'Réponse ZAP Invalide'})
        }
    })
    .catch(error => {
        console.log('Erreur lors de la vérification du statut de l\'Active Scan:', error)
        response.status(500).json({status: 'error', error: 'Impossible de vérifier le statut de l\'Active Scan'})
    })
})

// generer un rapport HTML
app.get('/zap/htmlreport', (request, response) => {
    axios.get(`${ZAP_API_URL}/OTHER/core/other/htmlreport/?apikey=${ZAP_API_KEY}`, {
        responseType: 'text'
    })
    .then(zapReponse => {
        if (zapReponse.data) {
            response.setHeader('Content-Type', 'text/html');
            response.send(zapReponse.data);
        } else { 
            response.status(500).json({status: 'error', error: 'Réponse ZAP Invalide'})
        }
    })
    .catch(error => {
        console.log('Erreur lors de la génération du rapport HTML:', error)
        response.status(500).json({status: 'error', error: 'Impossible de générer le rapport HTML'})
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})