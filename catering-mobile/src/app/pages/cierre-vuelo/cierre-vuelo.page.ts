import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton,
  IonIcon, IonInput, IonSelect, IonSelectOption, IonTextarea, IonSpinner,
  AlertController, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline, airplaneOutline, cloudOfflineOutline,
  warningOutline, businessOutline, calendarOutline, cubeOutline, alertCircleOutline,
} from 'ionicons/icons';
import { CierreService, VueloPendiente, CierreVueloPayload } from '../../services/cierre.service';
import { Network } from '@capacitor/network';

interface ItemForm {
  itemId: number;
  nombreItem: string;
  unidadMedida: string;
  cantidadCargada: number;
  consumido: number;
  remanente: number;
  estado: 'Normal' | 'Dañado' | 'Perdido';
}

@Component({
  selector: 'app-cierre-vuelo',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton,
    IonIcon, IonInput, IonSelect, IonSelectOption, IonTextarea, IonSpinner,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="gold-stripe"></div>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/vuelos" style="color:rgba(255,255,255,0.8);"></ion-back-button>
        </ion-buttons>
        <div class="tb-center">
          <span class="tb-title">Cierre de Vuelo</span>
          <span *ngIf="vuelo" class="tb-code">{{ vuelo.codigoVuelo }}</span>
        </div>
        <ion-buttons slot="end">
          <div *ngIf="offline" class="offline-chip">
            <ion-icon name="cloud-offline-outline"></ion-icon> Offline
          </div>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <!-- Cargando -->
      <div *ngIf="loading" class="center-state">
        <ion-spinner name="crescent" class="main-spin"></ion-spinner>
        <p>Cargando datos del vuelo...</p>
      </div>

      <!-- Error -->
      <div *ngIf="!loading && error" class="center-state">
        <div class="state-icon red"><ion-icon name="warning-outline"></ion-icon></div>
        <p class="state-title">{{ error }}</p>
        <button class="outline-btn" (click)="loadVuelo()">Reintentar</button>
      </div>

      <ng-container *ngIf="!loading && !error && vuelo">

        <!-- Info card del vuelo -->
        <div class="flight-card">
          <div class="flight-card-header">
            <div class="flight-code">{{ vuelo.codigoVuelo }}</div>
            <span class="status-pill">Pendiente cierre</span>
          </div>
          <div class="flight-meta-grid">
            <div class="meta-item">
              <ion-icon name="airplane-outline"></ion-icon>
              <div>
                <span class="meta-label">Aeronave</span>
                <span class="meta-val">{{ vuelo.aeronave.matricula }} · {{ vuelo.aeronave.tipoAeronave }}</span>
              </div>
            </div>
            <div class="meta-item">
              <ion-icon name="business-outline"></ion-icon>
              <div>
                <span class="meta-label">Almacén</span>
                <span class="meta-val">{{ vuelo.almacen.nombreAlmacen }}</span>
              </div>
            </div>
            <div class="meta-item">
              <ion-icon name="calendar-outline"></ion-icon>
              <div>
                <span class="meta-label">Fecha despacho</span>
                <span class="meta-val">{{ vuelo.fechaDespacho | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Banner offline -->
        <div *ngIf="offline" class="alert-banner amber">
          <ion-icon name="cloud-offline-outline"></ion-icon>
          <span>Sin conexión — se guardará localmente y sincronizará al reconectarse</span>
        </div>

        <!-- Resumen general -->
        <div class="summary-strip">
          <div class="sum-item">
            <span class="sum-num">{{ items.length }}</span>
            <span class="sum-label">Ítems</span>
          </div>
          <div class="sum-div"></div>
          <div class="sum-item">
            <span class="sum-num" style="color:#003087;">{{ totalConsumed }}</span>
            <span class="sum-label">Consumido</span>
          </div>
          <div class="sum-div"></div>
          <div class="sum-item">
            <span class="sum-num" style="color:#10B981;">{{ totalRemainder }}</span>
            <span class="sum-label">Remanente</span>
          </div>
          <div class="sum-div"></div>
          <div class="sum-item">
            <span class="sum-num" [style.color]="incidencias > 0 ? '#F5A800' : '#10B981'">{{ incidencias }}</span>
            <span class="sum-label">Incidencias</span>
          </div>
        </div>

        <!-- Tabla de ítems -->
        <div class="section-bar">
          <span class="section-title">Reporte de ítems cargados</span>
        </div>

        <!-- Header tabla ítems -->
        <div class="items-table">
          <div class="items-table-header">
            <span style="flex:2.5">Ítem</span>
            <span style="flex:1;text-align:center">Cargado</span>
            <span style="flex:1.3;text-align:center">Consumido</span>
            <span style="flex:1;text-align:center">Remanente</span>
            <span style="flex:1.2;text-align:center">Estado</span>
          </div>

          <div
            *ngFor="let item of items; let i = index; let odd = odd"
            class="items-table-row"
            [class.row-odd]="odd"
            [class.row-incident]="item.estado !== 'Normal'">

            <!-- Nombre ítem -->
            <div style="flex:2.5">
              <span class="item-name">{{ item.nombreItem }}</span>
              <span class="item-unit">{{ item.unidadMedida }}</span>
            </div>

            <!-- Cargado (readonly) -->
            <div style="flex:1;text-align:center;">
              <span class="qty-static">{{ item.cantidadCargada }}</span>
            </div>

            <!-- Consumido (input) -->
            <div style="flex:1.3;">
              <div class="qty-input-wrap">
                <ion-input
                  type="number"
                  [(ngModel)]="item.consumido"
                  min="0"
                  [max]="item.cantidadCargada"
                  (ionInput)="recalcular(i)"
                  class="qty-input"
                  placeholder="0">
                </ion-input>
              </div>
            </div>

            <!-- Remanente (readonly) -->
            <div style="flex:1;text-align:center;">
              <span class="qty-rem" [class.rem-zero]="item.remanente === 0">
                {{ item.remanente }}
              </span>
            </div>

            <!-- Estado -->
            <div style="flex:1.2;">
              <ion-select
                [(ngModel)]="item.estado"
                interface="action-sheet"
                class="estado-sel"
                [class.sel-normal]="item.estado === 'Normal'"
                [class.sel-warn]="item.estado === 'Dañado'"
                [class.sel-danger]="item.estado === 'Perdido'">
                <ion-select-option value="Normal">Normal</ion-select-option>
                <ion-select-option value="Dañado">Dañado</ion-select-option>
                <ion-select-option value="Perdido">Perdido</ion-select-option>
              </ion-select>
            </div>

          </div>
        </div>

        <!-- Observaciones -->
        <div class="section-bar" style="margin-top:16px;">
          <span class="section-title">Observaciones generales</span>
          <span class="section-opt">Opcional</span>
        </div>

        <div class="obs-box">
          <ion-textarea
            [(ngModel)]="observaciones"
            rows="3"
            placeholder="Novedades o comentarios sobre el vuelo..."
            class="obs-area">
          </ion-textarea>
        </div>

        <!-- Submit -->
        <div class="action-area">
          <button
            class="submit-btn"
            [disabled]="submitting || !isValid()"
            (click)="confirmarCierre()">
            <ion-spinner *ngIf="submitting" name="crescent" style="width:18px;height:18px;margin-right:8px;"></ion-spinner>
            <ion-icon *ngIf="!submitting" name="checkmark-circle-outline" style="font-size:20px;margin-right:8px;"></ion-icon>
            {{ submitting ? 'Enviando...' : (offline ? 'Guardar sin conexión' : 'Confirmar cierre de vuelo') }}
          </button>
        </div>

        <div style="height:40px;"></div>

      </ng-container>
    </ion-content>
  `,
  styles: [`
    ion-content { --background: #F0F4FA; }
    ion-toolbar  { --background: #003087; --color: #fff; --min-height: 56px; }

    /* ── Toolbar ── */
    .gold-stripe {
      height: 4px;
      background: linear-gradient(90deg, #F5A800, #FFD060, #F5A800);
      position: absolute; top: 0; left: 0; right: 0;
    }

    .tb-center {
      display: flex; flex-direction: column; align-items: center;
    }

    .tb-title { color: #fff; font-size: 15px; font-weight: 700; line-height: 1.2; }
    .tb-code  { color: #F5A800; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; }

    .offline-chip {
      display: flex; align-items: center; gap: 4px;
      background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.4);
      color: #FCA5A5; border-radius: 20px; padding: 3px 10px;
      font-size: 11px; margin-right: 8px;
    }

    /* ── Center state ── */
    .center-state {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 64px 24px; text-align: center; color: #8A9BB4;
    }

    .main-spin { color: #003087; width: 36px; height: 36px; margin-bottom: 12px; }

    .state-icon {
      width: 64px; height: 64px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; margin-bottom: 14px;
    }

    .state-icon.red { background: #FEE2E2; border: 1px solid #FECACA; }
    .state-icon ion-icon { font-size: 30px; color: #EF4444; }
    .state-title { color: #0D1B3E; font-size: 15px; font-weight: 600; margin: 0 0 16px; }

    .outline-btn {
      background: #EEF3FF; border: 1.5px solid #C7D7FF; color: #003087;
      border-radius: 8px; padding: 10px 24px; font-size: 14px; font-weight: 600; cursor: pointer;
    }

    /* ── Flight card ── */
    .flight-card {
      background: #003087;
      margin: 16px 16px 0;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,48,135,0.25);
    }

    .flight-card-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 16px 12px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .flight-code { color: #fff; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; }

    .status-pill {
      background: rgba(245,168,0,0.2); border: 1px solid rgba(245,168,0,0.5);
      color: #F5A800; font-size: 11px; font-weight: 600;
      padding: 3px 10px; border-radius: 20px;
    }

    .flight-meta-grid {
      display: flex; flex-direction: column; gap: 10px;
      padding: 14px 16px;
    }

    .meta-item {
      display: flex; align-items: center; gap: 10px;
    }

    .meta-item ion-icon { color: #F5A800; font-size: 16px; flex-shrink: 0; }

    .meta-label { display: block; color: rgba(255,255,255,0.5); font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-val   { display: block; color: #fff; font-size: 13px; font-weight: 500; }

    /* ── Alert banner ── */
    .alert-banner {
      display: flex; align-items: center; gap: 8px;
      margin: 10px 16px 0; padding: 10px 14px; border-radius: 10px;
      font-size: 13px; font-weight: 500;
    }

    .alert-banner.amber {
      background: #FFFBEB; border: 1px solid #FDE68A; color: #92400E;
    }

    /* ── Summary strip ── */
    .summary-strip {
      display: flex;
      background: #fff; margin: 12px 16px 0; border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,48,135,0.07);
      border: 1px solid rgba(0,48,135,0.06); overflow: hidden;
    }

    .sum-item  { flex: 1; padding: 12px 6px; text-align: center; }
    .sum-num   { display: block; font-size: 20px; font-weight: 800; color: #0D1B3E; line-height: 1; }
    .sum-label { display: block; font-size: 10px; color: #8A9BB4; margin-top: 3px; font-weight: 500; }
    .sum-div   { width: 1px; background: #EEF2F8; margin: 8px 0; }

    /* ── Section bar ── */
    .section-bar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 20px 8px;
    }

    .section-title {
      color: #0D1B3E; font-size: 13px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.5px;
    }

    .section-opt { color: #8A9BB4; font-size: 11px; }

    /* ── Items table ── */
    .items-table {
      margin: 0 16px; background: #fff; border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,48,135,0.08); border: 1px solid rgba(0,48,135,0.06);
      overflow: hidden;
    }

    .items-table-header {
      display: flex; align-items: center;
      background: #003087; padding: 9px 12px;
      color: rgba(255,255,255,0.7); font-size: 10px;
      font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
      border-bottom: 2px solid #F5A800;
    }

    .items-table-row {
      display: flex; align-items: center;
      padding: 10px 12px; border-bottom: 1px solid #EEF2F8;
      transition: background 0.15s;
    }

    .items-table-row:last-child { border-bottom: none; }
    .items-table-row.row-odd     { background: #F8FAFF; }
    .items-table-row.row-incident { background: #FFFDF0; border-left: 3px solid #F5A800; }

    .item-name { display: block; color: #0D1B3E; font-size: 12px; font-weight: 600; }
    .item-unit { display: block; color: #8A9BB4; font-size: 10px; margin-top: 1px; }

    .qty-static {
      color: #4A5568; font-size: 14px; font-weight: 600;
    }

    .qty-rem {
      color: #10B981; font-size: 14px; font-weight: 700;
    }

    .qty-rem.rem-zero { color: #8A9BB4; }

    /* Input de cantidad */
    .qty-input-wrap {
      border: 1.5px solid #D8E2F0; border-radius: 7px;
      background: #F8FAFF; overflow: hidden;
    }

    .qty-input-wrap:focus-within {
      border-color: #003087; background: #fff;
    }

    .qty-input {
      --color: #003087;
      --placeholder-color: #B0BEC5;
      --background: transparent;
      --padding-top: 7px; --padding-bottom: 7px;
      --padding-start: 8px; --padding-end: 4px;
      font-size: 14px; font-weight: 700;
      text-align: center;
    }

    /* Estado select */
    .estado-sel {
      --background: transparent;
      --padding-start: 6px; --padding-top: 5px; --padding-bottom: 5px;
      border: 1.5px solid #D8E2F0; border-radius: 7px;
      font-size: 11px; font-weight: 600;
      width: 100%;
    }

    .sel-normal { border-color: #A7F3D0; color: #065F46; --color: #065F46; }
    .sel-warn   { border-color: #FDE68A; color: #92400E; --color: #92400E; background: #FFFBEB; }
    .sel-danger { border-color: #FECACA; color: #991B1B; --color: #991B1B; background: #FFF5F5; }

    /* ── Observaciones ── */
    .obs-box {
      margin: 0 16px;
      background: #fff; border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,48,135,0.06);
      border: 1px solid rgba(0,48,135,0.06);
      padding: 4px 12px;
    }

    .obs-area {
      --color: #0D1B3E; --placeholder-color: #B0BEC5;
      --background: transparent; font-size: 14px;
    }

    /* ── Action area ── */
    .action-area { margin: 20px 16px 0; }

    .submit-btn {
      width: 100%; padding: 15px;
      background: #003087; color: #fff;
      border: none; border-radius: 12px;
      font-size: 15px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; letter-spacing: 0.3px;
      box-shadow: 0 4px 16px rgba(0,48,135,0.3);
      transition: background 0.15s, transform 0.1s;
    }

    .submit-btn::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: #F5A800;
      border-radius: 12px 12px 0 0;
    }

    .submit-btn { position: relative; }
    .submit-btn:active   { transform: scale(0.98); background: #002270; }
    .submit-btn[disabled] { background: #B0BEC5; box-shadow: none; cursor: not-allowed; }
  `],
})
export class CierreVueloPage implements OnInit {
  vuelo: VueloPendiente | null = null;
  items: ItemForm[] = [];
  observaciones = '';
  loading   = true;
  error     = '';
  submitting = false;
  offline   = false;
  abastecimientoId!: number;

  get totalConsumed()  { return this.items.reduce((s, i) => s + (Number(i.consumido) || 0), 0); }
  get totalRemainder() { return this.items.reduce((s, i) => s + i.remanente, 0); }
  get incidencias()    { return this.items.filter(i => i.estado !== 'Normal').length; }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cierreService: CierreService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {
    addIcons({ checkmarkCircleOutline, airplaneOutline, cloudOfflineOutline,
      warningOutline, businessOutline, calendarOutline, cubeOutline, alertCircleOutline });
  }

  async ngOnInit() {
    const s = await Network.getStatus();
    this.offline = !s.connected;
    this.abastecimientoId = +this.route.snapshot.paramMap.get('id')!;
    await this.loadVuelo();
  }

  async loadVuelo() {
    this.loading = true; this.error = '';

    this.cierreService.getVuelosPendientes().subscribe({
      next: (vuelos) => {
        this.vuelo = vuelos.find(v => v.idAbastecimiento === this.abastecimientoId) ?? null;
        if (!this.vuelo) {
          this.error = 'Vuelo no encontrado o ya cerrado.';
        } else {
          this.items = this.vuelo.detalles.map(d => ({
            itemId:          d.item.idItem,
            nombreItem:      d.item.nombreItem,
            unidadMedida:    d.item.unidadMedida,
            cantidadCargada: d.cantidad,
            consumido:       0,
            remanente:       d.cantidad,
            estado:          'Normal',
          }));
        }
        this.loading = false;
      },
      error: () => { this.error = 'Error al cargar el vuelo.'; this.loading = false; },
    });
  }

  recalcular(i: number) {
    const item = this.items[i];
    item.consumido = Math.min(Math.max(0, Number(item.consumido) || 0), item.cantidadCargada);
    item.remanente = item.cantidadCargada - item.consumido;
  }

  isValid() { return this.items.length > 0 && this.items.every(i => i.consumido >= 0); }

  async confirmarCierre() {
    const msg = this.offline
      ? 'Se guardará localmente y sincronizará al reconectarse.'
      : this.incidencias > 0
        ? `Se registrarán ${this.incidencias} incidencia(s). ¿Confirmar?`
        : '¿Confirmar el cierre de este vuelo?';

    const alert = await this.alertCtrl.create({
      header: 'Confirmar cierre',
      message: msg,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Confirmar', handler: () => this.submitCierre() },
      ],
    });
    await alert.present();
  }

  async submitCierre() {
    this.submitting = true;
    const payload: CierreVueloPayload = {
      abastecimientoId: this.abastecimientoId,
      observaciones:    this.observaciones || undefined,
      items: this.items.map(i => ({
        itemId: i.itemId, cantidadCargada: i.cantidadCargada,
        consumido: i.consumido, remanente: i.remanente, estado: i.estado,
      })),
    };

    if (this.offline) {
      await this.cierreService.cerrarVueloOffline(payload);
      this.submitting = false;
      const t = await this.toastCtrl.create({ message: 'Guardado sin conexión', duration: 3000, color: 'warning', position: 'top' });
      await t.present();
      this.router.navigate(['/vuelos']);
      return;
    }

    this.cierreService.cerrarVuelo(payload).subscribe({
      next: async () => {
        this.submitting = false;
        const t = await this.toastCtrl.create({ message: 'Vuelo cerrado exitosamente', duration: 2500, color: 'success', position: 'top' });
        await t.present();
        this.router.navigate(['/vuelos']);
      },
      error: async () => {
        this.submitting = false;
        const a = await this.alertCtrl.create({
          header: 'Error al enviar',
          message: '¿Guardar sin conexión para sincronizar más tarde?',
          buttons: [
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Guardar offline', handler: async () => {
              await this.cierreService.cerrarVueloOffline(payload);
              const t = await this.toastCtrl.create({ message: 'Guardado sin conexión', duration: 2000, color: 'warning', position: 'top' });
              await t.present();
              this.router.navigate(['/vuelos']);
            }},
          ],
        });
        await a.present();
      },
    });
  }
}
