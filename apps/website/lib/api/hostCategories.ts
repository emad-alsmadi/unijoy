import { get } from './base';

export const fetchCategories = async (
  setLoading: (loading: boolean) => void,
  toast?: any,
  currentPage = 1,
  categoriesPerPage = 3,
  paginate?: boolean,
  token?: string,
) => {
  const urlWithPagentaion = `/host-categories?page=${currentPage}&perPage=${categoriesPerPage}`;
  const url = `/host-categories`;
  try {
    setLoading(true);
    const data = await get<any>(paginate ? urlWithPagentaion : url, { token });
    return {
      categories: data.categories || [],
      totalItems: data.totalItems || 0,
      totalPages:
        data.totalPages ||
        Math.ceil((data.totalItems || 0) / categoriesPerPage),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
    return { categories: [], totalItems: 0, totalPages: 0 };
  } finally {
    setLoading(false);
  }
};

// export const handleDelete = async () => {
//     if (!selectedCategory) return;
//     try {
//       const res = await fetch(
//         `http://localhost:8080/host-categories/${selectedCategory._id}`,
//         {
//           method: 'DELETE',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       toast({
//         title: 'Category Deleted',
//         description: `${selectedCategory.name} was deleted successfully.`,
//         className: 'bg-green-600 text-white border-0',
//       });
//       setFiltered((prev) => prev.filter((c) => c._id !== selectedCategory._id));
//     } catch (err: any) {
//       toast({
//         title: 'Error',
//         description: err.message,
//         variant: 'destructive',
//       });
//     } finally {
//       setIsDeleteDialogOpen(false);
//     }
//   };
