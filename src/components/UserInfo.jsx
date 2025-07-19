  import { useAuthState } from "react-firebase-hooks/auth";
  import { auth } from "../lib/firebaseAuth";

  export default function UserInfo() {
    const [user] = useAuthState(auth);

    if (!user) return null;
    return (
      <div>
        <img src={user.photoURL} alt="avatar" width={32} height={32} style={{ borderRadius: "50%" }} />
        <span>{user.displayName}</span>
        <span>{user.email}</span>
      </div>
    );
  }