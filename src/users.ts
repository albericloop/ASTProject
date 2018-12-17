import { LevelDb } from './db'
import WriteStream from 'level-ws'
import encoding from 'encoding-down'
import leveldown from 'leveldown'
import levelup from 'levelup'

export class User {
  public id: number
  public username: string
  public password: string

  constructor( id: number, username: string, password: string) {
    this.id = id
    this.username = username
    this.password = password
  }
}

export class UsersHandler {

  private db: any
  ws = WriteStream(this.db)

  constructor(dbPath: string) {
    this.db = LevelDb.open(dbPath)
  }

  public save(key: number, user: User, callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    //users.forEach((m: User) => {
      stream.write({ key: user.id, value: `try:${user.username}${user.password}` })
      //stream.write({ key: `metric:${key}${m.timestamp}`, value: m.value })
    //})
    stream.end()
  }

  public get(username: string, callback: (err: Error | null, result?: User) => void) {
    this.db.get(`user:${username}`, function (err: Error, data: any) {
      if (err) callback(err)
      else if (data === undefined) callback(null, data)
      //else callback(null, User.fromDb(username, data))
    })
  }
}
