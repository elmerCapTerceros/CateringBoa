import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  createdAt: string;
}

// Shape returned by POST /auth/sign-in
interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<AuthUser | null>(null);
  readonly user$ = this._user$.asObservable();

  constructor(private http: HttpClient) {}

  signIn(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/sign-in`, { email, password })
      .pipe(
        tap(async (res) => {
          await Preferences.set({ key: 'accessToken',  value: res.accessToken });
          await Preferences.set({ key: 'refreshToken', value: res.refreshToken });
          await Preferences.set({ key: 'user',         value: JSON.stringify(res.user) });
          this._user$.next(res.user);
        }),
      );
  }

  async loadSession(): Promise<boolean> {
    const { value: token } = await Preferences.get({ key: 'accessToken' });
    const { value: raw }   = await Preferences.get({ key: 'user' });
    if (token && raw) {
      this._user$.next(JSON.parse(raw));
      return true;
    }
    return false;
  }

  async signOut() {
    await Preferences.remove({ key: 'accessToken' });
    await Preferences.remove({ key: 'refreshToken' });
    await Preferences.remove({ key: 'user' });
    this._user$.next(null);
  }

  get currentUser() { return this._user$.value; }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'accessToken' });
    return value;
  }
}
