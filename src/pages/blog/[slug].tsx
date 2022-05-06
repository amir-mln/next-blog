import { FC } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { serialize } from 'next-mdx-remote/serialize';
import { majorScale, Pane, Heading, Spinner } from 'evergreen-ui';

import { Post } from '../../../types';
import Container from 'components/container';
import HomeNav from 'components/homeNav';

const BlogPost: FC<Post> = ({ source, frontMatter }) => {
  const content = serialize(source);
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Pane width="100%" height="100%">
        <Spinner size={48} />
      </Pane>
    );
  }

  return (
    <Pane>
      <Head>
        <title>{`Known Blog | ${frontMatter.title}`}</title>
        <meta name="description" content={frontMatter.summary} />
      </Head>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          <Heading fontSize="clamp(2rem, 8vw, 6rem)" lineHeight="clamp(2rem, 8vw, 6rem)" marginY={majorScale(3)}>
            {frontMatter.title}
          </Heading>
          <Pane>{content}</Pane>
        </Container>
      </main>
    </Pane>
  );
};

BlogPost.defaultProps = {
  content: '',
  frontMatter: { title: 'default title', summary: 'summary', publishedOn: '' },
};

export default BlogPost;
