import { Db, MongoClient } from 'mongodb';
import { JWT } from 'next-auth/jwt';
import { NextApiRequest } from 'next';

export interface PostFrontMatter {
  title: string;
  summary: string;
  publishedOn: string;
}

export interface Post {
  compiledSource: string;
  frontmatter: PostFrontMatter;
}

export interface UserSession {
  id: string;
  image: string;
  email: string;
  name: string;
}
export interface CustomJWT extends JWT {
  id: string;
}

export interface Folder {
  _id?: string;
  createdBy: string;
  name: string;
}

export interface Doc {
  _id?: string;
  createdBy: string;
  folderId: string;
  name: string;
  content?: any;
}
