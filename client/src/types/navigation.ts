export type PageRoute = 'login' | 'register' | 'dashboard' | 'forgot-password' | 'reset-password';

export interface NavigationProps {
  navigate: (page: PageRoute) => void;
}
