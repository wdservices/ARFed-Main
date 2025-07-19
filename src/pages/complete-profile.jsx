import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import app from "../lib/firebaseClient";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const auth = getAuth(app);
const db = getFirestore(app);

const CompleteProfile = () => {
  const router = useRouter();
  const [accountType, setAccountType] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Optionally prefill fields from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setAccountType(data.accountType || "");
          setOrganizationName(data.organizationName || "");
        }
      } else {
        setUser(null);
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!accountType) {
        toast.warn("Please select an account type.");
        setLoading(false);
        return;
      }
      if (accountType === "group" && !organizationName) {
        toast.warn("Please enter your organization name.");
        setLoading(false);
        return;
      }
      await updateDoc(doc(db, "users", user.uid), {
        accountType,
        organizationName: accountType === "group" ? organizationName : "",
      });
      toast.success("Profile completed!");
      router.replace("/subjects");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6" }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", minWidth: 320, maxWidth: 400, width: "100%" }}>
        <h2 style={{ textAlign: "center", marginBottom: 24, fontWeight: 700, fontSize: 24 }}>Complete Your Profile</h2>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 500 }}>Account Type</label>
          <select
            value={accountType}
            onChange={e => setAccountType(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd", marginTop: 6 }}
            required
          >
            <option value="">Select...</option>
            <option value="individual">Individual</option>
            <option value="group">Group/Organization</option>
          </select>
        </div>
        {accountType === "group" && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 500 }}>Organization Name</label>
            <input
              type="text"
              value={organizationName}
              onChange={e => setOrganizationName(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd", marginTop: 6 }}
              placeholder="Enter organization name"
              required
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", background: "#6366f1", color: "#fff", padding: 12, border: "none", borderRadius: 4, fontWeight: 600, fontSize: 16, marginTop: 8 }}
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile; 