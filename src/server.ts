import express = require('express')
var bodyparser = require('body-parser');
const app = express()
const port: string = process.env.PORT || '8081'
import {UsersHandler} from './users'
import {User} from './users'

app.set('view engine', 'ejs')
app.set('views', __dirname + '/../views')
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

app.get('/signin', (req: any, res: any, next: any) => {
  res.render('signin')
})

app.post('/signin', (req: any, res: any, next: any) => {
  const user = new User(1,req.body.username,req.body.password)
  db.save(0, user, (err: Error | null) => {
    if (err) {
      throw err
    }else{
      res.redirect('/login')
    }
  })
})

app.get('/login', (req: any, res: any, next: any) => {
  res.render('login')
})

app.post('/login', (req: any, res: any, next: any) => {
  db.login(req.body.username, req.body.password, (err: Error | null, result?: boolean) => {
    if (err) next(err)
    if (result == false) {
      res.write('not connected')
      res.send()
      res.redirect('/login')
    } else {
      res.redirect('/')
    }
  })
})

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})
