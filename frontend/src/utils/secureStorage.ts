import CryptoJS from 'crypto-js';

class SecureStorage {
  private namespace: string;
  private secretKey: string;

  constructor(namespace: string, secretKey?: string) {
    this.namespace = namespace;
    // Use a more consistent key generation method
    this.secretKey = secretKey || this.generateConsistentKey();
  }

  private generateConsistentKey(): string {
    // Generate a consistent key based on namespace
    // This ensures the same key is generated for the same namespace
    const baseKey = `secure_storage_key_${this.namespace}`;
    return CryptoJS.SHA256(baseKey).toString().substring(0, 32);
  }

  private getFullKey(key: string): string {
    return `${this.namespace}_${key}`;
  }

  private encrypt(value: string): string {
    try {
      // Ensure value is a string
      const stringValue = String(value);
      return CryptoJS.AES.encrypt(stringValue, this.secretKey).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return value;
    }
  }

  private decrypt(encryptedValue: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, this.secretKey);
      const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
      
      // Validate decrypted value
      if (!decryptedValue) {
        console.warn('Decryption resulted in empty string', {
          namespace: this.namespace,
          secretKeyLength: this.secretKey.length
        });
        return '';
      }
      
      return decryptedValue;
    } catch (error) {
      console.error('Decryption error:', {
        namespace: this.namespace,
        error,
        secretKeyLength: this.secretKey.length
      });
      return '';
    }
  }

  setItem(key: string, value: string): void {
    try {
      const fullKey = this.getFullKey(key);
      const encryptedValue = this.encrypt(value);
      localStorage.setItem(fullKey, encryptedValue);
    } catch (error) {
      console.error('Error setting secure storage item:', {
        key,
        error
      });
    }
  }

  getItem(key: string): string | null {
    try {
      const fullKey = this.getFullKey(key);
      const encryptedValue = localStorage.getItem(fullKey);
      
      if (!encryptedValue) return null;

      const decryptedValue = this.decrypt(encryptedValue);
      
      // If decryption fails, remove the item
      if (decryptedValue === '') {
        localStorage.removeItem(fullKey);
        return null;
      }
      
      return decryptedValue;
    } catch (error) {
      console.error('Comprehensive secure storage retrieval error:', {
        namespace: this.namespace,
        key,
        error
      });
      return null;
    }
  }

  removeItem(key: string): void {
    const fullKey = this.getFullKey(key);
    localStorage.removeItem(fullKey);
  }

  clearNamespace(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(`${this.namespace}_`))
      .forEach(key => localStorage.removeItem(key));
  }
}

export default SecureStorage;
