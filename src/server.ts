import express = require('express')
var bodyparser = require('body-parser');
const app = express()
const port: string = process.env.PORT || '8081'
import {UsersHandler} from './users'
import {User} from './users'

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

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
  const db = new UsersHandler('./db/users')
  db.save(7, user, (err: Error | null) => {
    if (err) {
      throw err
    }
    //res.json(result)
  })
  res.write('signin test')
  res.end()
})

app.get('/user/:id', (req: any, res: any, next: any) => {
  const db = new UsersHandler('./db/users')
  db.get(req.params.id, (err: Error | null, result?: User[]) => {
    if (err) next(err)
    if (result === undefined) {
      res.write('no result')
      res.send()
    } else {
      res.json(result)
    }
  })
})

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})
