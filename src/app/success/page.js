import { Suspense } from 'react';
import SuccessClient from './SuccessClient';

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-white">⏳ Loading success page...</div>}>
      <SuccessClient />
    </Suspense>
  );
}
