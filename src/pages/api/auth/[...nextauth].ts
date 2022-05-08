import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { clientPromise } from 'db/index';
import NextAuth from 'next-auth/next';
import Github from 'next-auth/providers/github';

export default NextAuth({
  session: { strategy: 'database' },
  providers: [
    Github({
      httpOptions: { timeout: 10000 },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  adapter: MongoDBAdapter(clientPromise),
});
