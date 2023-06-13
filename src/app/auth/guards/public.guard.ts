import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate, CanMatch {

  constructor(
    private router:Router,
    private authService:AuthService
  ){}

  private checkAuthenticationStatus(): boolean | Observable<boolean>{
    return this.authService.checkAuthenticationStatus()
      .pipe(
        tap(isAuthenticated => { if( isAuthenticated ) { this.router.navigate(['./'])}}),
        map( isAuthenticated => !isAuthenticated)
      )
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.checkAuthenticationStatus();
  }
  canMatch(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | boolean {
    return this.checkAuthenticationStatus();
  }
}
