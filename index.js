import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = 80
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, browser) => { browser.send('API PROXY SYSTEMS ONLINE') })
app.get('/favicon.ico', (req, browser) => { browser.sendStatus(404) })
app.all('*', async (req, browser) => { handleProxiedRequests(req, browser) })

async function handleProxiedRequests (req, browser) {
  if (req.method === 'GET') {
    const response = await fetch(`${process.env.API_BASEURL}${req.url}`)
    const data = await response.json()
    browser.send(data)
    return
  }

  const fetchConfig = {
    method: req.method,
    body: JSON.stringify(req.body),
    headers: { 'Content-Type': 'application/json' }
  }
  const response = await fetch(`${process.env.API_BASEURL}${req.url}`, fetchConfig)
  const data = await response.json()
  browser.send(data)
}

app.listen(port, () => console.log(`API PROXY SYSTEMS ONLINE ON PORT ${port}`))
