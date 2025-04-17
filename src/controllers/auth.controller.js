import jwt from 'jsonwebtoken';
import { jwtSecret, jwtExpiration } from '../config/jwt.js';

const adminUser = {
  name: "admin",
  email: "admin@spsgroup.com.br",
  type: "admin",
  password: "1234"
};

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;

    if (email === adminUser.email && password === adminUser.password) {
      const token = jwt.sign({ email: adminUser.email, type: adminUser.type }, jwtSecret, { expiresIn: jwtExpiration });
      return res.json({ token });
    } else {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
  }
}

export default AuthController;