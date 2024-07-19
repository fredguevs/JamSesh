import { insertUser, getAllUsers, getUserByUsername, getUserByEmail, updateUser, deleteUser, searchUsernames } from '../../models/user/userModel.js';

const addUser = async (req, res) => {
  const { username, fullname, email, profilePictureUrl, password } = req.body;
  try {
    const newUser = await insertUser(username, fullname, email, profilePictureUrl, password);
    res.status(201).json({ message: 'Successfully added user', user: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const fetchUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const fetchUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await getUserByUsername(username);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const modifyUser = async (req, res) => {
  const { username } = req.params;
  const { fullname, email, profilePictureUrl, password } = req.body;
  if (req.user.username !== username) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const updatedUser = await updateUser(username, fullname, email, profilePictureUrl, password);
    res.status(200).json({ message: 'Successfully updated user', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const removeUser = async (req, res) => {
  const { username } = req.params;
  if (req.user.username !== username) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const deletedUser = await deleteUser(username);
    res.status(200).json({ message: 'Successfully deleted user', user: deletedUser });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const searchUsers = async (req, res) => {
  const { query } = req.query;

  try {
    const results = await searchUsernames(query);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).send('Error searching usernames');
  }
};

const createAccount = async (req, res) => {
  const { email, username, fullname, password } = req.body;

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: 'Email already associated with an account' });
    }

    const newUser = await insertUser(username, fullname, email, null, password);
    res.status(201).json({ message: 'Account created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { addUser, fetchUsers, fetchUserByUsername, modifyUser, removeUser, searchUsers, createAccount };
