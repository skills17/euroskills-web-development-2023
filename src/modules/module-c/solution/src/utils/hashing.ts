import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hash = async (value: string) => bcrypt.hash(value, saltRounds);

export const verifyHash = async (value: string, hash: string) => bcrypt.compare(value, hash);
