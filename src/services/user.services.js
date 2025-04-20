import UserModel from '../models/user.model.js';

class UserService {
  async createUser(userData) {
    const existingUser = await UserModel.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('O e-mail já está cadastrado.');
    }
    return UserModel.createUser(userData);
  }

  async getAllUsers() {
    return UserModel.getAllUsers();
  }

  async getUserById(id) {
    return UserModel.getUserById(id);
  }

  async updateUser(id, userData) {
    return UserModel.updateUser(id, userData);
  }

  async deleteUser(id) {
    return UserModel.deleteUser(id);
  }
}

export default new UserService();