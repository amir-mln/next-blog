import React from 'react';
import { Pane, majorScale } from 'evergreen-ui';
import matter from 'gray-matter';
import path from 'path';
import fs from 'fs';
import orderby from 'lodash.orderby';
import Container from 'components/container';
import HomeNav from 'components/homeNav';
import PostPreview from 'components/postPreview';
import { posts as postsFromCMS } from 'constants/content';

import type { GetStaticPropsContext } from 'next';

const Blog = ({ posts }) => {
  return (
    <Pane>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          {posts.map((post) => (
            <Pane key={post.title} marginY={majorScale(5)}>
              <PostPreview post={post} />
            </Pane>
          ))}
        </Container>
      </main>
    </Pane>
  );
};

Blog.defaultProps = {
  posts: [],
};

/**
 * Need to get the posts from the
 * fs and our CMS
 */

export function getStaticProps(context: GetStaticPropsContext) {
  const postsKey = context.preview ? 'draft' : 'published';
  const cmsPosts = postsFromCMS[postsKey].map((posts) => matter(posts).data);

  const postsPath = path.join(process.cwd(), 'src', 'posts');
  const filenames = fs.readdirSync(postsPath);
  const filePosts = filenames.map((name) => {
    const filePath = path.join(postsPath, name);
    const file = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(file);

    return data;
  });

  const posts = cmsPosts.concat(filePosts);
  return { props: { posts } };
}

export default Blog;
