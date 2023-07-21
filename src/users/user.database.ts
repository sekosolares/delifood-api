import { IUser, IUnitUser, IUsers } from './user.interface';
import bcrypt from 'bcryptjs';
import { v4 as random } from 'uuid';
import fs from 'fs';

const FILENAME = './users.json';

export function initializeUsers() {

  // Check if the file exists
  if (!fs.existsSync(FILENAME)) {
    // Create the file
    fs.writeFileSync(FILENAME, '', 'utf8');
    console.log('users.json created successfully!');
  }
}

function loadUsers(): IUsers {
  try {
    const data = fs.readFileSync(FILENAME, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.log(`Error loading users. Error: ${e}`);
    return {}
  }
}

function saveUsers() {
  try {
    fs.writeFileSync(FILENAME, JSON.stringify(users), 'utf8');
    console.log(`Users saved successfully`);
  } catch (err) {
    console.log(`Error saving users. Error: ${err}`);
  }
}

let users: IUsers = loadUsers();


export const findAll = async (): Promise<IUnitUser[]> => Object.values(users);

export const findOne = async (id: string): Promise<IUnitUser> => users[id];

export const create = async (userData: IUnitUser): Promise<IUnitUser|null> => {
  let id = random();
  let checkUser = await findOne(id);

  while(checkUser) {
    id = random();
    checkUser = await findOne(id);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const user: IUnitUser = {
    id: id,
    username: userData.username,
    email: userData.email,
    password: hashedPassword
  };

  users[id] = user;
  saveUsers();

  return user;
};

export const findByEmail = async (userEmail: string): Promise<IUnitUser|null> => {
  const allUsers = await findAll();
  const getUser = allUsers.find(user => user.email === userEmail);

  if(!getUser) {
    return null;
  }

  return getUser;
};

export const comparePassword = async (userEmail: string, suppliedPassword: string): Promise<IUnitUser|null> => {
  const user = await findByEmail(userEmail);
  const decryptPassword = await bcrypt.compare(suppliedPassword, user!.password);

  if(!decryptPassword) {
    return null;
  }

  return user;
};

export const update = async (id: string, updateValues: IUser): Promise<IUnitUser|null> => {
  const userExists = await findOne(id);

  if(!userExists) {
    return null;
  }

  if(updateValues.password) {
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(updateValues.password, salt);

    updateValues.password = newPassword;
  }

  users[id] = {
    ...userExists,
    ...updateValues
  };

  saveUsers();

  return users[id];
};

export const remove = async (id: string): Promise<IUnitUser|null> => {
  const userToRemove = await findOne(id);

  if(!userToRemove) {
    return null;
  }

  delete users[id];
  saveUsers();

  return userToRemove;
};


