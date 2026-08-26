import fs from 'fs';
import { hashPassword } from './lib/db.js';
console.log(hashPassword('admin123'));
