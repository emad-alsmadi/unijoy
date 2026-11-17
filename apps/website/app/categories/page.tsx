import { fetchCategories } from '@/lib/api/hostCategories';
import CategoriesClient from './CategoriesClient';
import { headers } from 'next/headers';

export default async function HostCategoriesPage() {
  const categoriesPerPage = 6;
  const currentPage = 1;

  const headersList = await headers();
  const cookieHeader = headersList.get('cookie') || '';
  const token = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('token='))
    ?.split('=')[1];

  const res = await fetchCategories(
    () => {},
    undefined,
    currentPage,
    categoriesPerPage,
    true,
    token,
  );

  return <CategoriesClient initialCategories={res?.categories || []} />;
}
