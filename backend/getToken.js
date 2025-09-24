import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxyYBnP8SzpWHVwHdfZBdiFcmCxaG1axY",
  authDomain: "AI Chat app.firebaseapp.com",
  projectId: "ai-chat-app-c5978",
};

initializeApp(firebaseConfig);

const auth = getAuth();

async function getToken() {
  const email = "teste@teste.com"; // usuário cadastrado no Firebase
  const password = "123456";       // senha

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    console.log("Token JWT do Firebase:", token);
  } catch (error) {
    console.error(error);
  }
}

getToken();
