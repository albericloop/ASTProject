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
    stream.write({ key: `user:${key}:${user.username}:${user.password}`, value: user.id, })
    stream.end()
  }

  public get(key: string, callback: (err: Error | null, result?: User[]) => void) {
    const stream = this.db.createReadStream()
    var user: User[] = []
    stream.on('error', callback)
      .on('end', (err: Error) => {
        callback(null, user)
      })
      .on('data', (data: any) => {
        const [_, k, username, password] = data.key.split(":")
        const value = data.value
        if (key != k) {
          console.log(`no item for that key`)
        } else {
          user.push(new User(value, username, password))
        }
      })
  }

  public login(username: string, password: string, callback: (err: Error | null, result?: boolean = false) => void) {
    const stream = this.db.createReadStream()
    var user: User[] = []
    stream.on('error', callback)
      .on('end', (err: Error) => {
        callback(null, user)
      })
      .on('data', (data: any) => {
        const [_, k, username, password] = data.key.split(":")
        const value = data.value
        if (username != username) {
          return false
          console.log(`no item for that key`)
        } else if(password == password){
          return true
          //user.push(new User(value, username, password))
        }
      })
  }
}
