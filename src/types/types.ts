import { Db, MongoClient } from 'mongodb';
import { NextRequest } from 'next/server';
import { JWT } from 'next-auth/jwt';

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

export interface CustomNextRequest extends NextRequest {
  db?: Db;
  mongoClient?: MongoClient;
  user?: JWT;
}

export interface Folder {
  _id: string;
  createdBy: string;
  name: string;
}

export interface Doc {
  _id: string;
  createdBy: string;
  folderId: string;
  name: string;
  content?: any;
}
