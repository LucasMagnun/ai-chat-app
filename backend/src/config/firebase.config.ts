import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { join } from 'path';
import { readFileSync } from 'fs';

const serviceAccountPath = join(__dirname, '../../firebase-credentials.json');

const serviceAccount: ServiceAccount = JSON.parse(
  readFileSync(serviceAccountPath, 'utf-8'),
);

export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
