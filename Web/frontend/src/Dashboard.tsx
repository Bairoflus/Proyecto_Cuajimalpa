// src/Dashboard.tsx
import {
    Grid,
    Typography,
    Box,
    Chip,
    LinearProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress
} from "@mui/material";
import { usePermissions, useRedirect } from "react-admin";
import { useState, useEffect } from "react";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AmbulanceIcon from '@mui/icons-material/AirportShuttle';
import PeopleIcon from '@mui/icons-material/People';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import RouteIcon from '@mui/icons-material/Route';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TimelineIcon from '@mui/icons-material/Timeline';

interface DashboardStats {
    totalReportes: number;
    reportesHoy: number;
    tiempoPromedioRespuesta: number;
    tiempoPromedioAtencion: number;
    tiempoPromedioTraslado: number;
    kmTotales: number;
    falsasAlarmas: number;
    distribucionTipo: Array<{ tipo: string; cantidad: number; porcentaje: number }>;
    distribucionGravedad: Array<{ gravedad: string; cantidad: number; porcentaje: number; color: string }>;
    reportesPorHora: Array<{ hora: string; cantidad: number }>;
    estadisticasAmbulancia: Array<{
        ambulancia: string;
        servicios: number;
        kmTotales: number;
        kmPromedio: number;
        tiempoPromedioRespuesta: number;
    }>;
    estadisticasParametrico: Array<{
        parametrico: string;
        servicios: number;
        tiempoPromedio: number;
    }>;
    ubicacionesFrecuentes: Array<{
        zona: string;
        reportes: number;
        tiempoPromedio: number;
    }>;
    estadisticasPrehospitalaria: {
        total: number;
        conTraslado: number;
        porcentajeTraslado: number;
        hospitalesDestino: Array<{ hospital: string; traslados: number }>;
        distribucionEdad: Array<{ rango: string; cantidad: number }>;
    };
    estadisticasUrbana: {
        total: number;
        conEvidencias: number;
        porcentajeEvidencias: number;
        requierenNota: number;
        porcentajeNota: number;
    };
    indicadoresCalidad: {
        porcentajeFalsasAlarmas: number;
        porcentajeCasosCerrados: number;
        tiempoTotalPromedio: number;
        eficienciaTraslados: number;
    };
    reportesPendientesCierre: number;
}

