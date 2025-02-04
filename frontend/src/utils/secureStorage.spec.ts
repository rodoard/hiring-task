import SecureStorage from './secureStorage';

describe('SecureStorage', () => {
  let storage: SecureStorage;

  beforeEach(() => {
    // Create a new SecureStorage instance before each test
    storage = new SecureStorage('test-namespace');
    
    // Clear localStorage to ensure a clean state
    localStorage.clear();
  });

  it('should store and retrieve a simple string', () => {
    storage.setItem('username', 'testuser');
    const retrievedUsername = storage.getItem('username');
    expect(retrievedUsername).toBe('testuser');
  });

  it('should overwrite existing key', () => {
    storage.setItem('username', 'firstuser');
    storage.setItem('username', 'newuser');
    const updatedUsername = storage.getItem('username');
    expect(updatedUsername).toBe('newuser');
  });

  it('should store and retrieve a complex object', () => {
    const testObject = {
      id: 1,
      name: 'Test User',
      roles: ['admin', 'user']
    };

    storage.setItem('user', JSON.stringify(testObject));
    const retrievedObject = JSON.parse(storage.getItem('user') || '{}');
    
    expect(retrievedObject).toEqual(testObject);
  });

  it('should remove an item', () => {
    storage.setItem('key', 'value');
    storage.removeItem('key');
    const removedValue = storage.getItem('key');
    
    expect(removedValue).toBeNull();
  });

  it('should support multiple namespaces', () => {
    const otherStorage = new SecureStorage('other-namespace');
    
    storage.setItem('key', 'storage-value');
    otherStorage.setItem('key', 'other-value');
    
    expect(storage.getItem('key')).toBe('storage-value');
    expect(otherStorage.getItem('key')).toBe('other-value');
  });

  it('should handle special characters', () => {
    const specialString = 'Test@Special#Characters$%^&*()';
    storage.setItem('special', specialString);
    
    const retrievedSpecial = storage.getItem('special');
    expect(retrievedSpecial).toBe(specialString);
  });

  it('should return null for non-existent key', () => {
    const nonExistentValue = storage.getItem('non-existent-key');
    expect(nonExistentValue).toBeNull();
  });
});
