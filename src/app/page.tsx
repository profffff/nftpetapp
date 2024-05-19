'use client';
import dynamic from 'next/dynamic';

//Phaser shouldn’t be running on the server side
const AppWithoutSSR = dynamic(() => import('./App'), { ssr: false }); 

export default function Home() {
  return (
    <main>
        <AppWithoutSSR />
    </main>
  );
}
