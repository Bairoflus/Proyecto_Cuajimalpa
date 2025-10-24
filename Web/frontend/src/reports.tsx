import {
    List, DataTable, Edit, Create, Show, SimpleShowLayout,
    SimpleForm, TextInput, NumberInput, DateTimeInput, SelectInput,
    BooleanInput, Toolbar, SaveButton, required, minValue, FormDataConsumer,
    TextField, DateField, useDataProvider, ArrayInput, SimpleFormIterator,
    CreateButton, TopToolbar, ExportButton, EditButton, FunctionField, ListButton,
    useGetIdentity, Datagrid, DeleteWithConfirmButton
} from "react-admin";
import { Card, CardContent, Box, Typography, Alert, Chip, Tabs, Tab, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import NotesIcon from '@mui/icons-material/Notes';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import GavelIcon from '@mui/icons-material/Gavel';

const tiposReporte = [
    { id: "prehospitalaria", name: "Emergencia prehospitalaria" },
    { id: "urbana", name: "Emergencia urbana" },
    { id: "otro", name: "Otro" },
];

const gravedades = [
    { id: "baja", name: "Baja" },
    { id: "media", name: "Media" },
    { id: "alta", name: "Alta" },
];

const nivelesConciencia = [
    { id: "alerta", name: "Alerta" },
    { id: "verbal", name: "Verbal" },
    { id: "dolor", name: "Dolor" },
    { id: "inconsciente", name: "Inconsciente" },
];

const incidentesUrbanos = [
    { id: "fuga_agua", name: "Fuga de agua" },
    { id: "fuga_gas", name: "Fuga de gas" },
    { id: "arbol_caido", name: "Árbol caído" },
    { id: "poste_caido", name: "Poste caído" },
    { id: "cable_caido", name: "Cable caído" },
    { id: "incendio", name: "Incendio" },
    { id: "otro", name: "Otro" },
];

const motivosAtencion = [
    { id: "enfermedad", name: "Enfermedad" },
    { id: "traumatismo", name: "Traumatismo" },
    { id: "ginecobstetricia", name: "Ginecobstetricia" },
];

const lugaresOcurrencia = [
    { id: "transporte_publico", name: "Transporte público" },
    { id: "escuela", name: "Escuela" },
    { id: "trabajo", name: "Trabajo" },
    { id: "hogar", name: "Hogar" },
    { id: "recreacion_deporte", name: "Recreación y deporte" },
    { id: "via_publica", name: "Vía pública" },
    { id: "otro", name: "Otro" },
];

const origenProbable = [
    { id: "neurologica", name: "Neurológica" },
    { id: "infecciosa", name: "Infecciosa" },
    { id: "musculo_esqueletico", name: "Músculo-esquelético" },
    { id: "urogenital", name: "Urogenital" },
    { id: "digestiva", name: "Digestiva" },
    { id: "cardiovascular", name: "Cardiovascular" },
    { id: "oncologico", name: "Oncológico" },
    { id: "metabolico", name: "Metabólico" },
    { id: "ginecobstetricia", name: "Ginecobstetricia" },
    { id: "respiratorio", name: "Respiratorio" },
    { id: "cognitivo_emocional", name: "Cognitivo/Emocional" },
    { id: "otro", name: "Otro" },
];

const prioridades = [
    { id: "rojo", name: "Rojo (Crítico)" },
    { id: "amarillo", name: "Amarillo (Urgente)" },
    { id: "verde", name: "Verde (Estable)" },
    { id: "negro", name: "Negro (Fallecido)" },
];

const agentesCausales = [
    { id: "arma", name: "Arma" },
    { id: "juguete", name: "Juguete" },
    { id: "explosion", name: "Explosión" },
    { id: "fuego", name: "Fuego" },
    { id: "animal", name: "Animal" },
    { id: "bicicleta", name: "Bicicleta" },
    { id: "automotor", name: "Automotor" },
    { id: "maquinaria", name: "Maquinaria" },
    { id: "herramienta", name: "Herramienta" },
    { id: "electricidad", name: "Electricidad" },
    { id: "sustancia_caliente", name: "Sustancia caliente" },
    { id: "sustancia_toxica", name: "Sustancia tóxica" },
    { id: "producto_biologico", name: "Producto biológico" },
    { id: "ser_humano", name: "Ser humano" },
    { id: "otro", name: "Otro" },
];

const condicionesPaciente = [
    { id: "critico", name: "Crítico" },
    { id: "no_critico", name: "No crítico" },
    { id: "estable", name: "Estable" },
    { id: "inestable", name: "Inestable" },
];

const validaPositivo = [required(), minValue(0)];

// Componente personalizado para seleccionar paramédico
const ParamedicoSelect = ({ source, label, validate }: any) => {
    const [personnel, setPersonnel] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem('role');
    const fullName = localStorage.getItem('fullName') || '';

    useEffect(() => {
        const fetchPersonnel = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5002/api/auth/personnel', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPersonnel(data.personnel);
                } else {
                    // Si hay error, usar el nombre del usuario actual
                    setPersonnel([{ id: fullName, name: fullName }]);
                }
            } catch (error) {
                console.error('Error fetching personnel:', error);
                // Fallback al nombre del usuario actual
                setPersonnel([{ id: fullName, name: fullName }]);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonnel();
    }, [fullName]);

    // Si es paramédico u operador, solo puede verse a sí mismo
    if (role === 'paramedico' || role === 'operador') {
        return (
            <FormDataConsumer>
                {({ formData, ...rest }) => {
                    // Set the value directly in formData if it's empty
                    if (!formData[source]) {
                        formData[source] = fullName;
                    }
                    return (
                        <TextInput
                            source={source}
                            label={label}
                            validate={validate}
                            disabled
                            fullWidth
                            defaultValue={fullName}
                            helperText={`Asignado automáticamente: ${fullName}`}
                            {...rest}
                        />
                    );
                }}
            </FormDataConsumer>
        );
    }

    // Para admin y jefe, mostrar selector
    const choices = personnel.map(p => ({
        id: p.name,
        name: `${p.name} (${p.role === 'paramedico' ? 'Paramédico' : 'Operador'} - Turno ${p.turno})`
    }));

    if (loading) {
        return <TextInput source={source} label={label} disabled />;
    }

    return (
        <SelectInput
            source={source}
            label={label}
            choices={choices}
            validate={validate}
            optionText="name"
            optionValue="id"
        />
    );
};

