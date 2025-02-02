import { UserEntity } from "../entities";
import { AppDataSource } from "../db/db.setup";
import { UserAlreadyExistsError } from "../errors/userAlreadyExists.error";

export type UserFilter = {
  uuid?: string;
  email?: string;
  username?: string;
};

export type CreateUserData = {
  username: string;
  email: string;
  password: string;
};

export const createUser = async (data: CreateUserData) => {
  const { username, email, password } = data;
  const userRepository = AppDataSource.getRepository(UserEntity);
  
  const existingUser = await userRepository.findOne({
    where: { email: email.toLowerCase() },
  });
  
  if (existingUser) {
    throw new UserAlreadyExistsError();
  }
  
  const user = userRepository.create({ 
    username, 
    email: email.toLowerCase(), 
    password 
  });
  const savedUser = await userRepository.save(user);
  
  if (!savedUser) {
    throw new Error('Failed to create user');
  }
  
  return savedUser;
};

export const getOneUser = async (filter: UserFilter) => {
  const userRepository = AppDataSource.getRepository(UserEntity);
  return await userRepository.findOne({ where: filter });
};
