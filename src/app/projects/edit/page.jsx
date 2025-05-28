import { Suspense } from 'react';
import EditProjectPage from '../../components/EditProjectPage';

export default function EditPageWrapper() {
  return (
    <Suspense fallback={<div className="p-10">Loading project...</div>}>
      <EditProjectPage />
    </Suspense>
  );
}