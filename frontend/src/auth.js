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

/**
 * Detect if the user is on a mobile browser where popups are unreliable.
 * Mobile browsers often block popups or fail silently, so we use redirect flow instead.
 */
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Sign in with Google — uses popup on desktop, redirect on mobile.
 * Returns the Firebase user object on success, null on failure/cancel.
 */
export const signInWithGoogle = async () => {
  try {
    if (isMobile()) {
      // On mobile: use redirect flow (more reliable, no popup blocking)
      await signInWithRedirect(auth, provider);
      // After redirect, the page reloads — result is picked up by getGoogleRedirectResult()
      return null;
    } else {
      // On desktop: use popup flow (faster UX)
      const result = await signInWithPopup(auth, provider);
      return result.user;
    }
  } catch (error) {
    // If popup fails (e.g. blocked), fall back to redirect
    if (
      error.code === "auth/popup-blocked" ||
      error.code === "auth/popup-closed-by-user" ||
      error.code === "auth/cancelled-popup-request"
    ) {
      console.warn("Popup blocked/closed, falling back to redirect...");
      try {
        await signInWithRedirect(auth, provider);
        return null;
      } catch (redirectError) {
        console.error("Redirect also failed:", redirectError);
        return null;
      }
    }
    console.error("Google sign-in error:", error);
    return null;
  }
};

/**
 * Check for a pending Google redirect result.
 * Call this on app load to handle the redirect callback from mobile OAuth.
 * Returns the Firebase user object if a redirect result is available, null otherwise.
 */
export const getGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("Google redirect result error:", error);
    return null;
  }
};