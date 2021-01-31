import { FC } from 'react';
import Link from 'next/link';

export const Nav: FC = () => {
  return (
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/vendor-list">
          <a>Vendor List</a>
        </Link>
      </li>
      <li>
        <Link href="/state">
          <a>State</a>
        </Link>
      </li>
    </ul>
  );
};
