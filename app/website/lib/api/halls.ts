import { get } from './base';

export const fetchHalls = async (
  setLoading: (loading: boolean) => void,
  toast?: any,
  currentPage = 1,
  hallsPerPage = 3,
  paginate?: boolean
) => {
  const urlWithPagentaion = `/halls?page=${currentPage}&perPage=${hallsPerPage}`;
  const url = `/halls`;
  try {
    setLoading(true);
    const data = await get<any>(paginate ? urlWithPagentaion : url);
    return {
      halls: data.halls || [],
      totalItems: data.totalItems || 0,
      totalPages:
        data.totalPages || Math.ceil((data.totalItems || 0) / hallsPerPage),
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
    return { halls: [], totalItems: 0, totalPages: 0 };
  } finally {
    setLoading(false);
  }
};
