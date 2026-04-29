import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

// SERVICIOS
import {StockService} from '../services/stock.service';
import {ComprasService} from '../services/compras.service';

interface ItemCompra {
    itemId: number;
    nombre: string;
    unidad: string;
    cantidad: number;
    costoUnitario: number;
    subtotal: number;
}

@Component({
    selector: 'app-ingreso-mercaderia',
    standalone: true,
    imports: [
        CommonModule, FormsModule, MatButtonModule, MatIconModule,
        MatInputModule, MatSnackBarModule, MatTableModule, MatCardModule
    ],
    templateUrl: './ingreso-mercaderia.component.html'
})
export class IngresoMercaderiaComponent implements OnInit {

    // Formulario Cabecera
    proveedor: string = '';
    codigoFactura: string = '';

    // Búsqueda de productos
    busquedaTerm: string = '';
    productosEncontrados: any[] = [];

    // Tabla de Compra
    carrito: ItemCompra[] = [];

    constructor(
        private stockService: StockService,
        private comprasService: ComprasService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        // Generar un código aleatorio por defecto
        this.codigoFactura = 'FAC-' + Math.floor(Math.random() * 10000);
    }

    // 1. Buscar productos en el backend
    buscarProducto() {
        if (this.busquedaTerm.length < 3) return;

        this.stockService.getItems().subscribe(items => {
            // Filtramos en el cliente por simplicidad (idealmente el backend filtra)
            this.productosEncontrados = items.filter((i: any) =>
                i.nombreItem.toLowerCase().includes(this.busquedaTerm.toLowerCase())
            );
        });
    }

    // 2. Agregar al carrito de compras
    agregarAlCarrito(producto: any) {
        const existe = this.carrito.find(i => i.itemId === producto.idItem);

        if (existe) {
            this.snackBar.open('El producto ya está en la lista', 'Cerrar', { duration: 2000 });
            return;
        }

        this.carrito.push({
            itemId: producto.idItem,
            nombre: producto.nombreItem,
            unidad: producto.unidadMedida,
            cantidad: 100, // Valor por defecto
            costoUnitario: 10, // Valor por defecto
            subtotal: 1000
        });

        this.busquedaTerm = ''; // Limpiar buscador
        this.productosEncontrados = [];
    }

    // 3. Calcular subtotal al cambiar cantidad/precio
    actualizarSubtotal(item: ItemCompra) {
        item.subtotal = item.cantidad * item.costoUnitario;
    }

    eliminarItem(index: number) {
        this.carrito.splice(index, 1);
    }

    // 4. GUARDAR Y PROCESAR (El paso importante)
    registrarIngreso() {
        if (!this.proveedor || this.carrito.length === 0) {
            this.snackBar.open('Complete el proveedor y agregue productos', 'Cerrar');
            return;
        }

        const payload = {
            proveedor: this.proveedor,
            codigoOrden: this.codigoFactura,
            almacenDestinoId: 1, // Asumimos Almacén Central
            usuarioId: 'admin-user', // ID temporal
            items: this.carrito.map(i => ({
                itemId: i.itemId,
                cantidad: i.cantidad,
                costoUnitario: i.costoUnitario
            }))
        };

        // Usamos la función "mágica" que crea y recepciona
        this.comprasService.ingresoDirecto(payload).subscribe({
            next: (res) => {
                this.snackBar.open('✅ Stock actualizado correctamente!', 'Cerrar', {
                    duration: 5000,
                    panelClass: ['bg-green-600', 'text-white']
                });

                // Limpiar formulario
                this.carrito = [];
                this.proveedor = '';
                this.codigoFactura = 'FAC-' + Math.floor(Math.random() * 10000);
            },
            error: (err) => {
                console.error(err);
                this.snackBar.open('Error al registrar ingreso', 'Cerrar');
            }
        });
    }

    get totalCompra() {
        return this.carrito.reduce((acc, item) => acc + item.subtotal, 0);
    }
}
