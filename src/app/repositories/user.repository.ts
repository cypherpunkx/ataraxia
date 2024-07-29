import { Pool } from 'mysql2/promise';
import { queryWithLogging } from '@/configs/db';
import { RegisterSchema } from '@/models/auth.model';

class UserRepository {
  constructor(private _db: Pool) {
    this.create = this.create.bind(this);
    this.getByUsername = this.getByUsername.bind(this);
    this.find = this.find.bind(this);
  }

  async create(payload: RegisterSchema) {
    const query =
      'INSERT INTO users (name, username, hash, salt, email, address, age, birthdate, status) VALUES (?,?,?,?,?,?,?,?,?)';
    const { rows } = await queryWithLogging(this._db, query, [
      payload.name,
      payload.username,
      payload.password.hash,
      payload.password.salt,
      payload.email,
      payload.address,
      payload.age,
      payload.birthdate,
      payload.status,
    ]);

    return rows;
  }

  async getByUsername(username: string) {
    const query = 'SELECT id,salt,hash FROM users WHERE username = ? LIMIT 1';
    const { rows } = await queryWithLogging(this._db, query, [username]);

    const [data] = rows as Array<{ id: number; salt: string; hash: string }>;

    return data;
  }

  async find() {
    const query = 'SELECT * FROM users';
    const { rows } = await queryWithLogging(this._db, query);
    return rows;
  }
}

export default UserRepository;
