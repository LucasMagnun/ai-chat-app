import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { join } from 'path';
import { readFileSync } from 'fs';

// Caminho do arquivo JSON de credenciais do Firebase
const serviceAccountPath = join(__dirname, '../../firebase-credentials.json');

// Lendo credenciais do arquivo JSON
const serviceAccount: ServiceAccount = JSON.parse(
  readFileSync(serviceAccountPath, 'utf-8'),
);

export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
