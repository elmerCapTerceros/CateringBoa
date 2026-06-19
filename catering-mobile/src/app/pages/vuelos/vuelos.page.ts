import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonRefresher, IonRefresherContent,
  IonSkeletonText, IonIcon, AlertController, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  airplaneOutline, logOutOutline, timeOutline, checkmarkCircleOutline,
  cloudOfflineOutline, calendarOutline, chevronForwardOutline,
  businessOutline, warningOutline, syncOutline,
} from 'ionicons/icons';
import { CierreService, VueloPendiente } from '../../services/cierre.service';
import { AuthService } from '../../services/auth.service';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-vuelos',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonRefresher, IonRefresherContent,
    IonSkeletonText, IonIcon,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <!-- Franja dorada BOA -->
        <div class="gold-stripe" slot="top"></div>
        <div class="toolbar-inner">
          <div class="toolbar-left">
            <div class="toolbar-logo">
              <ion-icon name="airplane-outline"></ion-icon>
            </div>
            <div>
              <div class="toolbar-title">BOA Catering</div>
              <div class="toolbar-user">{{ userName }}</div>
            </div>
          </div>
          <div class="toolbar-right">
            <button class="tb-btn warn" (click)="sync()" *ngIf="hasPendingOffline" title="Sincronizar">
              <ion-icon name="sync-outline"></ion-icon>
            </button>
            <button class="tb-btn" (click)="logout()" title="Cerrar sesión">
              <ion-icon name="log-out-outline"></ion-icon>
            </button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Banner offline -->
      <div *ngIf="offline" class="alert-banner red">
        <ion-icon name="warning-outline"></ion-icon>
        <span>Sin conexión — los cierres se guardarán localmente</span>
      </div>
      <div *ngIf="hasPendingOffline && !offline" class="alert-banner amber" (click)="sync()">
        <ion-icon name="sync-outline"></ion-icon>
        <span>Cierres pendientes de sincronizar · Toca para enviar</span>
      </div>

      <!-- KPI strip -->
      <div class="kpi-strip">
        <div class="kpi-card">
          <span class="kpi-num" [style.color]="vuelos.length > 0 ? '#F5A800' : '#10B981'">
            {{ loading ? '—' : vuelos.length }}
          </span>
          <span class="kpi-label">Pendientes</span>
        </div>
        <div class="kpi-divider"></div>
        <div class="kpi-card">
          <span class="kpi-num" style="color:#003087;">{{ loading ? '—' : totalItems }}</span>
          <span class="kpi-label">Total ítems</span>
        </div>
        <div class="kpi-divider"></div>
        <div class="kpi-card">
          <span class="kpi-num" [style.color]="offline ? '#EF4444' : '#10B981'">
            {{ offline ? 'OFF' : 'ON' }}
          </span>
          <span class="kpi-label">Conexión</span>
        </div>
      </div>

      <!-- Section title -->
      <div class="section-bar">
        <span class="section-title">Vuelos pendientes de cierre</span>
      </div>

      <!-- Skeletons -->
      <ng-container *ngIf="loading">
        <div *ngFor="let s of [1,2,3]" class="flight-row skeleton">
          <ion-skeleton-text animated style="width:80px;height:18px;border-radius:4px;"></ion-skeleton-text>
          <ion-skeleton-text animated style="width:55%;height:13px;margin-top:8px;border-radius:4px;"></ion-skeleton-text>
          <ion-skeleton-text animated style="width:40%;height:13px;margin-top:5px;border-radius:4px;"></ion-skeleton-text>
        </div>
      </ng-container>

      <!-- Error -->
      <div *ngIf="!loading && error" class="empty-state">
        <div class="empty-icon red"><ion-icon name="warning-outline"></ion-icon></div>
        <p class="empty-title">Error de conexión</p>
        <p class="empty-sub">{{ error }}</p>
        <button class="outline-btn" (click)="loadVuelos()">Reintentar</button>
      </div>

      <!-- Sin vuelos -->
      <div *ngIf="!loading && !error && vuelos.length === 0" class="empty-state">
        <div class="empty-icon green"><ion-icon name="checkmark-circle-outline"></ion-icon></div>
        <p class="empty-title">Todo al día</p>
        <p class="empty-sub">No hay vuelos pendientes de cierre</p>
      </div>

      <!-- Tabla de vuelos -->
      <div *ngIf="!loading && !error && vuelos.length > 0" class="table-wrap">

        <!-- Header tabla -->
        <div class="table-header">
          <span style="flex:1.2">Vuelo</span>
          <span style="flex:1.6">Aeronave</span>
          <span style="flex:1.5">Fecha despacho</span>
          <span style="flex:0.7;text-align:center">Ítems</span>
          <span style="flex:0.4"></span>
        </div>

        <!-- Filas -->
        <div
          *ngFor="let v of vuelos; let odd = odd"
          class="table-row"
          [class.row-odd]="odd"
          (click)="abrirCierre(v)">

          <div style="flex:1.2">
            <span class="flight-code">{{ v.codigoVuelo }}</span>
            <div class="status-pill">Pendiente</div>
          </div>

          <div style="flex:1.6">
            <span class="cell-primary">{{ v.aeronave.matricula }}</span>
            <span class="cell-secondary">{{ v.aeronave.tipoAeronave }}</span>
          </div>

          <div style="flex:1.5">
            <span class="cell-primary">{{ v.fechaDespacho | date:'dd/MM/yyyy' }}</span>
            <span class="cell-secondary">{{ v.fechaDespacho | date:'HH:mm' }}</span>
          </div>

          <div style="flex:0.7;text-align:center;">
            <span class="items-badge">{{ v.detalles.length }}</span>
          </div>

          <div style="flex:0.4;text-align:right;">
            <ion-icon name="chevron-forward-outline" class="row-arrow"></ion-icon>
          </div>
        </div>
      </div>

      <div style="height:32px;"></div>
    </ion-content>
  `,
  styles: [`
    ion-content { --background: #F0F4FA; }

    /* ── Toolbar ── */
    ion-toolbar { --background: #003087; --color: #fff; --min-height: 60px; }

    .gold-stripe {
      height: 4px;
      background: linear-gradient(90deg, #F5A800, #FFD060, #F5A800);
      position: absolute;
      top: 0; left: 0; right: 0;
    }

    .toolbar-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
    }

    .toolbar-left  { display: flex; align-items: center; gap: 12px; }
    .toolbar-right { display: flex; gap: 6px; }

    .toolbar-logo {
      width: 38px; height: 38px; border-radius: 8px;
      background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
    }

    .toolbar-logo ion-icon { color: #F5A800; font-size: 20px; }

    .toolbar-title { color: #fff; font-size: 15px; font-weight: 700; line-height: 1; }
    .toolbar-user  { color: rgba(255,255,255,0.65); font-size: 11px; margin-top: 2px; }

    .tb-btn {
      width: 34px; height: 34px; border-radius: 8px; border: none;
      background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; cursor: pointer;
    }

    .tb-btn.warn { color: #F5A800; background: rgba(245,168,0,0.15); }

    /* ── Alert banners ── */
    .alert-banner {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 16px; font-size: 13px; font-weight: 500;
    }

    .alert-banner.red   { background: #FEE2E2; color: #991B1B; border-bottom: 1px solid #FECACA; }
    .alert-banner.amber { background: #FFFBEB; color: #92400E; border-bottom: 1px solid #FDE68A; cursor: pointer; }

    /* ── KPI strip ── */
    .kpi-strip {
      display: flex;
      background: #fff;
      margin: 16px 16px 0;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,48,135,0.08);
      border: 1px solid rgba(0,48,135,0.06);
      overflow: hidden;
    }

    .kpi-card {
      flex: 1; padding: 14px 8px; text-align: center;
      display: flex; flex-direction: column; align-items: center;
    }

    .kpi-num   { font-size: 24px; font-weight: 800; line-height: 1; }
    .kpi-label { font-size: 11px; color: #8A9BB4; margin-top: 4px; font-weight: 500; }
    .kpi-divider { width: 1px; background: #EEF2F8; margin: 10px 0; }

    /* ── Section bar ── */
    .section-bar {
      padding: 20px 20px 10px;
      display: flex; align-items: center; justify-content: space-between;
    }

    .section-title {
      color: #0D1B3E; font-size: 14px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.5px;
    }

    /* ── Table ── */
    .table-wrap {
      margin: 0 16px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,48,135,0.08);
      border: 1px solid rgba(0,48,135,0.06);
      overflow: hidden;
    }

    .table-header {
      display: flex;
      background: #003087;
      padding: 10px 14px;
      color: rgba(255,255,255,0.75);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #F5A800;
    }

    .table-row {
      display: flex;
      align-items: center;
      padding: 12px 14px;
      border-bottom: 1px solid #EEF2F8;
      cursor: pointer;
      transition: background 0.15s;
    }

    .table-row:last-child { border-bottom: none; }
    .table-row:active     { background: #EEF3FF; }
    .table-row.row-odd    { background: #F8FAFF; }
    .table-row.row-odd:active { background: #E8F0FF; }

    .flight-code {
      color: #003087; font-size: 15px; font-weight: 700; display: block;
    }

    .status-pill {
      display: inline-block;
      background: #FFFBEB; border: 1px solid #FDE68A;
      color: #92400E; font-size: 10px; font-weight: 600;
      padding: 2px 7px; border-radius: 20px; margin-top: 4px;
    }

    .cell-primary   { display: block; color: #0D1B3E; font-size: 13px; font-weight: 600; }
    .cell-secondary { display: block; color: #8A9BB4; font-size: 11px; margin-top: 2px; }

    .items-badge {
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; border-radius: 50%;
      background: #EEF3FF; border: 1.5px solid #C7D7FF;
      color: #003087; font-size: 13px; font-weight: 700;
    }

    .row-arrow { color: #B0BEC5; font-size: 18px; }

    /* ── Skeleton ── */
    .skeleton { display: flex; flex-direction: column; padding: 16px; }
    .flight-row { border-bottom: 1px solid #EEF2F8; }

    /* ── Empty state ── */
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      padding: 56px 24px; text-align: center;
    }

    .empty-icon {
      width: 64px; height: 64px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; margin-bottom: 14px;
    }

    .empty-icon.red   { background: #FEE2E2; border: 1px solid #FECACA; }
    .empty-icon.green { background: #D1FAE5; border: 1px solid #A7F3D0; }
    .empty-icon ion-icon { font-size: 32px; }
    .empty-icon.red   ion-icon { color: #EF4444; }
    .empty-icon.green ion-icon { color: #10B981; }

    .empty-title { color: #0D1B3E; font-size: 16px; font-weight: 700; margin: 0 0 6px; }
    .empty-sub   { color: #8A9BB4; font-size: 13px; margin: 0 0 20px; }

    .outline-btn {
      background: #EEF3FF; border: 1.5px solid #C7D7FF;
      color: #003087; border-radius: 8px; padding: 10px 24px;
      font-size: 14px; font-weight: 600; cursor: pointer;
    }
  `],
})
export class VuelosPage implements OnInit {
  vuelos: VueloPendiente[] = [];
  loading = true;
  error   = '';
  offline = false;
  hasPendingOffline = false;

  get userName()    { return this.authService.currentUser?.name ?? ''; }
  get totalItems()  { return this.vuelos.reduce((s, v) => s + v.detalles.length, 0); }

  constructor(
    private cierreService: CierreService,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {
    addIcons({ airplaneOutline, logOutOutline, timeOutline, checkmarkCircleOutline,
      cloudOfflineOutline, calendarOutline, chevronForwardOutline,
      businessOutline, warningOutline, syncOutline });
  }

  async ngOnInit() {
    const status = await Network.getStatus();
    this.offline = !status.connected;
    this.hasPendingOffline = await this.cierreService.hasPendingOffline();
    await this.loadVuelos();
  }

  async loadVuelos() {
    this.loading = true; this.error = '';
    if (this.offline) { this.loading = false; return; }

    this.cierreService.getVuelosPendientes().subscribe({
      next:  (d) => { this.vuelos = d; this.loading = false; },
      error: ()  => { this.error = 'No se pudo conectar con el servidor.'; this.loading = false; },
    });
  }

  async refresh(event: any) {
    const s = await Network.getStatus(); this.offline = !s.connected;
    this.hasPendingOffline = await this.cierreService.hasPendingOffline();
    await this.loadVuelos();
    event.target.complete();
  }

  abrirCierre(v: VueloPendiente) { this.router.navigate(['/cierre', v.idAbastecimiento]); }

  async sync() {
    const synced = await this.cierreService.syncOfflineQueue();
    this.hasPendingOffline = await this.cierreService.hasPendingOffline();
    const toast = await this.toastCtrl.create({
      message: synced > 0 ? `${synced} cierre(s) sincronizado(s)` : 'Sin datos para sincronizar',
      duration: 2500, color: synced > 0 ? 'success' : 'warning', position: 'top',
    });
    await toast.present();
    if (synced > 0) await this.loadVuelos();
  }

  async logout() {
    const a = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Deseas salir del sistema?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Salir', handler: async () => { await this.authService.signOut(); this.router.navigate(['/login']); } },
      ],
    });
    await a.present();
  }
}
