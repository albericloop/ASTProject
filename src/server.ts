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

app.get('/signin', (req: any, res: any) => {
  const user = [new User(1,"name","password")]
  const db = new UsersHandler('./db')
  db.save(0, user, (err: Error | null) => {
    if (err) {
      throw err
    }
    //res.json(result)
  })
  res.write('Hello signin')
  res.end()
})

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})
