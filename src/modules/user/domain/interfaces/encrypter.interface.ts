/**
 * @file encrypter.interface.ts
 * @description Interface for encryption and validation services.
 */
export interface Encrypter {
  hash(plainPassword: string): Promise<string>;
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
