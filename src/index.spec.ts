import { Env } from "./env";
import app from "./app";
import { dbCreate, AppDataSource } from "./db";
import { main } from "./index";
import * as path from "path";

// Mock dependencies
jest.mock("./app", () => ({
  listen: jest.fn()
}));
jest.mock("./db", () => ({
  dbCreate: jest.fn(),
  AppDataSource: {
    initialize: jest.fn()
  }
}));

describe('Server Initialization', () => {
  let originalExit: typeof process.exit;
  let mockExit: any;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let originalEnv: string | undefined;

  beforeEach(() => {
    // Capture and mock process.exit
    originalExit = process.exit;
    mockExit = jest.fn();
    process.exit = mockExit;

    // Mock console.error and console.log
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Store original NODE_ENV
    originalEnv = process.env.NODE_ENV;

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore process.exit, console.error, and console.log
    process.exit = originalExit;
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });

  it('should initialize database and start server successfully', async () => {
    // Simulate successful initialization
    (dbCreate as jest.Mock).mockResolvedValue(undefined);
    (AppDataSource.initialize as jest.Mock).mockResolvedValue(undefined);

    await main();

    // Verify database creation and initialization
    expect(dbCreate).toHaveBeenCalledTimes(1);
    expect(AppDataSource.initialize).toHaveBeenCalledTimes(1);

    // Verify server listening
    expect(app.listen).toHaveBeenCalledWith(Env.port, expect.any(Function));
    
    // Verify no console error
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should exit process if database initialization fails', async () => {
    try {
      // Simulate database initialization failure
      (dbCreate as jest.Mock).mockResolvedValue(undefined);
      (AppDataSource.initialize as jest.Mock).mockRejectedValueOnce(new Error('DB Init Error'));

      await main();
    } catch {
      // Verify process exit
      expect(mockExit).toHaveBeenCalledWith(1);

      // Verify console error was called
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to initialize database:', 
        expect.any(Error)
      );
    }
  });

});
