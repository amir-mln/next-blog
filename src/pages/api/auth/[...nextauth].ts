import NextAuth from 'next-auth/next';
import Github from 'next-auth/providers/github';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

import { UserSession } from 'types/types';
import { clientPromise, getDatabase, folder, doc } from 'db/index';

export default NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Github({
      httpOptions: { timeout: 30000 },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async jwt({ isNewUser, user, token }) {
      const db = await getDatabase();

      if (isNewUser) {
        const newFolder = await folder.createFolder(db, { createdBy: user.id, name: 'Getting started folder' });
        await doc.createDoc(db, {
          createdBy: user.id,
          folderId: newFolder.insertedId,
          name: 'Start Here',
          content: {
            version: '2.12.14',
            time: '15560918174501',
            blocks: [{ type: 'header', data: { text: 'lorem ipsum mini', level: 2 } }],
          },
        });
      }

      if (token && user) {
        return { ...token, id: user.id };
      }

      return token;
    },
    async session({ session, token }) {
      (session.user as UserSession).id = token.id as string;

      return session;
    },
  },
});
