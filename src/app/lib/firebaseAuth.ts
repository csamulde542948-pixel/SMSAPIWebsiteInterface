import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signInWithRedirect,
  signOut,
  setPersistence,
  updateProfile,
  type User,
} from "firebase/auth";

const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined;
const FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined;
const FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined;
const FIREBASE_STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined;
const FIREBASE_MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined;
const FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID as string | undefined;
const FIREBASE_MEASUREMENT_ID = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined;
const AUTH_STORAGE_KEY = "opensms:firebaseAuth";

export type FirebaseSession = {
  idToken: string;
  refreshToken: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  expiresAt: number;
};

type FirebaseAuthResponse = {
  id_token: string;
  refresh_token?: string;
  expires_in?: string;
};

function requireFirebaseConfig() {
  if (!FIREBASE_API_KEY || !FIREBASE_AUTH_DOMAIN || !FIREBASE_PROJECT_ID || !FIREBASE_APP_ID) {
    throw new Error("Firebase is not configured. Set the VITE_FIREBASE_* values in frontend/.env.");
  }
  return {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID,
  };
}

const firebaseApp = initializeApp(requireFirebaseConfig());
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

async function saveUserSession(user: User): Promise<FirebaseSession> {
  const idToken = await user.getIdToken();
  const session: FirebaseSession = {
    idToken,
    refreshToken: user.refreshToken,
    email: user.email || "",
    displayName: user.displayName || undefined,
    photoURL: user.photoURL || undefined,
    expiresAt: Date.now() + 3540 * 1000,
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export async function signUpWithEmail(name: string, email: string, password: string): Promise<FirebaseSession> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name.trim()) {
    await updateProfile(credential.user, { displayName: name.trim() });
  }
  return saveUserSession(credential.user);
}

export async function signInWithEmail(email: string, password: string): Promise<FirebaseSession> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return saveUserSession(credential.user);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function signInWithGoogle(): Promise<FirebaseSession> {
  const credential = await signInWithPopup(auth, googleProvider);
  return saveUserSession(credential.user);
}

export async function signInWithGoogleRedirect(): Promise<void> {
  await setPersistence(auth, browserLocalPersistence);
  await signInWithRedirect(auth, googleProvider);
}

export async function completeGoogleRedirectSignIn(): Promise<FirebaseSession | null> {
  const credential = await getRedirectResult(auth);
  if (!credential?.user) return null;
  return saveUserSession(credential.user);
}

export function getFirebaseSession(): FirebaseSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) as FirebaseSession : null;
  } catch {
    return null;
  }
}

export function getFirebaseIdToken(): string {
  const session = getFirebaseSession();
  if (!session || session.expiresAt <= Date.now()) return "";
  return session.idToken;
}

export async function getValidFirebaseIdToken(): Promise<string> {
  const session = getFirebaseSession();
  if (!session) return "";
  if (session.expiresAt > Date.now()) return session.idToken;

  const config = requireFirebaseConfig();
  const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${config.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: session.refreshToken,
    }),
  });
  const data = await response.json() as FirebaseAuthResponse;
  if (!response.ok) {
    signOutFirebase();
    return "";
  }

  const refreshed: FirebaseSession = {
    idToken: data.id_token,
    refreshToken: data.refresh_token || session.refreshToken,
    email: session.email,
    displayName: session.displayName,
    photoURL: session.photoURL,
    expiresAt: Date.now() + Math.max(0, Number(data.expires_in || 3600) - 60) * 1000,
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(refreshed));
  return refreshed.idToken;
}

export function signOutFirebase(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  signOut(auth).catch(() => {});
}

function formatFirebaseError(codeOrMessage: string): string {
  switch (codeOrMessage) {
    case "auth/email-already-in-use":
    case "Firebase: Error (auth/email-already-in-use).":
    case "EMAIL_EXISTS": return "An account already exists for this email.";
    case "auth/user-not-found":
    case "Firebase: Error (auth/user-not-found).":
    case "EMAIL_NOT_FOUND":
    case "auth/wrong-password":
    case "Firebase: Error (auth/wrong-password).":
    case "INVALID_PASSWORD":
    case "auth/invalid-credential":
    case "Firebase: Error (auth/invalid-credential).":
    case "INVALID_LOGIN_CREDENTIALS": return "Invalid email or password.";
    case "auth/weak-password":
    case "Firebase: Password should be at least 6 characters (auth/weak-password).":
    case "WEAK_PASSWORD : Password should be at least 6 characters": return "Password should be at least 6 characters.";
    case "auth/user-disabled":
    case "Firebase: Error (auth/user-disabled).":
    case "USER_DISABLED": return "This account has been disabled.";
    case "auth/popup-closed-by-user":
    case "Firebase: Error (auth/popup-closed-by-user).": return "Google sign-in was cancelled.";
    case "auth/unauthorized-domain":
    case "Firebase: Error (auth/unauthorized-domain).": return "This domain is not authorized in Firebase Authentication. Add localhost or your deployed domain in Firebase Auth settings.";
    case "auth/invalid-email":
    case "Firebase: Error (auth/invalid-email).":
    case "INVALID_EMAIL": return "Enter a valid email address.";
    case "auth/missing-email":
    case "Firebase: Error (auth/missing-email).": return "Enter your email address first.";
    default: return codeOrMessage ? codeOrMessage.replace(/_/g, " ").toLowerCase() : "Firebase authentication failed.";
  }
}

export function formatFirebaseAuthError(error: unknown): string {
  const maybeFirebaseError = error as { code?: string; message?: string } | undefined;
  if (maybeFirebaseError?.code) return formatFirebaseError(maybeFirebaseError.code);
  if (error instanceof Error) return formatFirebaseError(error.message);
  return "Firebase authentication failed.";
}
