import { insertUser, getAllUsers, getUserByUsername, getUserByEmail, updateUser, deleteUser, searchUsernames, updatePassword } from '../../models/user/userModel.js';

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
  console.log('Attemping to fetch', username);
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

  // Additional logging for debugging
  console.log('Request Params:', req.params);
  console.log('Request Session:', req.session);
  console.log('Request Session User:', req.session.user);

  // Check if the logged-in user is trying to modify their own profile
  if (req.session.user?.username !== username) {
    console.log('Username:', username);
    console.log('Session User:', req.session.user);
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Validate input data
  if (!fullname || !email) {
    return res.status(400).json({ error: 'Full name and email are required' });
  }

  try {
    const updatedUser = await updateUser(username, fullname, email, profilePictureUrl, password);
    res.status(200).json({ message: 'Successfully updated user', user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const removeUser = async (req, res) => {
  const { username } = req.params;
  if (req.session.user !== username) {
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
  const profilePictureUrl = req.file ? req.file.path : null;

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: 'Email already associated with an account' });
    }

    const newUser = await insertUser(username, fullname, email, profilePictureUrl, password);
    res.status(201).json({ message: 'Account created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt with username:', username);

  const user = await getUserByUsername(username); // Replace this with your actual user validation logic
  if (user && user.password === password) {
    req.session.user = {
      username: user.username,
      fullname: user.fullname,
      email: user.email,
    };

    req.session.save(err => {
      if (err) {
        console.error('Failed to save session:', err);
        return res.status(500).json({ error: 'Failed to save session' });
      }
      console.log('Session saved:', req.session.user);
      return res.status(200).json({ message: 'Login successful', user: req.session.user });
    });
  } else {
    console.log('Incorrect username or password');
    res.status(403).json({ message: 'Incorrect username or password' });
  }
};

const changeUserPassword = async (req, res) => {
  const { username } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await getUserByUsername(username) ;

    if (req.session.user?.username !== user.username) {
      console.log('User', user.username);
      console.log('Session', req.session.user);
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!user || (currentPassword !== user.password)) {
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    await updatePassword(username, newPassword);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Error updating password' });
  }
};


export { addUser, fetchUsers, fetchUserByUsername, modifyUser, removeUser, searchUsers, createAccount, loginUser, changeUserPassword};
