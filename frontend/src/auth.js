import app from "./firebase";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Force account selection on every sign-in (prevents auto-picking on mobile)
provider.setCustomParameters({ prompt: "select_account" });

/**
 * Sign in with Google — always tries popup first.
 * If popup fails (blocked on mobile), automatically falls back to redirect.
 * Returns Firebase user on popup success, null if redirect was triggered.
 */
export const signInWithGoogle = async () => {
  try {
    // Always try popup first — works on desktop and many mobile browsers
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    // These errors mean the popup was blocked or closed — try redirect
    if (
      error.code === "auth/popup-blocked" ||
      error.code === "auth/popup-closed-by-user" ||
      error.code === "auth/cancelled-popup-request" ||
      error.code === "auth/internal-error"
    ) {
      console.warn("Popup failed, falling back to redirect:", error.code);
      await signInWithRedirect(auth, provider);
      return null; // Page will reload — result picked up by getGoogleRedirectResult
    }
    // For any other error, throw it so the caller can show an error message
    throw error;
  }
};

/**
 * Check for pending redirect result on page load.
 * Returns Firebase user if redirect just completed, null otherwise.
 */
export const getGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error) {
    console.error("Redirect result error:", error);
    return null;
  }
};