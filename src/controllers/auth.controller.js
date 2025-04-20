import jwt from 'jsonwebtoken';
import { jwtSecret, jwtExpiration } from '../config/jwt.js';

import UserModel from '../models/user.model.js';

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;

    const user = await UserModel.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'O email não está cadastrado.' });

    } else if ( user && email === user.email && password === user.password) {
      const token = jwt.sign({ email: user.email, type: user.type }, jwtSecret, { expiresIn: jwtExpiration });

      const userData = { 
        id: user.id, 
        email: user.email, 
        type: user.type, 
        name: user.name 
      }
      return res.status(200).json({ user: userData, token });
    } else {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }
  }
}

export default AuthController;