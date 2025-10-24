export interface TurnoInfo {
    id: string;
    name: string;
    days: number[]; // 0 = domingo, 1 = lunes, ..., 6 = sábado
    startHour: number;
    endHour: number;
    isOvernight?: boolean; // para turnos que cruzan medianoche
}

export const turnos: TurnoInfo[] = [
    {
        id: "1",
        name: "1er Turno - L-V | 08:00-15:00",
        days: [1, 2, 3, 4, 5], // Lunes a Viernes
        startHour: 8,
        endHour: 15
    },
    {
        id: "2",
        name: "2do Turno - L-V | 15:00-21:00",
        days: [1, 2, 3, 4, 5], // Lunes a Viernes
        startHour: 15,
        endHour: 21
    },
    {
        id: "3",
        name: "3er Turno - L,Mi,V | 21:00-08:00",
        days: [1, 3, 5], // Lunes, Miércoles, Viernes
        startHour: 21,
        endHour: 8,
        isOvernight: true
    },
    {
        id: "4",
        name: "4to Turno - Ma,Ju,Do | 21:00-08:00",
        days: [2, 4, 0], // Martes, Jueves, Domingo
        startHour: 21,
        endHour: 8,
        isOvernight: true
    },
    {
        id: "5",
        name: "5to Turno - S,D,Festivos | 08:00-20:00",
        days: [6, 0], // Sábado, Domingo
        startHour: 8,
        endHour: 20
    },
    {
        id: "6",
        name: "6to Turno - S,D,Festivos | 20:00-08:00",
        days: [6, 0], // Sábado, Domingo
        startHour: 20,
        endHour: 8,
        isOvernight: true
    }
];

export function getCurrentTurno(): string | null {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = domingo, 1 = lunes, etc.
    const currentHour = now.getHours();

    for (const turno of turnos) {
        if (isTurnoActive(turno, currentDay, currentHour)) {
            return turno.id;
        }
    }

    return null;
}

function isTurnoActive(turno: TurnoInfo, day: number, hour: number): boolean {
    if (!turno.isOvernight) {
        // Turno normal (no cruza medianoche)
        return turno.days.includes(day) &&
               hour >= turno.startHour &&
               hour < turno.endHour;
    } else {
        // Turno nocturno (cruza medianoche)
        if (turno.days.includes(day)) {
            // Si estamos en el día de inicio del turno y es después de la hora de inicio
            if (hour >= turno.startHour) {
                return true;
            }
        }

        // Verificar el día siguiente para turnos nocturnos
        const previousDay = day === 0 ? 6 : day - 1;
        if (turno.days.includes(previousDay)) {
            // Si estamos en el día siguiente y es antes de la hora de fin
            if (hour < turno.endHour) {
                return true;
            }
        }
    }

    return false;
}

export function isUserInTurno(userTurno: string): boolean {
    const currentTurno = getCurrentTurno();
    return currentTurno === userTurno;
}

export function getTurnoDisplayName(turnoId: string): string {
    const turno = turnos.find(t => t.id === turnoId);
    return turno ? turno.name : `Turno ${turnoId}`;
}

export function getTurnoDisplayForRole(role: string, userTurno: string): string {
    if (role === 'admin') {
        return 'ULTRATHINK';
    }

    if (role === 'jefe' || role === 'operador') {
        const isInTurno = isUserInTurno(userTurno);

        if (!isInTurno) {
            return 'FUERA DE TURNO';
        }

        const turnoName = getTurnoDisplayName(userTurno);
        return turnoName.split(' | ')[0]; // Solo muestra "1er Turno - L-V" sin horarios
    }

    return userTurno ? getTurnoDisplayName(userTurno) : 'Sin turno';
}

export function canCreateReports(role: string, userTurno: string): boolean {
    // Admin siempre puede crear reportes
    if (role === 'admin') {
        return true;
    }

    // Jefe y operador solo pueden crear reportes si están en turno
    if (role === 'jefe' || role === 'operador') {
        return isUserInTurno(userTurno);
    }

    // Paramédicos pueden crear reportes siempre (no hay restricción mencionada)
    return true;
}