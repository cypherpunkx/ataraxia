import { Pool } from 'mysql2/promise';
import { queryWithLogging, transactionWithLogging } from '@/configs/db';
import { ProfileSchema, RegisterSchema } from '@/models/auth.model';

class UserRepository {
  constructor(private _db: Pool) {
    this.create = this.create.bind(this);
    this.getByUsername = this.getByUsername.bind(this);
    this.getByUsernameDetails = this.getByUsernameDetails.bind(this);
    this.find = this.find.bind(this);
  }

  async create(payload: RegisterSchema) {
    const context = 'Register user and profile';

    const result = await transactionWithLogging(
      this._db,
      async (connection) => {
        const queryInsertUser =
          'INSERT INTO users (username, hash, salt, status) VALUES (?,?,?,?)';
        await queryWithLogging(
          connection,
          queryInsertUser,
          [
            payload.username,
            payload.password.hash,
            payload.password.salt,
            payload.status,
          ],
          `${context} - Insert User`
        );

        const queryInsertProfile = 'INSERT INTO profiles (username) VALUES (?)';

        const { rows } = await queryWithLogging(
          connection,
          queryInsertProfile,
          [payload.username],
          `${context} - Insert User`
        );
        return rows;
      }
    );

    return result;
  }

  async edit(username: string, payload: ProfileSchema) {
    const query =
      'UPDATE profiles SET name = ?,email = ?,address = ?,age = ?,birthdate = ?,avatar = ? WHERE username = ?';

    const { rows } = await queryWithLogging(this._db, query, [
      payload.name,
      payload.email,
      payload.address,
      payload.age,
      payload.birthdate,
      payload.avatar,
      username,
    ]);
    return rows;
  }

  async getByUsername(username: string) {
    const query = 'SELECT id,salt,hash FROM users WHERE username = ? LIMIT 1';
    const { rows } = await queryWithLogging(this._db, query, [username]);

    const [data] = rows as Array<{ id: number; salt: string; hash: string }>;

    return data;
  }

  async getByUsernameDetails(username: string) {
    const query =
      'SELECT p.name, p.username, p.email, p.address, p.age, p.birthdate, p.avatar FROM users u INNER JOIN profiles p using(username) WHERE username = ? LIMIT 1';
    const { rows } = await queryWithLogging(this._db, query, [username]);

    const [data] = rows as Array<{
      name: string;
      username: string;
      email: string;
      address: string;
      age: number;
      birthdate: string;
      avatar: string;
    }>;

    return data;
  }

  async find() {
    const query = 'SELECT * FROM users';
    const { rows } = await queryWithLogging(this._db, query);
    return rows;
  }
}

export default UserRepository;
