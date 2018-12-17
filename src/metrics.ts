import { LevelDb } from './db'
import WriteStream from 'level-ws'
import encoding from 'encoding-down'
import leveldown from 'leveldown'
import levelup from 'levelup'

export class Metric {
  public timestamp: string
  public value: number
  public username: string

  constructor(ts: string, v: number, username: string) {
    this.timestamp = ts
    this.value = v
    this.username = username
  }
}

export class MetricsHandler {

  private db: any
  ws = WriteStream(this.db)

  constructor(dbPath: string) {
    this.db = LevelDb.open(dbPath)
  }

  public save(metric: Metric, callback: (error: Error | null, result?: boolean) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    stream.write({ key: `metric:${metric.username}:${metric.timestamp}`, value: metric.value })
    stream.end()
  }

  public get(usernameP: string, callback: (err: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream()
    var met: Metric[] = []
    stream.on('error', callback)
    .on('end', (err:'error') => {
      callback(null, met)
    })
    .on('data', (data:any) => {
      const [ , username, timestamp] = data.key.split(":")
      const value = data.value
      if (username !== usernameP) {
        console.log(username)
      }else {
        console.log(username)
        met.push(new Metric(timestamp, value, username))
      }
    })
  }
}
