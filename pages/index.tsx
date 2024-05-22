export default function StaticPagesExample({
  country
}: {
  country: string
}) {
  return (
    <>
      <h1>Middleware By Country</h1>
      <p>
        This page is rendered when your country is not US or MX.
      </p>
    </>


  );
}
