export const mockUsers = [
    {
        _id: "6570aa123456789012345001",
        username: "admin",
        password: "admin123",
        fullName: "Administrador Sistema",
        role: "admin",
        turno: "1",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
    },
    {
        _id: "6570aa123456789012345002",
        username: "jefe1",
        password: "jefe123",
        fullName: "Juan Pérez García",
        role: "jefe",
        turno: "1",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
    },
    {
        _id: "6570aa123456789012345003",
        username: "jefe2",
        password: "jefe123",
        fullName: "María González López",
        role: "jefe",
        turno: "2",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
    },
    {
        _id: "6570aa123456789012345004",
        username: "operador1",
        password: "oper123",
        fullName: "Pedro Sánchez Vega",
        role: "operador",
        turno: "1",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
    },
    {
        _id: "6570aa123456789012345005",
        username: "operador2",
        password: "oper123",
        fullName: "Ana Ruiz Morales",
        role: "operador",
        turno: "2",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
    },
    {
        _id: "6570aa123456789012345006",
        username: "paramedico1",
        password: "para123",
        fullName: "Dr. Carlos Mendoza",
        role: "paramedico",
        turno: "1",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
    },
    {
        _id: "6570aa123456789012345007",
        username: "paramedico2",
        password: "para123",
        fullName: "Dra. Carmen Vega",
        role: "paramedico",
        turno: "2",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
    }
];

export const mockReports = [
    {
        _id: "6570bb123456789012345001",
        folio: "2024-001",
        tipo: "prehospitalaria",
        gravedad: "alta",
        fechaHoraLlamada: new Date("2024-01-15T08:30:00Z"),
        fechaHoraArribo: new Date("2024-01-15T08:45:00Z"),
        fechaHoraCierre: new Date("2024-01-15T10:30:00Z"),
        ubicacion: "Colonia Centro, Cuajimalpa",
        lugarOcurrencia: "Domicilio particular",
        ambulancia: "AMB-001",
        paramedico: "Dr. Carlos Mendoza",
        observaciones: "Paciente estable tras tratamiento inicial",
        observacionesJefe: "Caso aprobado, manejo adecuado",
        creadoPor: "paramedico1",
        turnoCreacion: "1",
        casoAprobado: true,
        requiereRevision: false,
        createdAt: new Date("2024-01-15T08:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z")
    },
    {
        _id: "6570bb123456789012345002",
        folio: "2024-002",
        tipo: "urbana",
        gravedad: "media",
        fechaHoraLlamada: new Date("2024-01-15T14:20:00Z"),
        fechaHoraArribo: new Date("2024-01-15T14:35:00Z"),
        fechaHoraCierre: null,
        ubicacion: "Parque Central, Cuajimalpa",
        lugarOcurrencia: "Área pública",
        ambulancia: "AMB-002",
        paramedico: "Lic. Ana Torres",
        observaciones: "Lesión menor, no requiere traslado",
        observacionesJefe: null,
        creadoPor: "operador1",
        turnoCreacion: "1",
        casoAprobado: false,
        requiereRevision: false,
        createdAt: new Date("2024-01-15T14:20:00Z"),
        updatedAt: new Date("2024-01-15T14:35:00Z")
    }
];