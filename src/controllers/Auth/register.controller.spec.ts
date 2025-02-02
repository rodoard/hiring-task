import request from 'supertest';
import { AppDataSource, dbCreate } from '../../db';
import { UserEntity } from '../../entities';
import app from '../../app';
import   {userService} from '../../services';
import httpStatus from 'http-status';
import { CustomError } from '../../errors/custom.error';

describe('/api/v1', () => {
  describe('/auth/register', () => {
    beforeAll(async () => {
      await dbCreate()
      await AppDataSource.initialize();
    });

    afterAll(async () => {
      await AppDataSource.destroy();
    });

    beforeEach(async () => {
      await AppDataSource.getRepository(UserEntity).clear();
      // Reset any mocks
      jest.restoreAllMocks();
    });

    describe('POST', () => {
      it('should successfully register a new user', async () => {
        const userData = {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        };

        // Register the user
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send(userData);

        // Check registration was successful
        expect(response.status).toBe(httpStatus.CREATED);
        
        // Verify user was saved in the database
        const userRepository = AppDataSource.getRepository(UserEntity);
        const savedUser = await userRepository.findOne({ 
          where: { email: userData.email } 
        });

        expect(savedUser).toBeTruthy();
        expect(savedUser!.username).toBe(userData.username);
        expect(savedUser!.email).toBe(userData.email);
      });

      it('should encrypt password before saving to database', async () => {
        const plainTextPassword = 'password123';
        const userData = {
          username: 'testuser',
          email: 'test@example.com',
          password: plainTextPassword
        };

        // Register the user
        await request(app)
          .post('/api/v1/auth/register')
          .send(userData);

        // Retrieve the user from the database
        const userRepository = AppDataSource.getRepository(UserEntity);
        const savedUser = await userRepository.findOne({ 
          where: { email: userData.email } 
        });

        // Verify the saved password is encrypted
        expect(savedUser).toBeTruthy();
        expect(savedUser!.password).not.toBe(plainTextPassword);
        
        // Verify the saved password looks like a bcrypt hash
        expect(savedUser!.password).toMatch(/^\$2[aby]\$\d{2}\$.+/);
      });

      it('should handle registration with missing username', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123'
        };

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send(userData);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
        expect(response.body.message).toBe('Arguments are invalid.');
        expect(response.body.messages).toContain('Name is required.');
      });

      it('should handle registration with missing email', async () => {
        const userData = {
          username: 'testuser',
          password: 'password123'
        };

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send(userData);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
        expect(response.body.message).toBe('Arguments are invalid.');
        expect(response.body.messages).toContain('Email is required.');
      });

      it('should handle registration with missing password', async () => {
        const userData = {
          username: 'testuser',
          email: 'test@example.com'
        };

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send(userData);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
        expect(response.body.message).toBe('Arguments are invalid.');
        expect(response.body.messages).toContain('Password is required.');
      });

      it('should handle duplicate email registration', async () => {
        const userData = {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        };

        await request(app).post('/api/v1/auth/register').send(userData);

        const response = await request(app).post('/api/v1/auth/register').send(userData);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
        expect(response.body.message).toBe('User with this email already exists');
        // Removed messages expectation
      });
    });
  });
});
