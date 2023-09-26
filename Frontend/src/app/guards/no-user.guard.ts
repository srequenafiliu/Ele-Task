import { CanActivateFn } from '@angular/router';

export const noUserGuard: CanActivateFn = () => {
  return true;
  /*const authService:AuthService = inject(AuthService);
  const router:Router = inject(Router);
  if (!authService.getToken()) return true;
  router.navigate(['/perfil-usuario']);
  return false;*/
};
