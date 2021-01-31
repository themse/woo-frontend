import { useGetStatesQuery } from '@/apollo/generated/hooks/state.query.generated';
import { Nav } from '@/components/nav';

const Page = () => {
  const { data, loading } = useGetStatesQuery();

  const isLoading = loading;

  if (isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <Nav />
      <div>State</div>
      <ul>
        {data?.states.map((state) => (
          <li key={state.id}>
            {state.id} - {state.name}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Page;
