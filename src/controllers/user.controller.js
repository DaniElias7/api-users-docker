import UserService from '../services/user.services.js';

class UserController {
  async createUser(req, res) {
    try {
      const loggedInUser = req.user;

      if (!loggedInUser || loggedInUser.type !== 'admin') {
        return res.status(403).json({ message: 'Only admins can create users.' });
      }

      const newUser = await UserService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const loggedInUser = req.user;

      if (!loggedInUser || loggedInUser.type !== 'admin') {
        return res.status(403).json({ message: 'Only admins can list all users.' });
      }

      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const loggedInUser = req.user;
      const userId = req.params.id;

      if (!loggedInUser) {
        return res.status(401).json({ message: 'Authentication required.' });
      }

      if (loggedInUser.type === 'regular' && loggedInUser.id !== userId) {
        return res.status(403).json({ message: 'Regular users can only view their own profile.' });
      }

      const user = await UserService.getUserById(userId);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const loggedInUser = req.user;
      const userIdToUpdate = req.params.id;
      const updateData = req.body;

      if (!loggedInUser) {
        return res.status(401).json({ message: 'Authentication required.' });
      }

      if (loggedInUser.type === 'regular') {
        if (loggedInUser.id !== userIdToUpdate) {
          return res.status(403).json({ message: 'Regular users can only update their own profile.' });
        }

        // Prevent regular users from updating type or email
        if (updateData.type !== undefined || updateData.email !== undefined) {
          return res.status(403).json({ message: 'Regular users cannot update their type or email.' });
        }
      } else if (loggedInUser.type !== 'admin') {
        // This case should ideally not be reached if authentication is proper
        return res.status(403).json({ message: 'Unauthorized action.' });
      }

      const updatedUser = await UserService.updateUser(userIdToUpdate, updateData);
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const loggedInUser = req.user;
      const userIdToDelete = req.params.id;

      if (!loggedInUser || loggedInUser.type !== 'admin') {
        return res.status(403).json({ message: 'Only admins can delete users.' });
      }

      const deletedUser = await UserService.deleteUser(userIdToDelete);
      if (deletedUser) {
        res.status(204).send(); // No Content
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default UserController;