const GraficaBarras = ({ datos, titulo, colorBarra = "#3b82f6", maxHeight }: any) => {
    const maxValor = Math.max(...datos.map((d: any) => d.cantidad || d.servicios || d.reportes));

    return (
        <Box sx={{
            p: 3,
            backgroundColor: '#fff',
            borderRadius: 2,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            maxHeight: maxHeight || '500px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Typography variant="subtitle1" sx={{
                fontWeight: 700,
                color: '#111827',
                mb: 3,
                letterSpacing: '-0.025em'
            }}>
                {titulo}
            </Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                overflowY: 'auto',
                flex: 1,
                pr: 1,
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                }
            }}>
                {datos.map((item: any, index: number) => (
                    <Box key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#6b7280' }}>
                                {item.hora || item.ambulancia || item.zona || item.parametrico}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
                                {item.cantidad || item.servicios || item.reportes}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={(item.cantidad || item.servicios || item.reportes) / maxValor * 100}
                            aria-label={`Progreso de ${item.hora || item.ambulancia || item.zona || item.parametrico}: ${item.cantidad || item.servicios || item.reportes} de ${maxValor}`}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: '#f3f4f6',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 3,
                                    backgroundColor: colorBarra
                                }
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

const GraficaCircular = ({ datos, titulo }: any) => {
    return (
        <Box sx={{
            p: 3,
            backgroundColor: '#fff',
            borderRadius: 2,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            height: '100%'
        }}>
            <Typography variant="subtitle1" sx={{
                fontWeight: 700,
                color: '#111827',
                mb: 3,
                letterSpacing: '-0.025em'
            }}>
                {titulo}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {datos.map((item: any, index: number) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: item.color ||
                                    (index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#10b981')
                            }}
                        />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#6b7280', mb: 0.5 }}>
                                {item.tipo || item.gravedad}
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={item.porcentaje}
                                aria-label={`${item.tipo || item.gravedad}: ${item.porcentaje}% (${item.cantidad} casos)`}
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: '#f3f4f6',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 3,
                                        backgroundColor: item.color ||
                                            (index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#10b981')
                                    }
                                }}
                            />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827', minWidth: 60 }}>
                            {item.cantidad} ({item.porcentaje}%)
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

const TarjetaMetrica = ({ titulo, valor, subtitulo, icono, color = "#3b82f6" }: any) => (
    <Box sx={{
        p: 3,
        backgroundColor: '#fff',
        borderRadius: 2,
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        height: '100%',
        transition: 'all 0.2s ease',
        '&:hover': {
            borderColor: color,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)'
        }
    }}
    role="region"
    aria-label={`Métrica: ${titulo}`}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="caption" sx={{
                color: '#6b7280',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {titulo}
            </Typography>
            <Box sx={{ color: color, opacity: 0.8 }} aria-hidden="true">
                {icono}
            </Box>
        </Box>
        <Typography variant="h3" sx={{
            fontWeight: 800,
            color: color,
            mb: 0.5,
            lineHeight: 1.1
        }}>
            {valor}
        </Typography>
        {subtitulo && (
            <Typography variant="caption" sx={{
                color: '#9ca3af',
                fontSize: '0.8rem'
            }}>
                {subtitulo}
            </Typography>
        )}
    </Box>
);

export const Dashboard = () => {
    const { permissions, isLoading } = usePermissions();
    const redirect = useRedirect();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Redirección automática para usuarios no-admin
    useEffect(() => {
        if (!isLoading && permissions && permissions !== 'admin') {
            console.log(`Redirigiendo usuario ${permissions} desde dashboard`);
            switch (permissions) {
                case 'jefe':
                    redirect('/turno-reports');
                    break;
                case 'operador':
                case 'paramedico':
                    redirect('/my-reports');
                    break;
                default:
                    break;
            }
        }
    }, [permissions, isLoading, redirect]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5002/api/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener estadísticas');
                }

                const data = await response.json();
                setStats(data);
            } catch (err) {
                console.error('Error fetching stats:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        if (permissions === 'admin') {
            fetchStats();
        }
    }, [permissions]);

    if (isLoading || loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (permissions !== "admin") {
        return (
            <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: 1, border: '1px solid #e5e7eb' }}>
                <Typography variant="h6" color="error">
                    Acceso restringido - Solo administradores
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error">
                    Error al cargar estadísticas: {error}
                </Alert>
            </Box>
        );
    }

    if (!stats || stats.totalReportes === 0) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="info">
                    No hay reportes disponibles para generar estadísticas.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{
            p: 3,
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            '& .MuiGrid-item': {
                display: 'flex',
                flexDirection: 'column'
            }
        }}>
            {/* Header minimalista */}
            <Box sx={{
                mb: 3,
                pb: 2,
                borderBottom: '1px solid #e5e7eb'
            }}>
                <Typography variant="h5" sx={{
                    fontWeight: 700,
                    color: '#111827',
                    mb: 0.5,
                    letterSpacing: '-0.025em'
                }}>
                    Dashboard Emergencias
                </Typography>
                <Typography variant="body2" sx={{
                    color: '#6b7280',
                    fontSize: '0.875rem'
                }}>
                    Análisis en tiempo real de reportes y métricas operativas
                </Typography>
            </Box>

            {/* Alerta de casos pendientes */}
            {stats.reportesPendientesCierre > 0 && (
                <Alert
                    severity="warning"
                    icon={<WarningIcon aria-label="Advertencia" />}
                    sx={{
                        mb: 3,
                        borderRadius: 1,
                        border: '1px solid #fbbf24',
                        backgroundColor: '#fffbeb'
                    }}
                    role="alert"
                >
                    <strong>{stats.reportesPendientesCierre} reportes pendientes</strong> - Revisar casos para finalizar
                </Alert>
            )}

            {/* Grid unificado principal */}
            <Grid container spacing={3}>
                {/* Métricas principales */}
                <Grid item xs={12} sm={6} md={3}>
                    <TarjetaMetrica
                        titulo="Total Reportes"
                        valor={stats.totalReportes}
                        subtitulo={`${stats.reportesHoy} hoy`}
                        icono={<PhoneIcon sx={{ fontSize: 20 }} />}
                        color="#dc2626"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TarjetaMetrica
                        titulo="Km Totales"
                        valor={`${stats.kmTotales}`}
                        subtitulo="recorrido ambulancias"
                        icono={<RouteIcon sx={{ fontSize: 20 }} />}
                        color="#10b981"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TarjetaMetrica
                        titulo="Tiempo Atención"
                        valor={`${stats.tiempoPromedioAtencion}m`}
                        subtitulo="promedio en sitio"
                        icono={<AccessTimeIcon sx={{ fontSize: 20 }} />}
                        color="#3b82f6"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TarjetaMetrica
                        titulo="Casos Cerrados"
                        valor={`${stats.indicadoresCalidad.porcentajeCasosCerrados}%`}
                        subtitulo="procesados"
                        icono={<PeopleIcon sx={{ fontSize: 20 }} />}
                        color="#8b5cf6"
                    />
                </Grid>

                {/* Distribuciones */}
                <Grid item xs={12} md={6}>
                    <GraficaCircular
                        datos={stats.distribucionTipo}
                        titulo="Tipos de Emergencia"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <GraficaCircular
                        datos={stats.distribucionGravedad}
                        titulo="Nivel de Gravedad"
                    />
                </Grid>

                {/* Reportes por hora */}
                {stats.reportesPorHora.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <GraficaBarras
                            datos={stats.reportesPorHora}
                            titulo="Reportes por Hora"
                            colorBarra="#3b82f6"
                            maxHeight="400px"
                        />
                    </Grid>
                )}

                {/* Estadísticas específicas */}
                <Grid item xs={12} md={6}>
                    <Box sx={{
                        p: 3,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        height: '100%'
                    }}>
                        <Typography variant="subtitle1" sx={{
                            fontWeight: 700,
                            color: '#111827',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            letterSpacing: '-0.025em'
                        }}>
                            <LocalHospitalIcon sx={{ color: '#dc2626', fontSize: 20 }} aria-label="Hospital" />
                            Emergencias Prehospitalarias
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                Traslados Hospitalarios
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#dc2626' }}>
                                    {stats.estadisticasPrehospitalaria.porcentajeTraslado}%
                                </Typography>
                                <Typography variant="caption">
                                    {stats.estadisticasPrehospitalaria.conTraslado}/{stats.estadisticasPrehospitalaria.total}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={stats.estadisticasPrehospitalaria.porcentajeTraslado}
                                aria-label={`Traslados hospitalarios: ${stats.estadisticasPrehospitalaria.porcentajeTraslado}% (${stats.estadisticasPrehospitalaria.conTraslado} de ${stats.estadisticasPrehospitalaria.total})`}
                                sx={{
                                    height: 3,
                                    borderRadius: 2,
                                    backgroundColor: '#f3f4f6',
                                    '& .MuiLinearProgress-bar': { borderRadius: 2, backgroundColor: '#dc2626' }
                                }}
                            />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                            Hospitales de Destino
                        </Typography>
                        {stats.estadisticasPrehospitalaria.hospitalesDestino.slice(0, 3).map((hospital, index) => (
                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" sx={{ color: '#374151' }}>
                                    {hospital.hospital}
                                </Typography>
                                <Chip label={hospital.traslados} size="small" variant="outlined" />
                            </Box>
                        ))}
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{
                        p: 3,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        height: '100%'
                    }}>
                        <Typography variant="subtitle1" sx={{
                            fontWeight: 700,
                            color: '#111827',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            letterSpacing: '-0.025em'
                        }}>
                            <LocationOnIcon sx={{ color: '#f59e0b', fontSize: 20 }} aria-label="Ubicación" />
                            Emergencias Urbanas
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                Con Evidencias Fotográficas
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#f59e0b' }}>
                                    {stats.estadisticasUrbana.porcentajeEvidencias}%
                                </Typography>
                                <Typography variant="caption">
                                    {stats.estadisticasUrbana.conEvidencias}/{stats.estadisticasUrbana.total}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={stats.estadisticasUrbana.porcentajeEvidencias}
                                aria-label={`Evidencias fotográficas: ${stats.estadisticasUrbana.porcentajeEvidencias}% (${stats.estadisticasUrbana.conEvidencias} de ${stats.estadisticasUrbana.total})`}
                                sx={{
                                    height: 3,
                                    borderRadius: 2,
                                    backgroundColor: '#f3f4f6',
                                    '& .MuiLinearProgress-bar': { borderRadius: 2, backgroundColor: '#f59e0b' }
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                Requieren Nota Informativa
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#3b82f6' }}>
                                    {stats.estadisticasUrbana.porcentajeNota}%
                                </Typography>
                                <Typography variant="caption">
                                    {stats.estadisticasUrbana.requierenNota}/{stats.estadisticasUrbana.total}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={stats.estadisticasUrbana.porcentajeNota}
                                aria-label={`Requieren nota informativa: ${stats.estadisticasUrbana.porcentajeNota}% (${stats.estadisticasUrbana.requierenNota} de ${stats.estadisticasUrbana.total})`}
                                sx={{
                                    height: 3,
                                    borderRadius: 2,
                                    backgroundColor: '#f3f4f6',
                                    '& .MuiLinearProgress-bar': { borderRadius: 2, backgroundColor: '#3b82f6' }
                                }}
                            />
                        </Box>
                    </Box>
                </Grid>

                {/* Estadísticas por ambulancia - tabla simplificada */}
                <Grid item xs={12}>
                    <Box sx={{
                        p: 3,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <Typography variant="subtitle1" sx={{
                            fontWeight: 700,
                            color: '#111827',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            letterSpacing: '-0.025em'
                        }}>
                            <AmbulanceIcon sx={{ color: '#f59e0b', fontSize: 20 }} aria-label="Ambulancia" />
                            Estadísticas por Ambulancia
                        </Typography>
                        <TableContainer>
                            <Table size="small" aria-label="Tabla de estadísticas por ambulancia">
                                <TableHead>
                                    <TableRow sx={{ '& th': { border: 'none', py: 0.5, fontSize: '0.7rem', fontWeight: 600, color: '#6b7280' } }}>
                                        <TableCell>Unidad</TableCell>
                                        <TableCell>Servicios</TableCell>
                                        <TableCell>Km Total</TableCell>
                                        <TableCell>Km Prom</TableCell>
                                        <TableCell>T. Resp</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stats.estadisticasAmbulancia.map((ambulancia) => (
                                        <TableRow key={ambulancia.ambulancia} sx={{ '& td': { border: 'none', py: 0.5 } }}>
                                            <TableCell sx={{ fontWeight: 500, fontSize: '0.75rem' }}>{ambulancia.ambulancia}</TableCell>
                                            <TableCell>
                                                <Chip label={ambulancia.servicios} size="small" variant="outlined" />
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.75rem' }}>{ambulancia.kmTotales}</TableCell>
                                            <TableCell sx={{ fontSize: '0.75rem' }}>{ambulancia.kmPromedio}</TableCell>
                                            <TableCell sx={{ fontSize: '0.75rem' }}>{ambulancia.tiempoPromedioRespuesta}m</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>

                {/* Gráficas adicionales */}
                {stats.estadisticasParametrico.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <GraficaBarras
                            datos={stats.estadisticasParametrico}
                            titulo="Servicios por Paramédico"
                            colorBarra="#10b981"
                        />
                    </Grid>
                )}

                {stats.ubicacionesFrecuentes.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <GraficaBarras
                            datos={stats.ubicacionesFrecuentes}
                            titulo="Zonas de Mayor Actividad"
                            colorBarra="#8b5cf6"
                        />
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};