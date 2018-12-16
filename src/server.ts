import express = require('express')
var bodyparser = require('body-parser');
const app = express()
const port: string = process.env.PORT || '8081'

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.get('/', (req: any, res: any) => {
  res.write('Hello world')
  res.end()
})

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})
