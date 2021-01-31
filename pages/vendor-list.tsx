import { useGetVendorsQuery } from '@/apollo/generated/hooks/vendor.query.generated';
import { Nav } from '@/components/nav';

export default function Page() {
  const { data, loading } = useGetVendorsQuery();

  const isLoading = loading;

  if (isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <div>
      <Nav />
      <p>Hello About</p>
      <ul>
        {data?.vendors.items.map((vendor) => (
          <li key={vendor.id}>
            <p>{vendor.id}</p>
            <p>{vendor.profile?.name}</p>
            <p>{vendor.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
