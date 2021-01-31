import { FC } from 'react';
import styles from '@/styles/Home.module.css';
import { Nav } from '@/components/nav';

export const HomePage: FC = () => {
  return (
    <div>
      <Nav />
      <p>Hello World</p>
    </div>
  );
};
