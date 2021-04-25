import { useRouter } from 'next/router';

export default function Episode() {
  const router = useRouter();

  return (
    <div>{router.query.slug}</div>
  );
}
