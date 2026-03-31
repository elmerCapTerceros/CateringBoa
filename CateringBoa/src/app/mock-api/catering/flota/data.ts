export const flotaDataList: any[] = [
    {
        id: 1,
        nombre: 'Flota Internacional',
        descripcion: 'Aeronaves de largo alcance',
        tipoFlota: 'Internacional',
        aeronaves: [
            {
                id: 1,
                modelo: 'Airbus A330-200',
                matricula: 'CP-3055',
                tipoOperacion: 'Mixta',
                capacidad: 250
            },
            {
                id: 2,
                modelo: 'Boeing 787-8 Dreamliner',
                matricula: 'CP-3080',
                tipoOperacion: 'Pasajeros',
                capacidad: 242
            },
            {
                id: 3,
                modelo: 'Airbus A350-900',
                matricula: 'CP-3091',
                tipoOperacion: 'Pasajeros',
                capacidad: 300
            }
        ]
    },

    {
        id: 2,
        nombre: 'Flota Nacional',
        descripcion: 'Vuelos domésticos dentro de Bolivia',
        tipoFlota: 'Nacional',
        aeronaves: [
            {
                id: 4,
                modelo: 'Boeing 737-800',
                matricula: 'CP-3051',
                tipoOperacion: 'Pasajeros',
                capacidad: 168
            },
            {
                id: 5,
                modelo: 'Boeing 737-700',
                matricula: 'CP-3053',
                tipoOperacion: 'Charter',
                capacidad: 140
            },
            {
                id: 6,
                modelo: 'Embraer E190',
                matricula: 'CP-3062',
                tipoOperacion: 'Mixta',
                capacidad: 100
            },
            {
                id: 7,
                modelo: 'Bombardier CRJ-700',
                matricula: 'CP-3070',
                tipoOperacion: 'Pasajeros',
                capacidad: 70
            }
        ]
    },

    {
        id: 3,
        nombre: 'Flota Regional',
        descripcion: 'Rutas sudamericanas y regionales',
        tipoFlota: 'Regional',
        aeronaves: [
            {
                id: 8,
                modelo: 'Airbus A320',
                matricula: 'CP-3052',
                tipoOperacion: 'Mixta',
                capacidad: 180
            },
            {
                id: 9,
                modelo: 'Airbus A319',
                matricula: 'CP-3065',
                tipoOperacion: 'Pasajeros',
                capacidad: 144
            },
            {
                id: 10,
                modelo: 'ATR 72-600',
                matricula: 'CP-3078',
                tipoOperacion: 'Regional',
                capacidad: 72
            }
        ]
    }
];

