async function SearchPage({
  searchParams,
}: {
  searchParams: {
    query: string;
  };
}) {
  const { query } = searchParams;
  return <div>SearchPage For {query}</div>;
}

export default SearchPage;
