const { renderToString } = require('@vue/server-renderer')
const fs = require('fs')
const path = require('path')
const manifest = require('./dist/server/ssr-manifest.json')

const express = require('express')
const server = express()

const appPath = path.join(__dirname, './dist', 'server', manifest['app.js'])
const createApp = require(appPath).default

server.use('/img', express.static(path.join(__dirname, './dist/client', 'img')))
server.use('/js', express.static(path.join(__dirname, './dist/client', 'js')))
server.use('/css', express.static(path.join(__dirname, './dist/client', 'css')))
server.use(
    '/favicon.ico',
    express.static(path.join(__dirname, './dist/client', 'favicon.ico'))
)

server.get('*', async (_req, res)=> {
    const { app } = createApp()
    
    const appContent = await renderToString(app)
    console.log(appContent)
    fs.readFile(path.join(__dirname, '/dist/client/index.html'), (err, html) => {
        if (err) throw err

        html = html.toString().replace('<div id="app">', `<div id="app">${appContent}`)
        res.setHeader('Content-Type', 'text/html')
        res.send(html)
    })
})
console.log('listen: http://localhost:9090/')
server.listen(9090)

