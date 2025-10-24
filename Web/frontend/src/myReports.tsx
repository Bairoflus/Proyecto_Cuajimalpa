import { List, DataTable, Show, SimpleShowLayout, TextField, DateField, BooleanField, FunctionField, ListButton } from "react-admin";
import { Box, Typography, Chip } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import InfoIcon from '@mui/icons-material/Info';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotesIcon from '@mui/icons-material/Notes';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import GavelIcon from '@mui/icons-material/Gavel';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const GravedadField = ({ record }: any) => {
    const getGravedadColor = (gravedad: string) => {
        switch (gravedad) {
            case 'alta': return 'error';
            case 'media': return 'warning';
            case 'baja': return 'success';
            default: return 'default';
        }
    };

    return (
        <Chip
            label={record?.gravedad}
            color={getGravedadColor(record?.gravedad) as any}
            size="small"
            aria-label={`Gravedad: ${record?.gravedad}`}
            sx={{ textTransform: 'capitalize' }}
        />
    );
};

const TipoField = ({ record }: any) => {
    const getTipoColor = (tipo: string) => {
        switch (tipo) {
            case 'prehospitalaria': return 'error';
            case 'urbana': return 'warning';
            case 'otro': return 'info';
            default: return 'default';
        }
    };

    return (
        <Chip
            label={record?.tipo}
            color={getTipoColor(record?.tipo) as any}
            size="small"
            aria-label={`Tipo de emergencia: ${record?.tipo}`}
            sx={{ textTransform: 'capitalize' }}
        />
    );
};

// Lista de reportes filtrada por usuario
export const MyReportsList = () => {
    const username = localStorage.getItem("username");

    return (
        <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <PersonIcon sx={{ fontSize: 32, color: '#1663afff' }} aria-label="Mis reportes personales" />
                    Mis Reportes
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: '#64748b',
                        fontSize: '1.1rem'
                    }}
                >
                    Reportes creados por {username}
                </Typography>
            </Box>

            <List filter={{ creadoPor: username }} title="">
                <DataTable
                    rowClick="show"
                    aria-label="Tabla de mis reportes"
                    sx={{
                        width: '100%',
                        maxWidth: '100%',
                        overflowX: 'auto',
                        '& .MuiTableContainer-root': {
                            borderRadius: 4,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                            border: '1px solid #e2e8f0',
                            width: '100%',
                            maxWidth: '100%'
                        },
                        '& .MuiTable-root': {
                            minWidth: '100%',
                            tableLayout: 'fixed'
                        },
                        '& .RaDatagrid-headerCell, & .RaDatagrid-rowCell': {
                            fontSize: '0.7rem',
                            padding: '4px 8px',
                        },
                        '& .MuiCheckbox-root': {
                            padding: '2px',
                            transform: 'scale(0.8)',
                            '&.Mui-checked': {
                                color: '#1663afff',
                            }
                        },
                        '& .RaDatagrid-headerCell:first-of-type': {
                            width: '50px !important',
                            maxWidth: '50px',
                            minWidth: '50px',
                            padding: '4px !important',
                        },
                        '& .RaDatagrid-rowCell:first-of-type': {
                            width: '50px !important',
                            maxWidth: '50px',
                            minWidth: '50px',
                            padding: '4px !important',
                            overflow: 'visible',
                        }
                    }}
                >
                    <DataTable.Col source="folio" label="Folio" sx={{ width: '90px', maxWidth: '90px' }} />
                    <DataTable.Col
                        source="tipo"
                        label="Tipo"
                        render={(record: any) => <TipoField record={record} />}
                        sx={{ width: '90px', maxWidth: '90px' }}
                    />
                    <DataTable.Col source="fechaHoraLlamada" label="Llamada" sx={{ width: '110px', maxWidth: '110px' }} />
                    <DataTable.Col
                        source="ubicacion"
                        label="Ubicación"
                        sx={{ width: '150px', maxWidth: '150px' }}
                        render={(record: any) => {
                            if (typeof record?.ubicacion === 'string') {
                                return record.ubicacion;
                            }
                            if (record?.ubicacion?.calle) {
                                return record.ubicacion.calle;
                            }
                            return 'N/A';
                        }}
                    />
                    <DataTable.Col
                        source="gravedad"
                        label="Gravedad"
                        render={(record: any) => <GravedadField record={record} />}
                        sx={{ width: '80px', maxWidth: '80px' }}
                    />
                    <DataTable.Col source="ambulancia" label="Ambulancia" sx={{ width: '90px', maxWidth: '90px' }} />
                    <DataTable.Col source="paramedico" label="Paramédico" sx={{ width: '120px', maxWidth: '120px' }} />
                </DataTable>
            </List>
        </Box>
    );
};

const ShowToolbar = () => (
    <Box sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2
    }}>
        <ListButton
            sx={{
                backgroundColor: '#64748b',
                color: '#fff !important',
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                '&:hover': {
                    backgroundColor: '#475569'
                },
                '& .MuiButton-startIcon': {
                    color: '#fff !important'
                },
                '& .MuiSvgIcon-root': {
                    color: '#fff !important'
                }
            }}
        />
    </Box>
);

