import app from "./firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user; 
    //console.log(result.user.photoURL);
  } catch (error) {
    if (error.code !== "auth/cancelled-popup-request") {
      console.error(error);
      return null;
    }
  }
};