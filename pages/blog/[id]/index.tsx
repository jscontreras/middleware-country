// Serverless Memory globally scoped variables
let largePaths = [];

export default function BlogPage({ id, post, usedPath }) {
  return (
    <>
      <h1>Long URLs POC</h1>
      <h2>{`[${id.length}] ${post.title}`}</h2>
      <h3>{`Path used to Fetch Data: ${usedPath}`}</h3>
      <h3>{`Path used In Vercel: /blog/${id}`}</h3>
      <p>
        {`${post.body}`}
      </p>
    </>
  );
}

async function getPost(postId: number) {
  const resLorem = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  );
  return (await resLorem.json()) as { title: string; body: string };
}


// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  // const res = await fetch('https://.../posts')
  // const posts = await res.json()
  const posts = [{ id: "2" }]
  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps(context) {
  const id = context.params?.id || '1';
  let usedPath = id;
  const post = await getPost(id.length);

  // check if the url is too long
  if (usedPath.length > 30) {
    console.log(usedPath);
  }

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