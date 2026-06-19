import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonSpinner, IonInputPasswordToggle, IonInput, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { airplaneOutline, mailOutline, lockClosedOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonSpinner, IonInputPasswordToggle, IonInput, IonIcon],
  template: `
    <ion-content>
      <div class="page">

        <div class="login-card">

          <!-- Cabecera azul BOA -->
          <div class="card-header">
            <div class="gold-stripe"></div>
            <div class="brand">
              <div class="brand-logo">
                <ion-icon name="airplane-outline"></ion-icon>
              </div>
              <div>
                <span class="brand-name">BOLIVIANA DE AVIACIÓN</span>
                <span class="brand-sub">Sistema de Catering · Cierre de Vuelo</span>
              </div>
            </div>
          </div>

          <!-- Cuerpo blanco -->
          <div class="card-body">

            <div class="card-head">
              <div class="head-icon">
                <ion-icon name="shield-checkmark-outline"></ion-icon>
              </div>
              <div>
                <h2 class="head-title">Acceso al sistema</h2>
                <p class="head-sub">Ingresa tus credenciales institucionales</p>
              </div>
            </div>

            <div class="divider"></div>

            <form [formGroup]="form" (ngSubmit)="signIn()">

              <div class="field">
                <label class="flabel">
                  <ion-icon name="mail-outline"></ion-icon>Correo electrónico
                </label>
                <div class="fbox" [class.err]="submitted && form.get('email')?.invalid">
                  <ion-input type="email" formControlName="email"
                    placeholder="usuario@boa.bo" class="fi"></ion-input>
                </div>
                <span class="ferr" *ngIf="submitted && form.get('email')?.hasError('required')">Campo requerido</span>
                <span class="ferr" *ngIf="submitted && form.get('email')?.hasError('email')">Correo inválido</span>
              </div>

              <div class="field">
                <label class="flabel">
                  <ion-icon name="lock-closed-outline"></ion-icon>Contraseña
                </label>
                <div class="fbox" [class.err]="submitted && form.get('password')?.invalid">
                  <ion-input type="password" formControlName="password"
                    placeholder="••••••••" class="fi">
                    <ion-input-password-toggle slot="end"></ion-input-password-toggle>
                  </ion-input>
                </div>
                <span class="ferr" *ngIf="submitted && form.get('password')?.hasError('required')">Campo requerido</span>
              </div>

              <div class="api-err" *ngIf="errorMsg">⚠ {{ errorMsg }}</div>

              <button type="submit" class="submit-btn" [disabled]="loading">
                <ion-spinner *ngIf="loading" name="crescent"
                  style="width:18px;height:18px;margin-right:8px;color:#fff;"></ion-spinner>
                {{ loading ? 'Verificando...' : 'Iniciar sesión' }}
              </button>

            </form>

            <div class="card-footer">
              <span>BOA · Sistema de Gestión de Catering</span>
              <span>v1.0.0</span>
            </div>

          </div>
        </div>

      </div>
    </ion-content>
  `,
  styles: [`
    ion-content { --background: #003087; }

    /* Centra verticalmente la tarjeta */
    .page {
      min-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 20px;
    }

    /* Tarjeta única */
    .login-card {
      width: 100%;
      max-width: 420px;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(0,0,0,0.28);
    }

    /* ── Cabecera azul ── */
    .card-header {
      background: #002270;
    }

    .gold-stripe {
      height: 5px;
      background: linear-gradient(90deg, #F5A800, #FFD060, #F5A800);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 22px 22px 22px;
    }

    .brand-logo {
      width: 50px; height: 50px;
      border-radius: 12px;
      background: rgba(255,255,255,0.12);
      border: 1.5px solid rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .brand-logo ion-icon { color: #F5A800; font-size: 26px; }

    .brand-name {
      display: block;
      color: #fff;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      line-height: 1;
    }

    .brand-sub {
      display: block;
      color: rgba(255,255,255,0.55);
      font-size: 11px;
      margin-top: 5px;
    }

    /* ── Cuerpo blanco ── */
    .card-body {
      background: #fff;
      padding: 24px 22px 20px;
    }

    .card-head {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 18px;
    }

    .head-icon {
      width: 44px; height: 44px; border-radius: 11px;
      background: #EEF3FF; border: 1px solid #C7D7FF;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }

    .head-icon ion-icon { color: #003087; font-size: 21px; }

    .head-title { color: #0D1B3E; font-size: 17px; font-weight: 700; margin: 0 0 3px; }
    .head-sub   { color: #8A9BB4; font-size: 12px; margin: 0; }

    .divider { height: 1px; background: #EEF2F8; margin-bottom: 20px; }

    /* ── Campos ── */
    .field { margin-bottom: 14px; }

    .flabel {
      display: flex; align-items: center; gap: 6px;
      color: #4A5568; font-size: 13px; font-weight: 600; margin-bottom: 7px;
    }

    .flabel ion-icon { color: #003087; font-size: 14px; }

    .fbox {
      border: 1.5px solid #D8E2F0;
      border-radius: 10px;
      background: #F8FAFF;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .fbox:focus-within {
      border-color: #003087;
      box-shadow: 0 0 0 3px rgba(0,48,135,0.1);
      background: #fff;
    }

    .fbox.err { border-color: #EF4444; }

    .fi {
      --color: #0D1B3E;
      --placeholder-color: #B0BEC5;
      --background: transparent;
      --padding-top: 13px; --padding-bottom: 13px;
      --padding-start: 13px; --padding-end: 13px;
      font-size: 15px;
    }

    .ferr {
      display: block;
      color: #EF4444; font-size: 11px;
      margin-top: 4px; padding-left: 2px;
    }

    .api-err {
      background: #FFF5F5; border: 1px solid #FED7D7;
      color: #C53030; border-radius: 8px;
      padding: 10px 14px; font-size: 13px;
      margin-bottom: 12px; text-align: center;
    }

    /* ── Botón ── */
    .submit-btn {
      width: 100%; padding: 15px;
      background: #003087; color: #fff;
      border: none; border-radius: 10px;
      font-size: 15px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,48,135,0.3);
      transition: background 0.15s, transform 0.1s;
      margin-top: 8px;
    }

    .submit-btn:active    { transform: scale(0.98); background: #002270; }
    .submit-btn[disabled] { background: #B0BEC5; box-shadow: none; cursor: not-allowed; }

    /* ── Footer ── */
    .card-footer {
      display: flex; justify-content: space-between;
      margin-top: 20px;
      padding-top: 14px;
      border-top: 1px solid #EEF2F8;
      color: #C0CCDA; font-size: 11px;
    }
  `],
})
export class LoginPage {
  form: FormGroup;
  loading   = false;
  submitted = false;
  errorMsg  = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    addIcons({ airplaneOutline, mailOutline, lockClosedOutline, shieldCheckmarkOutline });
    this.form = this.fb.group({
      email:    ['admin@boa.bo', [Validators.required, Validators.email]],
      password: ['password123',  Validators.required],
    });
  }

  signIn() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.loading = true; this.errorMsg = '';

    const { email, password } = this.form.value;
    this.authService.signIn(email, password).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/vuelos']); },
      error: (err) => {
        this.loading  = false;
        this.errorMsg = err?.error?.message ?? 'Credenciales incorrectas.';
      },
    });
  }
}
