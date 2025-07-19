import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import admin from "firebase-admin";
import { cert } from "firebase-admin/app";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: cert(require("arfed-authentication-firebase-adminsdk-fbsvc-54ee34285f.json")),
  });
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: FirestoreAdapter(admin.firestore()),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token, user }) {
      // Add custom fields to session if needed
      return session;
    },
    async signIn({ user, account, profile }) {
      // You can add custom logic here if needed
      return true;
    },
  },
});