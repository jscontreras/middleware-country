import { staticPaths } from "../../lib/SharedStaticPaths";

export default function StaticPagesExample({
  country
}: {
  country: string
}) {
  return (
    <h1>The country is: {country}!!</h1>
  );
}



// This function gets called at build time
export async function getStaticPaths() {
  const paths =  staticPaths.countries.map((co => {
    return { params:{country: co}}
  }))
   // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params }) {

  // Pass post data to the page via props
  return { props: { country: params.country } }
}