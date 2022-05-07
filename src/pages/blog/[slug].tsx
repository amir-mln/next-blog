import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import matter from 'gray-matter';
import { useRouter } from 'next/router';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { majorScale, Pane, Heading, Spinner } from 'evergreen-ui';

import { Post } from '../../../types';
import { posts as cmsPosts } from '../../../content';
import Container from 'components/container';
import HomeNav from 'components/homeNav';

import type { GetStaticPropsContext } from 'next';

function BlogPost({ mdxSource: { frontmatter, compiledSource } }: { mdxSource: Post }) {
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
        <title>{`Known Blog | ${frontmatter.title}`}</title>
        <meta name="description" content={frontmatter.summary} />
      </Head>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          <Heading fontSize="clamp(2rem, 8vw, 6rem)" lineHeight="clamp(2rem, 8vw, 6rem)" marginY={majorScale(3)}>
            {frontmatter.title}
          </Heading>
          <MDXRemote compiledSource={compiledSource} components={{ Pane }} />
        </Container>
      </main>
    </Pane>
  );
}

BlogPost.defaultProps = {
  compiledSource: '',
  frontmatter: { title: 'default title', summary: 'summary', publishedOn: '' },
};

export function getStaticPaths() {
  const postsPath = path.join(process.cwd(), 'src', 'posts');
  const filenames = fs.readdirSync(postsPath);

  const slugs = filenames.map((name) => {
    const postFile = fs.readFileSync(path.join(postsPath, name), 'utf-8');
    const {
      data: { slug },
    } = matter(postFile);

    return { params: { slug } };
  });

  return { paths: slugs, fallback: true };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  let postFile: string;
  const slug = params!.slug as string;

  try {
    const postsPath = path.join(process.cwd(), 'src', 'posts', slug + '.mdx');
    postFile = fs.readFileSync(postsPath, 'utf-8');
  } catch {
    for (const post of cmsPosts.published) {
      if (post.includes(`slug: ${slug}`)) {
        postFile = post;
        break;
      }
    }
  }

  const mdxSource = await serialize(postFile, { parseFrontmatter: true });

  return { props: { mdxSource } };
}

export default BlogPost;
