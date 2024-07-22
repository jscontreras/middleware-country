import { get } from '@vercel/edge-config';

export default function BlogPage({ id, post, usedPath }) {
  return (
    <>
      <h1>Long URLs POC</h1>
      <h2>{`[${usedPath.length}] ${post.title}`}</h2>
      <h3>{`Path used to Fetch Data: ${usedPath}`}</h3>
      <h3>{`Path used In Vercel: /blog/${id}`}</h3>
      <p>
        {`${post.body}`}
      </p>
    </>
  );
}

/**
 * Get a Lorem Impsum Post based onPost ID (Testing API)
 * @param postId
 * @returns
 */
async function getPost(postId: number) {
  const resLorem = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  );
  return (await resLorem.json()) as { title: string; body: string };
}


/**
 * This function gets called at build time on server-side.
 * It may be called again, on a serverless function, if
 * the path has not been generated.
 * @returns
 */
export async function getStaticPaths() {
  // The initial list of paths to process on build time
  const buildPages = ['/blog/blog-1', '/blog/blog-2', '/blog/blog-3'];

  // Read collection of long paths from local storage (get the hashed urls)
  const longUrls: readonly any[] = await get('longUrls') || [];

  // Get the paths we want to pre-render based on posts
  const hashedPaths = longUrls.map((post) => ({
    params: { id: post.h },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths: [...hashedPaths, ...buildPages], fallback: 'blocking' }
}

/**
 * This function gets called at build time on server-side.
 * It may be called again, on a serverless function, if
 * revalidation is enabled and a new request comes in
 * @param context
 * @returns
 */

export async function getStaticProps(context) {
  const id = `${context.params?.id}` || '1';
  let usedPath = id;

  // check if the path is hased path
  if (id.startsWith('hash--')) {
    const longUrls: readonly any[] = await get('longUrls') || [];
    const createdMap = new Map(longUrls.map(obj => [obj.h, obj.u]));
    if (createdMap.has(id)) {
      usedPath = createdMap.get(id);
    }
  }
  // Fetching using the page slug
  const post = await getPost(usedPath.length);

  return {
    props: {
      id,
      post,
      usedPath
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: false, // In seconds
  }
}