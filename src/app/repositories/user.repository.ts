import { Pool } from 'mysql2/promise';
import { queryWithLogging, transactionWithLogging } from '@/configs/db';
import { ProfileSchema, RegisterSchema } from '@/models/auth.model';

class UserRepository {
  constructor(private _db: Pool) {
    this.create = this.create.bind(this);
    this.getByUsername = this.getByUsername.bind(this);
    this.getByUsernameDetails = this.getByUsernameDetails.bind(this);
    this.getByUsernameAvatar = this.getByUsernameAvatar.bind(this);
    this.getByUsernameAvatarDetails =
      this.getByUsernameAvatarDetails.bind(this);
    this.editWithImage = this.editWithImage.bind(this);
    this.edit = this.edit.bind(this);
    this.editPassword = this.editPassword.bind(this);
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

  async editPassword(salt: string, hash: string, username: string) {
    const queryEditPassword =
      'UPDATE users SET hash = ?, salt = ? WHERE username = ?';

    const { rows } = await queryWithLogging(this._db, queryEditPassword, [
      salt,
      hash,
      username,
    ]);

    return rows;
  }

  async editWithImage(username: string, payload: ProfileSchema) {
    const file = payload.file;

    const result = await transactionWithLogging(
      this._db,
      async (connection) => {
        const queryInsertImage =
          'INSERT INTO images (original_name,name,path,type,size,used_by) VALUES (?,?,?,?,?,?)';

        await queryWithLogging(connection, queryInsertImage, [
          file!.originalName,
          file!.name,
          file!.path,
          file!.type,
          file!.size,
          username,
        ]);

        const queryUpdateProfile =
          'UPDATE profiles SET name = ?, email = ?, address = ?, age = ?,birthdate = ?, avatar = ?, updated_at = NOW() WHERE username = ?';

        const { rows: rowsProfile } = await queryWithLogging(
          connection,
          queryUpdateProfile,
          [
            payload.name,
            payload.email,
            payload.address,
            payload.age,
            payload.birthdate,
            file!.name,
            username,
          ]
        );

        return rowsProfile;
      }
    );

    return result;
  }

  async edit(username: string, payload: ProfileSchema) {
    const queryUpdateProfile =
      'UPDATE profiles SET name = ?, email = ?, address = ?, age = ?, birthdate = ? WHERE username = ?';

    const { rows } = await queryWithLogging(this._db, queryUpdateProfile, [
      payload.name,
      payload.email,
      payload.address,
      payload.age,
      payload.birthdate,
      username,
    ]);

    return rows;
  }

  async get(id: number) {
    const query = 'SELECT * FROM users WHERE id = ? LIMIT 1';

    const { rows } = await queryWithLogging(this._db, query, [id]);

    return rows;
  }

  async getByUsername(username: string) {
    const query = 'SELECT id,salt,hash FROM users WHERE username = ? LIMIT 1';
    const { rows } = await queryWithLogging(this._db, query, [username]);

    const [data] = rows as Array<{ id: number; salt: string; hash: string }>;

    return data;
  }

  async getByUsernameAvatar(username: string) {
    const query = 'SELECT avatar FROM users WHERE username = ? LIMIT 1';
    const { rows } = await queryWithLogging(this._db, query, [username]);

    const [data] = rows as Array<{ avatar: number }>;

    return data;
  }

  async getByUsernameAvatarDetails(username: string) {
    const query =
      'SELECT i.original_name, i.path, i.type, i.size FROM images i INNER JOIN users u ON i.id = u.avatar WHERE avatar = ? LIMIT 1';
    const { rows } = await queryWithLogging(this._db, query, [username]);

    const [data] = rows as Array<{ avatar: number }>;

    return data;
  }

  async getByUsernameDetails(username: string) {
    const query =
      'SELECT p.name, p.username, p.email, p.address, p.age, p.birthdate, p.avatar FROM users u INNER JOIN profiles p using(username) INNER JOIN images i ON i.name = p.avatar WHERE username = ? LIMIT 1';
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
