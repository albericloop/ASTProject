import encoding from 'encoding-down'
import leveldown from 'leveldown'
import levelup from 'levelup'
import WriteStream from 'level-ws'

const db = levelup(encoding(
  leveldown("path"),
  { valueEncoding: 'json' })
)

const rs = db.createReadStream();
const ws = WriteStream(db);

export class LevelDb {
  static open(path: string) {
    const encoded = encoding(leveldown(path), { valueEncoding: 'json' })
    return levelup(encoded)
  }
}