const OnlyAdminNote = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") return null;
    return (
        <Alert
            severity="info"
            icon={<InfoIcon aria-label="Información" />}
            sx={{
                mb: 3,
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: 3
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Nota: El <strong>folio</strong> se genera automáticamente al crear el reporte.
            </Typography>
        </Alert>
    );
};

// Componente TabPanel para mostrar contenido de cada pestaña
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`report-tabpanel-${index}`}
            aria-labelledby={`report-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

const CustomToolbar = () => (
    <Box sx={{
        borderTop: '1px solid #e5e7eb',
        mt: 4,
        pt: 3,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2
    }}>
        <SaveButton
            alwaysEnable
            sx={{
                backgroundColor: '#1663afff',
                color: '#fff !important',
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                '&:hover': {
                    backgroundColor: '#1455a6'
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

const ListActions = () => (
    <TopToolbar>
        <ExportButton
            sx={{
                backgroundColor: '#10b981',
                color: '#fff',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                mr: 2,
                '&:hover': {
                    backgroundColor: '#059669'
                }
            }}
        />
        <CreateButton
            sx={{
                backgroundColor: '#1663afff',
                color: '#fff',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                    backgroundColor: '#1455a6'
                }
            }}
        />
    </TopToolbar>
);

export const ReportList = () => (
    <Box sx={{
        p: { xs: 1, sm: 2 },
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box'
    }}>
        <Box sx={{ mb: 3 }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    color: '#1e293b',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
            >
                <LocalHospitalIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#1663afff' }} aria-label="Emergencias médicas" />
                Todos los Reportes de Emergencia
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: '#64748b',
                    fontSize: { xs: '0.9rem', sm: '1.1rem' }
                }}
            >
                Gestión completa de reportes de emergencias médicas
            </Typography>
        </Box>

        <List title="" actions={<ListActions />}>
            <Datagrid
                rowClick="show"
                sx={{
                    '& .MuiTableContainer-root': {
                        borderRadius: 4,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        border: '1px solid #e2e8f0'
                    }
                }}
            >
                <TextField source="id" label="ID" />
                <TextField source="folio" label="Folio" />
                <FunctionField source="tipo" label="Tipo" render={(record: any) => <TipoField record={record} />} />
                <TextField source="fechaHoraLlamada" label="Llamada" />
                <FunctionField
                    source="ubicacion"
                    label="Ubicación"
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
                <FunctionField source="gravedad" label="Gravedad" render={(record: any) => <GravedadField record={record} />} />
                <TextField source="ambulancia" label="Ambulancia" />
                <TextField source="paramedico" label="Paramédico" />

                <EditButton />
                <DeleteWithConfirmButton mutationMode="pessimistic" />
            </Datagrid>
        </List>
    </Box>
);

export const ReportCreate = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Create>
            <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
                <Box sx={{
                    p: 4,
                    backgroundColor: '#fff',
                    borderRadius: 3,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LocalHospitalIcon sx={{ fontSize: 32, color: '#1663afff' }} aria-label="Crear emergencia" />
                            Crear Reporte de Emergencia Médica
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
                            Complete los campos según el tipo de emergencia
                        </Typography>
                    </Box>

                    <SimpleForm toolbar={false}>
                    <OnlyAdminNote />

                    {/* Checkboxes al principio para determinar el tipo de registro */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                        <BooleanInput source="esFalsaAlarma" label="Falsa alarma (solo nota)" />
                        <BooleanInput source="privadaLlegoAntes" label="Llegó privada antes (solo nota)" />
                    </Box>

            <FormDataConsumer>
                {({ formData, ...rest }) => {
                    const esFalsaAlarma = formData?.esFalsaAlarma;
                    const privadaLlegoAntes = formData?.privadaLlegoAntes;
                    const esCasoEspecial = esFalsaAlarma || privadaLlegoAntes;

                    if (esCasoEspecial) {
                        // Formulario simplificado para casos especiales
                        return (
                            <>
                                <Alert severity="warning" sx={{ mb: 3 }}>
                                    Este reporte solo generará una nota informativa. Complete los campos básicos.
                                </Alert>

                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                    <DateTimeInput source="fechaHoraLlamada" label="Fecha/hora de la llamada" validate={required()} />
                                    <TextInput source="ubicacion" label="Ubicación" validate={required()} />
                                </Box>

                                {esFalsaAlarma && (
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 3 }}>
                                        <TextInput
                                            source="motivoFalsaAlarma"
                                            label="Motivo de la falsa alarma"
                                            multiline
                                            rows={3}
                                            fullWidth
                                            validate={required()}
                                            helperText="Describa por qué se determinó que es una falsa alarma"
                                        />
                                    </Box>
                                )}

                                {privadaLlegoAntes && (
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 3 }}>
                                        <TextInput
                                            source="motivoPrivada"
                                            label="Información del servicio privado"
                                            multiline
                                            rows={3}
                                            fullWidth
                                            validate={required()}
                                            helperText="Describa qué servicio privado llegó y detalles relevantes"
                                        />
                                    </Box>
                                )}

                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 3 }}>
                                    <TextInput
                                        source="notaIncidente"
                                        label="Nota del incidente"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        validate={required()}
                                        helperText="Describa brevemente lo ocurrido"
                                    />
                                </Box>

                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                    <ParamedicoSelect source="paramedico" label="Responsable del reporte" validate={required()} />
                                    <TextInput source="ambulancia" label="Unidad/Ambulancia" validate={required()} />
                                </Box>
                            </>
                        );
                    }

                    // Formulario completo normal
                    return (
                        <>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                <SelectInput source="tipo" label="Tipo de reporte" choices={tiposReporte} validate={required()} />
                                <SelectInput source="gravedad" label="Gravedad" choices={gravedades} validate={required()} />
                            </Box>

                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, mt: 3 }}>
                                I. Cronometría
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                <DateTimeInput source="fechaHoraLlamada" label="Fecha/hora de la llamada" validate={required()} />
                                <DateTimeInput source="horaTraslado" label="Hora traslado" />
                                <DateTimeInput source="horaSalida" label="Hora salida" />
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                <DateTimeInput source="horaHospital" label="Hora hospital" />
                                <DateTimeInput source="fechaHoraArribo" label="Hora llegada al sitio" />
                                <DateTimeInput source="salidaHospital" label="Salida hospital" />
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                <DateTimeInput source="fechaHoraCierre" label="Fecha/hora de cierre" />
                                <SelectInput source="motivoAtencion" label="Motivo de atención" choices={motivosAtencion} validate={required()} />
                            </Box>

                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, mt: 3 }}>
                                Datos Generales
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                <TextInput source="motivoLlamada" label="Motivo de llamada" fullWidth validate={required()} />
                                <TextInput source="incidenteCodigo" label="Incidente código" />
                            </Box>

                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, mt: 3 }}>
                                Ubicación del Servicio
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                <TextInput source="ubicacion.calle" label="Calle" fullWidth validate={required()} />
                                <TextInput source="ubicacion.entre" label="Entre calles" fullWidth />
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                <TextInput source="ubicacion.colonia" label="Colonia/Comunidad" fullWidth />
                                <TextInput source="delegacion" label="Alcaldía" fullWidth />
                                <SelectInput source="lugarOcurrencia" label="Lugar de ocurrencia" choices={lugaresOcurrencia} />
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                <TextInput source="ambulancia" label="Unidad/Ambulancia" validate={required()} />
                                <TextInput source="entidadUnidad" label="Entidad a la que pertenece la unidad" />
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                <ParamedicoSelect source="paramedico" label="Paramédico a cargo" validate={required()} />
                                <NumberInput source="kilometros" label="Km recorridos" defaultValue={0} validate={validaPositivo} />
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                <NumberInput source="tiempoAtencionMin" label="Tiempo de atención en sitio (min)" defaultValue={0} validate={validaPositivo} />
                                <NumberInput source="tiempoTrasladoMin" label="Tiempo de traslado (min)" defaultValue={0} validate={validaPositivo} />
                            </Box>

                            {formData.tipo === "prehospitalaria" && (
                                <>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, mt: 3 }}>
                                        III. Información del Paciente
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <TextInput source="paciente.nombre" label="Nombre del paciente" {...rest} />
                                        <NumberInput source="paciente.edad" label="Edad (años)" {...rest} validate={minValue(0)} />
                                        <NumberInput source="paciente.edadMeses" label="Edad (meses)" {...rest} validate={minValue(0)} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <TextInput source="paciente.sexo" label="Sexo (M/F)" {...rest} />
                                        <TextInput source="paciente.telefono" label="Teléfono" {...rest} />
                                        <TextInput source="paciente.ocupacion" label="Ocupación" {...rest} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <TextInput source="paciente.domicilio" label="Domicilio" fullWidth {...rest} />
                                        <TextInput source="paciente.colonia" label="Colonia/Comunidad" {...rest} />
                                        <TextInput source="paciente.alcaldia" label="Alcaldía/Municipio" {...rest} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 3 }}>
                                        <TextInput source="paciente.derechohabiente" label="Derechohabiente a" {...rest} />
                                    </Box>

                                    {formData.motivoAtencion === "ginecobstetricia" && (
                                        <>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PregnantWomanIcon sx={{ color: '#1663afff' }} aria-label="Parto" /> IV. Parto
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                                Datos de la madre
                                            </Typography>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                                <NumberInput source="parto.semanasGesta" label="Semanas de gesta" {...rest} validate={minValue(0)} />
                                                <DateTimeInput source="parto.horaInicioContracciones" label="Hora inicio de contracciones" {...rest} />
                                                <TextInput source="parto.frecuencia" label="Frecuencia" {...rest} />
                                            </Box>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 3 }}>
                                                <TextInput source="parto.duracion" label="Duración" {...rest} />
                                            </Box>

                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                                Datos postparto y recién nacido
                                            </Typography>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                                <DateTimeInput source="parto.horaNacimiento" label="Hora de nacimiento" {...rest} />
                                                <BooleanInput source="parto.placentaExpulsada" label="Placenta expulsada" {...rest} />
                                                <TextInput source="parto.lugar" label="Lugar" {...rest} />
                                            </Box>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                                <SelectInput source="parto.productoEstado" label="Producto" choices={[{id: "vivo", name: "Vivo"}, {id: "muerto", name: "Muerto"}]} {...rest} />
                                                <SelectInput source="parto.sexoProducto" label="Sexo" choices={[{id: "M", name: "Masculino"}, {id: "F", name: "Femenino"}]} {...rest} />
                                                <NumberInput source="parto.edadGestacional" label="Edad gestacional" {...rest} />
                                            </Box>

                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                                Puntaje de APGAR
                                            </Typography>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, mb: 3 }}>
                                                <NumberInput source="parto.apgar.color1" label="Color 1 min" {...rest} validate={minValue(0)} />
                                                <NumberInput source="parto.apgar.color5" label="Color 5 min" {...rest} validate={minValue(0)} />
                                                <NumberInput source="parto.apgar.color10" label="Color 10 min" {...rest} />
                                                <NumberInput source="parto.apgar.color15" label="Color 15 min" {...rest} />
                                                <NumberInput source="parto.apgar.color20" label="Color 20 min" {...rest} />
                                            </Box>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, mb: 3 }}>
                                                <NumberInput source="parto.apgar.fc1" label="FC 1 min" {...rest} />
                                                <NumberInput source="parto.apgar.fc5" label="FC 5 min" {...rest} />
                                                <NumberInput source="parto.apgar.fc10" label="FC 10 min" {...rest} />
                                                <NumberInput source="parto.apgar.fc15" label="FC 15 min" {...rest} />
                                                <NumberInput source="parto.apgar.fc20" label="FC 20 min" {...rest} />
                                            </Box>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, mb: 3 }}>
                                                <NumberInput source="parto.apgar.mueca1" label="Mueca 1 min" {...rest} />
                                                <NumberInput source="parto.apgar.mueca5" label="Mueca 5 min" {...rest} />
                                                <NumberInput source="parto.apgar.mueca10" label="Mueca 10 min" {...rest} />
                                                <NumberInput source="parto.apgar.mueca15" label="Mueca 15 min" {...rest} />
                                                <NumberInput source="parto.apgar.mueca20" label="Mueca 20 min" {...rest} />
                                            </Box>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, mb: 3 }}>
                                                <NumberInput source="parto.apgar.tonoMuscular1" label="Tono 1 min" {...rest} />
                                                <NumberInput source="parto.apgar.tonoMuscular5" label="Tono 5 min" {...rest} />
                                                <NumberInput source="parto.apgar.tonoMuscular10" label="Tono 10 min" {...rest} />
                                                <NumberInput source="parto.apgar.tonoMuscular15" label="Tono 15 min" {...rest} />
                                                <NumberInput source="parto.apgar.tonoMuscular20" label="Tono 20 min" {...rest} />
                                            </Box>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, mb: 3 }}>
                                                <NumberInput source="parto.apgar.respiracion1" label="Resp 1 min" {...rest} />
                                                <NumberInput source="parto.apgar.respiracion5" label="Resp 5 min" {...rest} />
                                                <NumberInput source="parto.apgar.respiracion10" label="Resp 10 min" {...rest} />
                                                <NumberInput source="parto.apgar.respiracion15" label="Resp 15 min" {...rest} />
                                                <NumberInput source="parto.apgar.respiracion20" label="Resp 20 min" {...rest} />
                                            </Box>
                                        </>
                                    )}

                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, mt: 3 }}>
                                        Evaluación Médica
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 3 }}>
                                        <TextInput source="diagnostico" label="Diagnóstico médico/Lesión" fullWidth {...rest} />
                                    </Box>

                                    {formData.motivoAtencion === "traumatismo" && (
                                        <>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <HealthAndSafetyIcon sx={{ color: '#1663afff' }} aria-label="Trauma" /> V. Causa Traumática
                                            </Typography>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                                <SelectInput source="causaTraumatica.agenteCausal" label="Agente causal" choices={agentesCausales} {...rest} />
                                                <TextInput source="causaTraumatica.especificar" label="Especificar (si es otro)" {...rest} />
                                            </Box>

                                            <BooleanInput source="causaTraumatica.esAccidenteAutomobilistico" label="¿Es accidente automovilístico?" {...rest} />

                                            {formData?.causaTraumatica?.esAccidenteAutomobilistico && (
                                                <>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2, mt: 2 }}>
                                                        Detalles del accidente automovilístico
                                                    </Typography>
                                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                                        <SelectInput source="causaTraumatica.tipoImpacto" label="Tipo de impacto" choices={[
                                                            {id: "posterior", name: "Posterior"},
                                                            {id: "lateral", name: "Lateral"},
                                                            {id: "frontal", name: "Frontal"},
                                                            {id: "rotacional", name: "Rotacional"},
                                                            {id: "volcadura", name: "Volcadura"}
                                                        ]} {...rest} />
                                                        <SelectInput source="causaTraumatica.parabrisas" label="Parabrisas" choices={[
                                                            {id: "integro", name: "Íntegro"},
                                                            {id: "estrellado", name: "Estrellado"}
                                                        ]} {...rest} />
                                                    </Box>
                                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                                        <SelectInput source="causaTraumatica.volante" label="Volante" choices={[
                                                            {id: "integro", name: "Íntegro"},
                                                            {id: "doblado", name: "Doblado"}
                                                        ]} {...rest} />
                                                        <SelectInput source="causaTraumatica.bolsaAire" label="Bolsa de aire" choices={[
                                                            {id: "si", name: "Sí"},
                                                            {id: "no", name: "No"}
                                                        ]} {...rest} />
                                                        <SelectInput source="causaTraumatica.cinturonSeguridad" label="Cinturón de seguridad" choices={[
                                                            {id: "colocado", name: "Colocado"},
                                                            {id: "no_colocado", name: "No colocado"}
                                                        ]} {...rest} />
                                                    </Box>
                                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                                        <SelectInput source="causaTraumatica.dentroVehiculo" label="Dentro de vehículo" choices={[
                                                            {id: "si", name: "Sí"},
                                                            {id: "no", name: "No"},
                                                            {id: "eyectado", name: "Eyectado"}
                                                        ]} {...rest} />
                                                    </Box>
                                                </>
                                            )}

                                            <BooleanInput source="causaTraumatica.esAtropellado" label="¿Es atropellado?" {...rest} />
                                            {formData?.causaTraumatica?.esAtropellado && (
                                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                                    <SelectInput source="causaTraumatica.tipoAtropellado" label="Atropellado por" choices={[
                                                        {id: "automotor", name: "Automotor"},
                                                        {id: "motocicleta", name: "Motocicleta"},
                                                        {id: "bicicleta", name: "Bicicleta"},
                                                        {id: "maquinaria", name: "Maquinaria"}
                                                    ]} {...rest} />
                                                </Box>
                                            )}
                                        </>
                                    )}

                                    {formData.motivoAtencion === "enfermedad" && (
                                        <>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, mt: 3 }}>
                                                VI. Causa Clínica
                                            </Typography>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                                <SelectInput source="causaClinica.origenProbable" label="Origen probable" choices={origenProbable} {...rest} />
                                                <SelectInput source="causaClinica.frecuencia" label="Frecuencia" choices={[
                                                    {id: "primera_vez", name: "1ª vez"},
                                                    {id: "subsecuente", name: "Subsecuente"}
                                                ]} {...rest} />
                                            </Box>
                                        </>
                                    )}

                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <MonitorHeartIcon sx={{ color: '#1663afff' }} aria-label="Evaluación inicial" /> VII. Evaluación Inicial
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                        <SelectInput source="nivelConciencia" label="Nivel de conciencia" choices={nivelesConciencia} {...rest} />
                                        <SelectInput source="evaluacionInicial.deglucion" label="Deglución" choices={[
                                            {id: "ausente", name: "Ausente"},
                                            {id: "presente", name: "Presente"}
                                        ]} {...rest} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                        <SelectInput source="evaluacionInicial.viaAerea" label="Vía aérea" choices={[
                                            {id: "permeable", name: "Permeable"},
                                            {id: "comprometida", name: "Comprometida"}
                                        ]} {...rest} />
                                        <SelectInput source="evaluacionInicial.ventilacion" label="Ventilación" choices={[
                                            {id: "automatismo_regular", name: "Automatismo regular"},
                                            {id: "automatismo_rapido", name: "Automatismo rápido"},
                                            {id: "automatismo_irregular", name: "Automatismo irregular"},
                                            {id: "automatismo_superficial", name: "Automatismo superficial"},
                                            {id: "apnea", name: "Apnea"}
                                        ]} {...rest} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <SelectInput source="evaluacionInicial.auscultacion" label="Auscultación" choices={[
                                            {id: "ruidos_normales", name: "Ruidos respiratorios normales"},
                                            {id: "ruidos_disminuidos", name: "Ruidos disminuidos"},
                                            {id: "ruidos_ausentes", name: "Ruidos ausentes"}
                                        ]} {...rest} />
                                        <SelectInput source="evaluacionInicial.hemitorax" label="Hemitórax" choices={[
                                            {id: "derecho", name: "Derecho"},
                                            {id: "izquierdo", name: "Izquierdo"}
                                        ]} {...rest} />
                                        <SelectInput source="evaluacionInicial.sitio" label="Sitio" choices={[
                                            {id: "apical", name: "Apical"},
                                            {id: "base", name: "Base"}
                                        ]} {...rest} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                        <SelectInput source="evaluacionInicial.presenciaPulsos" label="Presencia de pulsos" choices={[
                                            {id: "carotideo", name: "Carotídeo"},
                                            {id: "radial", name: "Radial"},
                                            {id: "paro_cardiorespiratorio", name: "Paro cardiorespiratorio"}
                                        ]} {...rest} />
                                        <SelectInput source="evaluacionInicial.calidadPulso" label="Calidad del pulso" choices={[
                                            {id: "rapido", name: "Rápido"},
                                            {id: "lento", name: "Lento"},
                                            {id: "ritmico", name: "Rítmico"},
                                            {id: "arritmico", name: "Arrítmico"}
                                        ]} {...rest} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                        <SelectInput source="evaluacionInicial.piel" label="Piel" choices={[
                                            {id: "normal", name: "Normal"},
                                            {id: "palida", name: "Pálida"},
                                            {id: "cianotia", name: "Cianótia"}
                                        ]} {...rest} />
                                        <SelectInput source="evaluacionInicial.caracteristicasPiel" label="Características" choices={[
                                            {id: "caliente", name: "Caliente"},
                                            {id: "fria", name: "Fría"},
                                            {id: "diaforesis", name: "Diaforesis"},
                                            {id: "normotermico", name: "Normotérmico"}
                                        ]} {...rest} />
                                    </Box>

                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                        Signos Vitales
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <TextInput source="signosVitales.ta" label="TA (mmHg)" placeholder="120/80" {...rest} />
                                        <NumberInput source="signosVitales.fc" label="FC (lpm)" {...rest} validate={minValue(0)} />
                                        <NumberInput source="signosVitales.fr" label="FR (rpm)" {...rest} validate={minValue(0)} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <NumberInput source="signosVitales.temp" label="Temperatura (°C)" step={0.1} {...rest} validate={minValue(0)} />
                                        <NumberInput source="signosVitales.spo2" label="SpO2 (%)" {...rest} validate={minValue(0)} />
                                        <NumberInput source="signosVitales.glucosa" label="Glucosa (mg/dL)" {...rest} validate={minValue(0)} />
                                    </Box>

                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AssessmentIcon sx={{ color: '#1663afff' }} aria-label="Evaluación secundaria" /> VIII. Evaluación Secundaria
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                        Exploración física
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 3 }}>
                                        <TextInput source="evaluacionSecundaria.exploracionFisica" label="Hallazgos de exploración física" fullWidth multiline rows={3} {...rest} />
                                        <TextInput source="evaluacionSecundaria.pupilas" label="Pupilas (derecha / izquierda)" {...rest} />
                                    </Box>

                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                        Monitoreo de signos vitales (3 tomas)
                                    </Typography>
                                    <ArrayInput source="evaluacionSecundaria.monitores" label="">
                                        <SimpleFormIterator>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 2 }}>
                                                <DateTimeInput source="hora" label="Hora" />
                                                <NumberInput source="fr" label="FR" validate={minValue(0)} />
                                                <NumberInput source="fc" label="FC" validate={minValue(0)} />
                                                <TextInput source="tas" label="TAS" />
                                            </Box>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 2 }}>
                                                <TextInput source="tad" label="TAD" />
                                                <NumberInput source="sao2" label="SaO2 %" validate={minValue(0)} />
                                                <NumberInput source="temp" label="Temp °C" step={0.1} validate={minValue(0)} />
                                                <NumberInput source="gluc" label="Glucosa" validate={minValue(0)} />
                                            </Box>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 2 }}>
                                                <SelectInput source="neuroTest" label="Neuro Test" choices={nivelesConciencia} />
                                            </Box>
                                        </SimpleFormIterator>
                                    </ArrayInput>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                        <NumberInput source="evaluacionSecundaria.glasgowTotal" label="Glasgow total" {...rest} validate={minValue(3)} helperText="Puntuación de 3-15" />
                                    </Box>

                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                        Historial médico (SAMPLE)
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 3 }}>
                                        <TextInput source="evaluacionSecundaria.alergias" label="Alergias" fullWidth {...rest} />
                                        <TextInput source="evaluacionSecundaria.medicamentosIngesta" label="Medicamentos en ingesta" fullWidth {...rest} />
                                        <TextInput source="evaluacionSecundaria.padecimientosCirugias" label="Padecimientos y cirugías" fullWidth {...rest} />
                                        <TextInput source="evaluacionSecundaria.ultimaComida" label="Última comida" {...rest} />
                                        <TextInput source="evaluacionSecundaria.eventosPrevios" label="Eventos previos" fullWidth {...rest} />
                                    </Box>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                        <SelectInput source="evaluacionSecundaria.condicionPaciente" label="Condición de paciente" choices={condicionesPaciente} {...rest} />
                                        <SelectInput source="evaluacionSecundaria.prioridad" label="Prioridad" choices={prioridades} {...rest} />
                                    </Box>

                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, mt: 3 }}>
                                        Tratamiento
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 3 }}>
                                        <TextInput source="insumos" label="Insumos suministrados (lista)" fullWidth {...rest} />
                                        <TextInput source="insumosCantidades" label="Cantidades (ej. 'Vendaje=2, SSN=1')" fullWidth {...rest} />
                                    </Box>

                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <VaccinesIcon sx={{ color: '#1663afff' }} aria-label="Tratamiento" /> X. Tratamiento Médico Detallado
                                    </Typography>

                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                        Vía aérea
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <BooleanInput source="tratamiento.viaAerea.aspiracion" label="Aspiración" {...rest} />
                                        <BooleanInput source="tratamiento.viaAerea.canulaOrofaringea" label="Cánula orofaringea" {...rest} />
                                        <BooleanInput source="tratamiento.viaAerea.canulaNasofaringea" label="Cánula nasofaríngea" {...rest} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <BooleanInput source="tratamiento.viaAerea.intubacionOrotraqueal" label="Intubación orotraqueal" {...rest} />
                                        <BooleanInput source="tratamiento.viaAerea.combitubo" label="Combitubo" {...rest} />
                                        <BooleanInput source="tratamiento.viaAerea.mascarillaLaringea" label="Mascarilla laríngea" {...rest} />
                                    </Box>

                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                        Control cervical
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <BooleanInput source="tratamiento.controlCervical.manual" label="Manual" {...rest} />
                                        <BooleanInput source="tratamiento.controlCervical.collarinRigido" label="Collarín rígido" {...rest} />
                                        <BooleanInput source="tratamiento.controlCervical.collarinBlando" label="Collarín blando" {...rest} />
                                    </Box>

                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                        Asistencia ventilatoria
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <BooleanInput source="tratamiento.asistenciaVentilatoria.balon" label="Balón" {...rest} />
                                        <BooleanInput source="tratamiento.asistenciaVentilatoria.puntasNasales" label="Puntas nasales" {...rest} />
                                        <BooleanInput source="tratamiento.asistenciaVentilatoria.mascarillaSimple" label="Mascarilla simple" {...rest} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <BooleanInput source="tratamiento.asistenciaVentilatoria.mascarillaReservorio" label="Mascarilla con reservorio" {...rest} />
                                        <BooleanInput source="tratamiento.asistenciaVentilatoria.ventiladorAutomatico" label="Ventilador automático" {...rest} />
                                        <NumberInput source="tratamiento.asistenciaVentilatoria.litrosMin" label="Litros por minuto" {...rest} validate={minValue(0)} />
                                    </Box>

                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                        Medicamentos administrados
                                    </Typography>
                                    <ArrayInput source="tratamiento.medicamentos" label="">
                                        <SimpleFormIterator>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 2 }}>
                                                <DateTimeInput source="hora" label="Hora" />
                                                <TextInput source="medicamento" label="Medicamento" />
                                                <TextInput source="dosis" label="Dosis" />
                                                <TextInput source="viaAdministracion" label="Vía" />
                                            </Box>
                                        </SimpleFormIterator>
                                    </ArrayInput>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 3 }}>
                                        <TextInput source="tratamiento.drTratante" label="Dr. Tratante" {...rest} />
                                    </Box>

                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                        Control de hemorragias
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <BooleanInput source="tratamiento.controlHemorragias.presionDirecta" label="Presión directa" {...rest} />
                                        <BooleanInput source="tratamiento.controlHemorragias.presionIndirecta" label="Presión indirecta" {...rest} />
                                        <BooleanInput source="tratamiento.controlHemorragias.vendajeCompresivo" label="Vendaje compresivo" {...rest} />
                                    </Box>

                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                        Vías venosas
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <TextInput source="tratamiento.viasVenosas.hartmann" label="Hartmann (ml)" {...rest} />
                                        <TextInput source="tratamiento.viasVenosas.nacl" label="NaCl (ml)" {...rest} />
                                        <TextInput source="tratamiento.viasVenosas.glucosa" label="Glucosa (ml)" {...rest} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <TextInput source="tratamiento.viasVenosas.lineaIV" label="Línea IV #" {...rest} />
                                        <TextInput source="tratamiento.viasVenosas.cateter" label="Catéter #" {...rest} />
                                        <TextInput source="tratamiento.viasVenosas.cantidad" label="Cantidad total" {...rest} />
                                    </Box>

                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                        Atención básica
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <BooleanInput source="tratamiento.atencionBasica.rcpBasica" label="RCP Básica" {...rest} />
                                        <BooleanInput source="tratamiento.atencionBasica.rcpAvanzada" label="RCP Avanzada" {...rest} />
                                        <BooleanInput source="tratamiento.atencionBasica.curacion" label="Curación" {...rest} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                        <BooleanInput source="tratamiento.atencionBasica.inmovilizacionExtremidades" label="Inmovilización extremidades" {...rest} />
                                        <BooleanInput source="tratamiento.atencionBasica.empaquetamiento" label="Empaquetamiento" {...rest} />
                                        <BooleanInput source="tratamiento.atencionBasica.vendaje" label="Vendaje" {...rest} />
                                    </Box>

                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, mt: 3 }}>
                                        IX. Traslado
                                    </Typography>
                                    <BooleanInput source="traslado.huboTraslado" label="¿Hubo traslado al hospital?" />
                                    {formData?.traslado?.huboTraslado && (
                                        <>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                                <TextInput source="traslado.hospital" label="Hospital de destino" {...rest} />
                                                <TextInput source="traslado.quienRecibe" label="Dr./Persona que recibe" {...rest} />
                                                <TextInput source="traslado.folioCRU" label="Folio CRU" {...rest} />
                                            </Box>
                                        </>
                                    )}
                                    <BooleanInput source="traslado.seNego" label="¿Se negó al traslado?" {...rest} />
                                </>
                            )}

                            {formData.tipo === "urbana" && (
                                <>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, mt: 3 }}>
                                        Detalles de Emergencia Urbana
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                        <SelectInput source="incidenteUrbano" label="Tipo de incidente urbano" choices={incidentesUrbanos} {...rest} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 3 }}>
                                        <TextInput source="descripcionEvento" label="Descripción del evento" fullWidth multiline rows={3} {...rest} />
                                        <TextInput source="accionesRealizadas" label="Acciones realizadas" fullWidth multiline rows={3} {...rest} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                        <BooleanInput source="notaInformativa" label="¿Requiere nota informativa al municipio?" {...rest} />
                                        <BooleanInput source="evidenciasFotograficas" label="¿Hay evidencias fotográficas?" {...rest} />
                                    </Box>
                                </>
                            )}

                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <GavelIcon sx={{ color: '#1663afff' }} aria-label="Datos legales" /> XI. Observaciones y Datos Legales
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 3 }}>
                                <TextInput source="observaciones" label="Observaciones generales" multiline rows={4} fullWidth />
                                <TextInput source="pertenencias" label="Pertenencias del paciente" multiline rows={2} fullWidth />
                            </Box>

                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                Ministerio Público
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                                <BooleanInput source="ministerioPublico.notificado" label="¿Ministerio público notificado?" />
                            </Box>
                            {formData.ministerioPublico?.notificado && (
                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 3 }}>
                                    <TextInput source="ministerioPublico.responsableNombre" label="Nombre del responsable" fullWidth />
                                </Box>
                            )}

                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                Autoridades que tomaron conocimiento
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                                <TextInput source="autoridadesConocimiento.dependencia" label="Dependencia" />
                                <TextInput source="autoridadesConocimiento.numeroUnidad" label="Número de unidad" />
                                <NumberInput source="autoridadesConocimiento.numeroOficiales" label="Número de oficiales" validate={minValue(0)} />
                            </Box>

                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                Vehículos involucrados
                            </Typography>
                            <ArrayInput source="vehiculosInvolucrados" label="">
                                <SimpleFormIterator>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
                                        <TextInput source="tipoMarca" label="Tipo y marca" />
                                        <TextInput source="placas" label="Placas" />
                                    </Box>
                                </SimpleFormIterator>
                            </ArrayInput>
                        </>
                    );
                }}
            </FormDataConsumer>

            <CustomToolbar />
        </SimpleForm>
                </Box>
            </Box>
        </Create>
    );
};

const EditToolbar = () => (
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
        <SaveButton
            alwaysEnable
            sx={{
                backgroundColor: '#1663afff',
                color: '#fff !important',
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                '&:hover': {
                    backgroundColor: '#1455a6'
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

export const ReportEdit = () => (
    <Edit actions={false}>
        <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{
                p: 4,
                backgroundColor: '#fff',
                borderRadius: 3,
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                position: 'relative'
            }}>
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
                        <LocalHospitalIcon sx={{ fontSize: 32, color: '#1663afff' }} aria-label="Editar emergencia" />
                        Editar Reporte de Emergencia
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#64748b',
                            fontSize: '1.1rem'
                        }}
                    >
                        Modificar información del reporte de emergencia médica
                    </Typography>
                </Box>

                <SimpleForm toolbar={false}>
                <OnlyAdminNote />
                <EditToolbar />

                {/* Información Básica */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon sx={{ color: '#1663afff' }} aria-label="Información básica" /> Información Básica
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
                    <SelectInput source="tipo" label="Tipo de reporte" choices={tiposReporte} validate={required()} />
                    <SelectInput source="gravedad" label="Gravedad" choices={gravedades} validate={required()} />
                </Box>

                {/* Fechas y Horarios */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon sx={{ color: '#1663afff' }} aria-label="Horarios" /> Fechas y Horarios
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
                    <DateTimeInput source="fechaHoraLlamada" label="Fecha/hora de la llamada" validate={required()} />
                    <DateTimeInput source="fechaHoraArribo" label="Fecha/hora de arribo" />
                    <DateTimeInput source="fechaHoraCierre" label="Fecha/hora de cierre (si aplica)" />
                </Box>

                {/* Datos Generales del Incidente */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon sx={{ color: '#1663afff' }} /> Datos Generales del Incidente
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
                    <TextInput source="motivoLlamada" label="Motivo de llamada" fullWidth validate={required()} />
                    <TextInput source="incidenteCodigo" label="Incidente código" />
                </Box>

                {/* Ubicación del Servicio */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon sx={{ color: '#1663afff' }} aria-label="Ubicación" /> Ubicación del Servicio
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
                    <TextInput source="ubicacion" label="Ubicación del servicio" fullWidth validate={required()} />
                    <TextInput source="lugarOcurrencia" label="Lugar de ocurrencia" fullWidth />
                    <TextInput source="delegacion" label="Delegación/Alcaldía" fullWidth />
                </Box>

                {/* Recursos y Personal */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: '#1663afff' }} aria-label="Personal" /> Recursos y Personal
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
                    <TextInput source="ambulancia" label="Unidad/Ambulancia" validate={required()} />
                    <TextInput source="entidadUnidad" label="Entidad a la que pertenece la unidad" />
                    <ParamedicoSelect source="paramedico" label="Paramédico a cargo" validate={required()} />
                    <NumberInput source="kilometros" label="Km recorridos" defaultValue={0} validate={validaPositivo} />
                </Box>

                {/* Métricas de Tiempo */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon sx={{ color: '#1663afff' }} /> Métricas de Tiempo
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
                    <NumberInput source="tiempoAtencionMin" label="Tiempo de atención en sitio (min)" defaultValue={0} validate={validaPositivo} />
                    <NumberInput source="tiempoTrasladoMin" label="Tiempo de traslado (min)" defaultValue={0} validate={validaPositivo} />
                </Box>

                {/* Detalles Específicos */}
                <FormDataConsumer>
                    {({ formData, ...rest }) => (
                        <>
                            {(formData.tipo === "prehospitalaria" || formData.tipo === "urbana") && (
                                <>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <MedicalServicesIcon sx={{ color: '#1663afff' }} aria-label="Detalles médicos" /> Detalles Específicos
                                    </Typography>

                                        {formData.tipo === "prehospitalaria" && (
                                            <>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                                    Información del Paciente
                                                </Typography>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
                                                    <TextInput source="paciente.nombre" label="Nombre del paciente" {...rest} />
                                                    <NumberInput source="paciente.edad" label="Edad" {...rest} validate={minValue(0)} />
                                                    <TextInput source="paciente.sexo" label="Sexo (M/F/X)" {...rest} />
                                                </Box>

                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                                    Evaluación Médica
                                                </Typography>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3, mb: 3 }}>
                                                    <TextInput source="diagnostico" label="Diagnóstico médico/Lesión" fullWidth {...rest} />
                                                    <TextInput source="agenteCausal" label="Agente causal" fullWidth {...rest} />
                                                </Box>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
                                                    <SelectInput source="nivelConciencia" label="Nivel de conciencia" choices={nivelesConciencia} {...rest} />
                                                </Box>

                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                                    Signos Vitales
                                                </Typography>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 3 }}>
                                                    <TextInput source="signosVitales.ta" label="TA (mmHg)" placeholder="120/80" {...rest} />
                                                    <NumberInput source="signosVitales.fc" label="FC (lpm)" {...rest} validate={minValue(0)} />
                                                    <NumberInput source="signosVitales.fr" label="FR (rpm)" {...rest} validate={minValue(0)} />
                                                </Box>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
                                                    <NumberInput source="signosVitales.temp" label="Temperatura (°C)" step={0.1} {...rest} validate={minValue(0)} />
                                                    <NumberInput source="signosVitales.spo2" label="SpO2 (%)" {...rest} validate={minValue(0)} />
                                                    <NumberInput source="signosVitales.glucosa" label="Glucosa (mg/dL)" {...rest} validate={minValue(0)} />
                                                </Box>

                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                                    Tratamiento
                                                </Typography>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3, mb: 3 }}>
                                                    <TextInput source="insumos" label="Insumos suministrados" fullWidth {...rest} />
                                                    <TextInput source="insumosCantidades" label="Cantidades utilizadas" fullWidth {...rest} />
                                                </Box>

                                                <Box sx={{ mb: 3 }}>
                                                    <BooleanInput source="traslado.huboTraslado" label="¿Hubo traslado al hospital?" />
                                                </Box>

                                                {formData?.traslado?.huboTraslado && (
                                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                                                        <TextInput source="traslado.hospital" label="Hospital de destino" {...rest} />
                                                        <TextInput source="traslado.quienRecibe" label="Persona que recibe" {...rest} />
                                                    </Box>
                                                )}
                                            </>
                                        )}

                                        {formData.tipo === "urbana" && (
                                            <>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                                                    Detalles de Emergencia Urbana
                                                </Typography>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
                                                    <SelectInput source="incidenteUrbano" label="Tipo de incidente urbano" choices={incidentesUrbanos} {...rest} />
                                                </Box>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3, mb: 3 }}>
                                                    <TextInput source="descripcionEvento" label="Descripción del evento" fullWidth multiline rows={3} {...rest} />
                                                    <TextInput source="accionesRealizadas" label="Acciones realizadas" fullWidth multiline rows={3} {...rest} />
                                                </Box>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                                                    <BooleanInput source="notaInformativa" label="¿Requiere nota informativa al municipio?" {...rest} />
                                                    <BooleanInput source="evidenciasFotograficas" label="¿Hay evidencias fotográficas?" {...rest} />
                                                </Box>
                                            </>
                                        )}
                                </>
                            )}
                        </>
                    )}
                </FormDataConsumer>

                {/* Observaciones y Control */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotesIcon sx={{ color: '#1663afff' }} aria-label="Observaciones" /> Observaciones y Control
                </Typography>
                <Box sx={{ mb: 4 }}>
                    <TextInput source="observaciones" label="Observaciones generales" multiline rows={4} fullWidth />
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                        Identificación del Reporte
                    </Typography>
                    <TextInput
                        source="folio"
                        label="Folio"
                        disabled
                        helperText="Folio generado automáticamente - No editable"
                        fullWidth
                    />
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                    Estado del Caso
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
                    <BooleanInput source="esFalsaAlarma" label="Falsa alarma" />
                    <BooleanInput source="privadaLlegoAntes" label="Servicio privado llegó antes" />
                </Box>

                <FormDataConsumer>
                    {({ formData }) => {
                        const esFalsaAlarma = formData?.esFalsaAlarma;
                        const privadaLlegoAntes = formData?.privadaLlegoAntes;
                        const esCasoEspecial = esFalsaAlarma || privadaLlegoAntes;

                        if (!esCasoEspecial) return null;

                        return (
                            <>
                                <Alert severity="info" sx={{ mb: 3, mt: 3 }}>
                                    Este reporte está marcado como caso especial. Complete los campos adicionales.
                                </Alert>

                                {esFalsaAlarma && (
                                    <Box sx={{ mb: 3 }}>
                                        <TextInput
                                            source="motivoFalsaAlarma"
                                            label="Motivo de la falsa alarma"
                                            multiline
                                            rows={3}
                                            fullWidth
                                            helperText="Describa por qué se determinó que es una falsa alarma"
                                        />
                                    </Box>
                                )}

                                {privadaLlegoAntes && (
                                    <Box sx={{ mb: 3 }}>
                                        <TextInput
                                            source="motivoPrivada"
                                            label="Información del servicio privado"
                                            multiline
                                            rows={3}
                                            fullWidth
                                            helperText="Describa qué servicio privado llegó y detalles relevantes"
                                        />
                                    </Box>
                                )}

                                <Box sx={{ mb: 3 }}>
                                    <TextInput
                                        source="notaIncidente"
                                        label="Nota del incidente"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        helperText="Describa brevemente lo ocurrido"
                                    />
                                </Box>
                                    </>
                                );
                            }}
                        </FormDataConsumer>

            </SimpleForm>
                </Box>
            </Box>
        </Edit>
    );

const ShowToolbar = () => {
    const { data: identity } = useGetIdentity();
    const isAdmin = identity?.role === 'admin';

    return (
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
            {isAdmin && (
                <EditButton
                    sx={{
                        backgroundColor: '#1663afff',
                        color: '#fff !important',
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        '&:hover': {
                            backgroundColor: '#1455a6'
                        },
                        '& .MuiButton-startIcon': {
                            color: '#fff !important'
                        },
                        '& .MuiSvgIcon-root': {
                            color: '#fff !important'
                        }
                    }}
                />
            )}
        </Box>
    );
};

export const ReportShow = () => (
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
                        <LocalHospitalIcon sx={{ fontSize: 32, color: '#1663afff' }} aria-label="Detalles de emergencia" />
                        Detalles del Reporte de Emergencia
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
                        Vista completa del reporte médico
                    </Typography>
                </Box>

                <SimpleShowLayout>
                    {/* Información Básica del Reporte */}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoIcon sx={{ color: '#1663afff' }} aria-label="Información básica" /> Información Básica del Reporte
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
                        <LocationOnIcon sx={{ color: '#1663afff' }} aria-label="Ubicación" /> Ubicación del Servicio
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
                        <PersonIcon sx={{ color: '#1663afff' }} aria-label="Personal" /> Recursos y Personal
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
                        <AssessmentIcon sx={{ color: '#1663afff' }} aria-label="Métricas" /> Métricas del Servicio
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

                    {/* Información del Paciente */}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MedicalServicesIcon sx={{ color: '#1663afff' }} aria-label="Información del paciente" /> Información del Paciente
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Nombre del paciente
                            </Typography>
                            <FunctionField render={(record: any) => record?.paciente?.nombre || record?.pacienteNombre || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Edad (años)
                            </Typography>
                            <FunctionField render={(record: any) => record?.paciente?.edad || record?.pacienteEdad || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Edad (meses)
                            </Typography>
                            <FunctionField render={(record: any) => record?.paciente?.edadMeses || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Sexo
                            </Typography>
                            <FunctionField render={(record: any) => record?.paciente?.sexo || record?.pacienteSexo || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Teléfono de contacto
                            </Typography>
                            <FunctionField render={(record: any) => record?.paciente?.telefono || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Ocupación
                            </Typography>
                            <FunctionField render={(record: any) => record?.paciente?.ocupacion || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Domicilio del paciente
                            </Typography>
                            <FunctionField render={(record: any) => record?.paciente?.domicilio || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Colonia del paciente
                            </Typography>
                            <FunctionField render={(record: any) => record?.paciente?.colonia || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Alcaldía del paciente
                            </Typography>
                            <FunctionField render={(record: any) => record?.paciente?.alcaldia || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Derechohabiente de
                            </Typography>
                            <FunctionField render={(record: any) => record?.paciente?.derechohabiente || 'No Registrado'} />
                        </Box>
                    </Box>

                    {/* Evaluación Médica */}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MonitorHeartIcon sx={{ color: '#1663afff' }} aria-label="Evaluación médica" /> Evaluación Médica
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Diagnóstico médico/Lesión
                            </Typography>
                            <FunctionField render={(record: any) => record?.diagnostico || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Nivel de conciencia
                            </Typography>
                            <FunctionField render={(record: any) => record?.nivelConciencia || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Agente causal
                            </Typography>
                            <FunctionField render={(record: any) => record?.agenteCausal || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Tensión arterial
                            </Typography>
                            <FunctionField render={(record: any) => record?.signosVitales?.ta || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Frecuencia cardíaca
                            </Typography>
                            <FunctionField render={(record: any) => record?.signosVitales?.fc || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Frecuencia respiratoria
                            </Typography>
                            <FunctionField render={(record: any) => record?.signosVitales?.fr || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Temperatura corporal
                            </Typography>
                            <FunctionField render={(record: any) => record?.signosVitales?.temp || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Saturación de oxígeno
                            </Typography>
                            <FunctionField render={(record: any) => record?.signosVitales?.spo2 || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Nivel de glucosa
                            </Typography>
                            <FunctionField render={(record: any) => record?.signosVitales?.glucosa || 'No Registrado'} />
                        </Box>
                    </Box>

                    {/* Tratamiento e Insumos */}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VaccinesIcon sx={{ color: '#1663afff' }} aria-label="Tratamiento e insumos" /> Tratamiento e Insumos
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3, mb: 4 }}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Insumos suministrados
                            </Typography>
                            <FunctionField render={(record: any) => record?.insumos || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Cantidades utilizadas
                            </Typography>
                            <FunctionField render={(record: any) => record?.insumosCantidades || 'No Registrado'} />
                        </Box>
                    </Box>

                    {/* Información de Traslado */}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalHospitalIcon sx={{ color: '#1663afff' }} aria-label="Traslado" /> Información de Traslado
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                ¿Hubo traslado?
                            </Typography>
                            <FunctionField render={(record: any) => record?.traslado?.huboTraslado || record?.hayTraslado ? 'Sí' : 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Hospital de destino
                            </Typography>
                            <FunctionField render={(record: any) => record?.traslado?.hospital || record?.hospital || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Persona que recibe
                            </Typography>
                            <FunctionField render={(record: any) => record?.traslado?.quienRecibe || record?.quienRecibe || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Folio CRU
                            </Typography>
                            <FunctionField render={(record: any) => record?.traslado?.folioCRU || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                ¿Se negó al traslado?
                            </Typography>
                            <FunctionField render={(record: any) => record?.traslado?.seNego ? 'Sí' : 'No Registrado'} />
                        </Box>
                    </Box>

                    {/* Casos Especiales */}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GavelIcon sx={{ color: '#1663afff' }} aria-label="Casos especiales" /> Casos Especiales
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                ¿Es falsa alarma?
                            </Typography>
                            <FunctionField render={(record: any) => record?.esFalsaAlarma ? 'Sí' : 'No'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                ¿Llegó servicio privado antes?
                            </Typography>
                            <FunctionField render={(record: any) => record?.privadaLlegoAntes || record?.esPrivada ? 'Sí' : 'No'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Motivo de falsa alarma
                            </Typography>
                            <FunctionField render={(record: any) => record?.motivoFalsaAlarma || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Información del servicio privado
                            </Typography>
                            <FunctionField render={(record: any) => record?.motivoPrivada || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Nota del incidente
                            </Typography>
                            <FunctionField render={(record: any) => record?.notaIncidente || 'No Registrado'} />
                        </Box>
                    </Box>

                    {/* Información de Emergencia Urbana */}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HealthAndSafetyIcon sx={{ color: '#1663afff' }} aria-label="Emergencia urbana" /> Información de Emergencia Urbana
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Tipo de incidente urbano
                            </Typography>
                            <FunctionField render={(record: any) => record?.incidenteUrbano || 'No Registrado'} />
                        </Box>
                        <Box sx={{ gridColumn: '1 / -1' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Descripción del evento
                            </Typography>
                            <FunctionField render={(record: any) => record?.descripcionEvento || 'No Registrado'} />
                        </Box>
                        <Box sx={{ gridColumn: '1 / -1' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                Acciones realizadas
                            </Typography>
                            <FunctionField render={(record: any) => record?.accionesRealizadas || 'No Registrado'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                ¿Requiere nota informativa?
                            </Typography>
                            <FunctionField render={(record: any) => record?.notaInformativa ? 'Sí' : 'No'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                ¿Hay evidencias fotográficas?
                            </Typography>
                            <FunctionField render={(record: any) => record?.evidenciasFotograficas ? 'Sí' : 'No'} />
                        </Box>
                    </Box>

                    {/* Observaciones y Control */}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotesIcon sx={{ color: '#1663afff' }} aria-label="Observaciones" /> Observaciones y Control
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
                                ¿Caso aprobado?
                            </Typography>
                            <FunctionField render={(record: any) => record?.casoAprobado ? 'Sí' : 'No'} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                ¿Requiere revisión?
                            </Typography>
                            <FunctionField render={(record: any) => record?.requiereRevision ? 'Sí' : 'No'} />
                        </Box>
                    </Box>
                </SimpleShowLayout>
            </Box>
        </Box>
    </Show>
);  