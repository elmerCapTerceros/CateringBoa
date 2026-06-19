import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Network } from '@capacitor/network';
import { CierreService } from './services/cierre.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
})
export class AppComponent implements OnInit {
  constructor(private cierreService: CierreService) {}

  async ngOnInit() {
    Network.addListener('networkStatusChange', async (status) => {
      if (status.connected) {
        const synced = await this.cierreService.syncOfflineQueue();
        if (synced > 0) {
          console.info(`[offline-sync] ${synced} cierre(s) sincronizado(s) al reconectarse`);
        }
      }
    });
  }
}
