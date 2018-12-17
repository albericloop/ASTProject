import express = require('express')
var bodyparser = require('body-parser');
const app = express()
const port: string = process.env.PORT || '8081'
import {UsersHandler} from './users'
import {User} from './users'

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
const db = new UsersHandler('./db/users')

app.get('/', (req: any, res: any) => {
  res.write('Hello world')
  res.end()
})

app.get('/test', (req: any, res: any) => {
  res.write('Hello test')
  res.end()
})

app.get('/signin/:id', (req: any, res: any) => {
  const user = new User(req.params.id,"test","test")
  db.save(7, user, (err: Error | null) => {
    if (err) {
      throw err
    }
    //res.json(result)
  })
  res.write('signin test')
  res.end()
})

app.get('/login/:username', (req: any, res: any, next: any) => {
  db.login(req.params.username, req.params.username, (err: Error | null, result?: boolean) => {
    if (err) next(err)
    if (result == false) {
      res.write('not connected')
      res.send()
    } else {
      res.write('connected')
      res.send()
    }
  })
})

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})
