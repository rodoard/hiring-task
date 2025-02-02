import httpStatus from 'http-status';
import { CustomError } from './custom.error';

export class UserAlreadyExistsError extends CustomError {
  constructor() {
    super('User with this email already exists');
  }
}
