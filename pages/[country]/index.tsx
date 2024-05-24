import { staticPaths } from "../../lib/SharedStaticPaths";

async function updateArrayValues(key:string, value:any[]) {
  try {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.VC_TOKEN}`
      },
      body: JSON.stringify({
        "items":[
          { "operation": "update", "key": `${key}`, "value": [...value]}
        ]
      })
    };
    const updateEdgeConfig = await fetch(`https://api.vercel.com/v1/edge-config/${process.env.CONFIG_STORAGE_ID}/items?teamId=${process.env.TEAM_ID}`, options);
    return await updateEdgeConfig.json();

  } catch (error) {
    console.log(error);
  }
}



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

  //  Store countries in config
  await updateArrayValues('countries', staticPaths.countries);
   // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params }) {

  // Pass post data to the page via props
  return { props: { country: params.country } }
}