// Vista de reporte individual (solo lectura para operadores/paramédicos)
export const MyReportShow = () => (
    <Show actions={false}>
        <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{
                p: 4,
                backgroundColor: '#fff',
                borderRadius: 3,
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                position: 'relative'
            }}>
                <ShowToolbar />

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PersonIcon sx={{ fontSize: 32, color: '#1663afff' }} />
                        Detalles de Mi Reporte
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
                        Vista completa del reporte médico
                    </Typography>
                </Box>

                <SimpleShowLayout>
                    {/* Información Básica del Reporte */}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoIcon sx={{ color: '#1663afff' }} /> Información Básica del Reporte
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Folio del reporte
                            </Typography>
                            <FunctionField render={(record: any) => record?.folio || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Tipo de reporte
                            </Typography>
                            <FunctionField render={(record: any) => record?.tipo || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Nivel de gravedad
                            </Typography>
                            <FunctionField render={(record: any) => record?.gravedad || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Motivo de la llamada
                            </Typography>
                            <FunctionField render={(record: any) => record?.motivoLlamada || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Código de incidente
                            </Typography>
                            <FunctionField render={(record: any) => record?.incidenteCodigo || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Motivo de atención
                            </Typography>
                            <FunctionField render={(record: any) => record?.motivoAtencion || 'No Registrado'} />
                        </Box>
                    </Box>

                    {/* Cronometría - Fechas y Horarios */}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon sx={{ color: '#1663afff' }} /> Cronometría - Fechas y Horarios
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Fecha/hora de la llamada
                            </Typography>
                            <FunctionField render={(record: any) => record?.fechaHoraLlamada ? new Date(record.fechaHoraLlamada).toLocaleString() : 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Fecha/hora de arribo al sitio
                            </Typography>
                            <FunctionField render={(record: any) => record?.fechaHoraArribo ? new Date(record.fechaHoraArribo).toLocaleString() : 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Hora de traslado
                            </Typography>
                            <FunctionField render={(record: any) => record?.horaTraslado ? new Date(record.horaTraslado).toLocaleString() : 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Hora de salida
                            </Typography>
                            <FunctionField render={(record: any) => record?.horaSalida ? new Date(record.horaSalida).toLocaleString() : 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Hora llegada al hospital
                            </Typography>
                            <FunctionField render={(record: any) => record?.horaHospital ? new Date(record.horaHospital).toLocaleString() : 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Hora salida del hospital
                            </Typography>
                            <FunctionField render={(record: any) => record?.salidaHospital ? new Date(record.salidaHospital).toLocaleString() : 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Fecha/hora de cierre
                            </Typography>
                            <FunctionField render={(record: any) => record?.fechaHoraCierre ? new Date(record.fechaHoraCierre).toLocaleString() : 'No Registrado'} />
                        </Box>
                    </Box>

                    {/* Ubicación del Servicio */}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon sx={{ color: '#1663afff' }} /> Ubicación del Servicio
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Ubicación / Calle principal
                            </Typography>
                            <FunctionField render={(record: any) => {
                                const ub = record?.ubicacion;
                                if (!ub) return 'No Registrado';
                                if (typeof ub === 'string') return ub;
                                if (typeof ub === 'object' && ub.calle) return String(ub.calle);
                                return 'No Registrado';
                            }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Entre calles
                            </Typography>
                            <FunctionField render={(record: any) => record?.ubicacion?.entre || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Colonia/Comunidad
                            </Typography>
                            <FunctionField render={(record: any) => record?.ubicacion?.colonia || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Alcaldía/Delegación
                            </Typography>
                            <FunctionField render={(record: any) => record?.delegacion || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Lugar de ocurrencia
                            </Typography>
                            <FunctionField render={(record: any) => record?.lugarOcurrencia || 'No Registrado'} />
                        </Box>
                    </Box>

                    {/* Recursos y Personal */}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ color: '#1663afff' }} /> Recursos y Personal
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Unidad/Ambulancia
                            </Typography>
                            <FunctionField render={(record: any) => record?.ambulancia || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Entidad de la unidad
                            </Typography>
                            <FunctionField render={(record: any) => record?.entidadUnidad || record?.entidad || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Paramédico a cargo
                            </Typography>
                            <FunctionField render={(record: any) => record?.paramedico || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Creado por
                            </Typography>
                            <FunctionField render={(record: any) => record?.creadoPor || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Turno de creación
                            </Typography>
                            <FunctionField render={(record: any) => record?.turnoCreacion || 'No Registrado'} />
                        </Box>
                    </Box>

                    {/* Métricas del Servicio */}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssessmentIcon sx={{ color: '#1663afff' }} /> Métricas del Servicio
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Kilómetros recorridos
                            </Typography>
                            <FunctionField render={(record: any) => record?.kilometros || record?.kmRecorridos || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Tiempo de atención en sitio (minutos)
                            </Typography>
                            <FunctionField render={(record: any) => record?.tiempoAtencionMin || record?.tiempoDeAtencion || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Tiempo de traslado (minutos)
                            </Typography>
                            <FunctionField render={(record: any) => record?.tiempoTrasladoMin || record?.tiempoDeTraslado || 'No Registrado'} />
                        </Box>
                    </Box>

                    {/* Observaciones y Control */}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotesIcon sx={{ color: '#1663afff' }} /> Observaciones y Control
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3, mb: 4 }}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Observaciones generales
                            </Typography>
                            <FunctionField render={(record: any) => record?.observaciones || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Observaciones del jefe
                            </Typography>
                            <FunctionField render={(record: any) => record?.observacionesJefe || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Estado del caso
                            </Typography>
                            <FunctionField render={(record: any) => record?.casoAprobado ? 'Aprobado' : 'Pendiente de aprobación'} />
                        </Box>
                    </Box>
                </SimpleShowLayout>
            </Box>
        </Box>
    </Show>
);