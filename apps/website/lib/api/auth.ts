import { post } from './base';

export type LoginPayload = {
  email: string;
  password: string;
};

export const apiLogin = async (
  values: LoginPayload,
  deps: {
    token?: string;
    login: (role: string, token: string, userId: string) => void;
    toast: typeof import('@/hooks/use-toast').toast;
    push: (path: string) => void;
  },
) => {
  const data = await post<any>('/auth/login', values, { token: deps.token });
  deps.toast({
    title: 'Login Successful',
    description: data.message || ' Thank you for Login',
    className: 'bg-green-600 text-white border-0',
  });
  deps.login(data.role, data.token, data.userId);
  setTimeout(() => {
    if (data.role === 'user') {
      deps.push('/user/events');
    } else if (data.role === 'host') {
      deps.push('/host/events');
    } else if (data.role === 'admin') {
      deps.push('/admin/events');
    } else {
      deps.push('/');
    }
  }, 500);
  return data;
};
