import express = require('express')
var bodyparser = require('body-parser');
const app = express()
const port: string = process.env.PORT || '8081'
import morgan = require('morgan')
import {UsersHandler} from './users'
import {User} from './users'
import {MetricsHandler} from './metrics'
import {Metric} from './metrics'

app.set('view engine', 'ejs')
app.set('views', __dirname + '/../views')
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
const db = new UsersHandler('./db/users')
const dbmetrics = new MetricsHandler('./db/metrics')

import session = require('express-session')
import levelSession = require('level-session-store')
const LevelStore = levelSession(session)
app.use(morgan('dev'))
app.use(session({
  secret: 'this is a very secret secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))

app.get('/', (req: any, res: any) => {
  if(req.session.loggedIn == true){
    res.render('connected')
  }else{
    res.render('connect')
  }
  res.end()
})

app.get('/logout', (req: any, res: any) => {
  req.session.loggedIn = false
  req.session.user = ""
  res.redirect('/')
})

app.get('/signup', (req: any, res: any, next: any) => {
  res.render('signup')
})

app.post('/signup', (req: any, res: any, next: any) => {
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
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = req.body.username
      res.redirect('/')
    }
  })
})

app.get('/newmetric', (req: any, res: any, next: any) => {
  if(req.session.loggedIn == true){
    res.render('newmetric')
  }else{
    res.redirect('/')
  }
  res.end()
})

app.post('/newmetric', (req: any, res: any, next: any) => {
  const metric = new Metric(req.body.timestamp,0,req.session.user)
  dbmetrics.save(metric, (err: Error | null, result?: boolean) => {
    if (err) next(err)
    if (result == false) {
      res.redirect('/')
    } else {
      res.redirect('/')
    }
  })
})

app.get('/metriclist', (req: any, res: any, next: any) => {
  if(req.session.loggedIn == true){
    dbmetrics.get(req.session.user, (err: Error | null, result?: Metric[]) => {
      if (err) throw err
      if (result === undefined) {
        console.log("undefined")
        //res.write('no result')
        //res.send()
      } else {
        //console.log("result")
        res.json(result)
      }
    })
  }else{
    res.redirect('/')
  }
})

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})
