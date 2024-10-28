// Zuerst installieren wir das Plugin für den QR-Scanner
// Führe im Hauptverzeichnis des Projekts folgenden Befehl aus:
// npm install @capacitor-community/barcode-scanner
// npx cap sync
// Danach fügen wir das Plugin zu den Modulen in app.module.ts hinzu

import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-home',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage {
  public folder!: string;
  public isScanning: boolean = false; // Variable hinzufügen

  constructor(private alertController: AlertController) {
    this.folder = 'default-folder';
  }

  async scanQRCode() {
    this.isScanning = true; // Start des Scannens -> Hintergrund transparent machen
    try {
      await BarcodeScanner.checkPermission({ force: true });
      await BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        const alert = await this.alertController.create({
          header: 'QR-Code Inhalt',
          message: result.content,
          buttons: ['OK'],
        });
        await alert.present();
      }
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Fehler',
        message: 'QR-Code konnte nicht gelesen werden: ' + error,
        buttons: ['OK'],
      });
      await alert.present();
    } finally {
      this.isScanning = false; // Nach dem Scannen -> Hintergrund wieder normal
    }
  }
}

// Füge den Button zu einer Seite (z. B. der Startseite, also folder.page.html) hinzu
// folder.page.html
// <ion-button (click)="scanQRCode()">QR-Code scannen</ion-button>

// Hinweis: Da QR-Code-Scanner Zugriff auf die Kamera benötigen, stelle sicher, dass die Berechtigungen korrekt gesetzt sind. Capacitor fragt standardmäßig nach Berechtigungen beim ersten Zugriff.
