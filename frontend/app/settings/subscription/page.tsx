'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SubscriptionRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/settings#subscription');
  }, [router]);
  return null;
}
