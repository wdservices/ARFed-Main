import React from "react";
import { signInWithGoogle, logout, auth } from "../lib/firebaseAuth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function LoginButton() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <div>Loading...</div>;
  if (user) {
    return (
      <div>
        <img src={user.photoURL} alt="avatar" width={32} height={32} style={{ borderRadius: "50%" }} />
        <span>{user.displayName}</span>
        <button onClick={logout}>Sign out</button>
      </div>
    );
  }
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}