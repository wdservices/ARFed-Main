import { useRouter } from "next/router";
import { useEffect } from "react";
import app from "../lib/firebaseClient";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const db = getFirestore(app);

export default function PaymentSuccess() {
  const router = useRouter();
  const { userId, plan } = router.query; // Make sure Flutterwave redirects with these params

  useEffect(() => {
    if (userId && plan) {
      const updatePlan = async () => {
        await updateDoc(doc(db, "users", userId), { plan });
      };
      updatePlan();
    }
  }, [userId, plan]);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Your account has been upgraded to {plan}.</p>
    </div>
  );
}