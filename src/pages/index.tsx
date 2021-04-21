import React from 'react';

export default function Home({ episodes }) {

  return <div>{JSON.stringify(episodes)}</div>;
}

export async function getStaticProps() {
  try {
    const response = await fetch('http://localhost:3333/episodes');
    const data = await response.json();
    return {
      props: {
        episodes: data
      },
      revalidate: 60 * 60 * 8
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
