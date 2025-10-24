// personal.tsx - Gestión de personal para Admin y Jefes
import {
    List,
    Datagrid,
    TextField,
    EmailField,
    DateField,
    Show,
    SimpleShowLayout,
    Edit,
    Create,
    SimpleForm,
    TextInput,
    SelectInput,
    required,
    useRecordContext,
    EditButton,
    DeleteWithConfirmButton,
    SaveButton,
    FilterButton,
    SearchInput,
    CreateButton,
    TopToolbar,
    FunctionField,
    ExportButton
} from "react-admin";
import { Chip, Box, Typography } from "@mui/material";
// import { CustomFormCard, FormSection, FormRow } from './components/CustomForm';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import WorkIcon from '@mui/icons-material/Work';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import SecurityIcon from '@mui/icons-material/Security';

// Choices para los formularios
const rolesChoices = [
    { id: "jefe", name: "Jefe de Turno" },
    { id: "operador", name: "Operador" },
    { id: "paramedico", name: "Paramédico" },
];

const turnosChoices = [
    { id: "1", name: "1er Turno - L-V | 08:00-15:00" },
    { id: "2", name: "2do Turno - L-V | 15:00-21:00" },
    { id: "3", name: "3er Turno - L,Mi,V | 21:00-08:00" },
    { id: "4", name: "4to Turno - Ma,Ju,Do | 21:00-08:00" },
    { id: "5", name: "5to Turno - S,D,Festivos | 08:00-20:00" },
    { id: "6", name: "6to Turno - S,D,Festivos | 20:00-08:00" },
];

// Toolbar personalizada para incluir botones dentro de la tarjeta
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

// Componente para mostrar el rol con colores
const RoleField = () => {
    const record = useRecordContext();

    if (!record) return null;

    const colorMap: Record<string, "primary" | "secondary" | "success"> = {
        jefe: "primary",
        operador: "secondary",
        paramedico: "success",
    };

    const labelMap: Record<string, string> = {
        jefe: "Jefe",
        operador: "Operador",
        paramedico: "Paramédico",
    };

    return (
        <Chip
            label={labelMap[record.role] || record.role}
            color={colorMap[record.role] || "default"}
            size="small"
            aria-label={`Rol: ${labelMap[record.role] || record.role}`}
        />
    );
};

// Opciones de rol con "Todos"
const rolesChoicesWithAll = [
    { id: "", name: "Todos los roles" },
    ...rolesChoices
];

// Opciones de turno con "Todos"
const turnosChoicesWithAll = [
    { id: "", name: "Todos los turnos" },
    ...turnosChoices
];

// Acciones de lista (botón crear y exportar)
const ListActions = () => (
    <TopToolbar>
        <FilterButton />
        <ExportButton
            sx={{
                backgroundColor: '#059669',
                color: '#fff',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                    backgroundColor: '#047857'
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

// Filtros para la lista de personal (solo Rol y Turno)
const personalFilters = [
    <SelectInput
        source="role"
        label="Filtrar por Rol"
        choices={rolesChoicesWithAll}
        alwaysOn
        emptyText="Todos los roles"
        emptyValue=""
        sx={{
            '& .MuiInputBase-root': {
                borderRadius: 2,
                backgroundColor: '#fff'
            }
        }}
    />,
    <SelectInput
        source="turno"
        label="Filtrar por Turno"
        choices={turnosChoicesWithAll}
        alwaysOn
        emptyText="Todos los turnos"
        emptyValue=""
        sx={{
            '& .MuiInputBase-root': {
                borderRadius: 2,
                backgroundColor: '#fff'
            }
        }}
    />,
];

// Lista de personal para ADMIN (ve todo el personal)
export const PersonalList = () => {
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
                    <PeopleIcon sx={{ fontSize: 32, color: '#1663afff' }} aria-label="Personal" />
                    Gestión de Personal
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: '#64748b',
                        fontSize: '1.1rem'
                    }}
                >
                    Administración completa del personal del sistema
                </Typography>
            </Box>

            <List
                title=""
                filters={personalFilters}
                actions={<ListActions />}
            >
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
                    <TextField source="username" label="Usuario" />
                    <TextField source="nombreCompleto" label="Nombre Completo" />
                    <FunctionField source="role" label="Rol" render={(record: any) => <RoleField />} />
                    <TextField source="turno" label="Turno" />
                    <DateField source="createdAt" label="Fecha de Creación" showTime />
                    <DateField source="updatedAt" label="Última Actualización" showTime />

                    <EditButton />
                    <DeleteWithConfirmButton mutationMode="pessimistic" />
                </Datagrid>
            </List>
        </Box>
    );
};

// Lista de personal para JEFE (solo ve su turno)
export const PersonalTurnoList = () => {
    const turno = localStorage.getItem("turno");

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
                    <PeopleIcon sx={{ fontSize: 32, color: '#1663afff' }} aria-label="Personal del turno" />
                    Personal del Turno {turno}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: '#64748b',
                        fontSize: '1.1rem'
                    }}
                >
                    Personal asignado a su turno
                </Typography>
            </Box>

            <List
                filter={{ turno: turno }}
                title=""
                filters={[
                    <SelectInput
                        source="role"
                        label="Filtrar por Rol"
                        choices={[
                            { id: "", name: "Todos los roles" },
                            { id: "operador", name: "Operador" },
                            { id: "paramedico", name: "Paramédico" }
                        ]}
                        alwaysOn
                        emptyText="Todos los roles"
                        emptyValue=""
                        sx={{
                            '& .MuiInputBase-root': {
                                borderRadius: 2,
                                backgroundColor: '#fff'
                            }
                        }}
                    />
                ]}
                actions={<FilterButton />}
            >
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
                    <TextField source="username" label="Usuario" />
                    <TextField source="nombreCompleto" label="Nombre Completo" />
                    <FunctionField source="role" label="Rol" render={(record: any) => <RoleField />} />
                    <DateField source="createdAt" label="Fecha de Creación" showTime />
                    <DateField source="updatedAt" label="Última Actualización" showTime />
                </Datagrid>
            </List>
        </Box>
    );
};

// Vista detallada de personal
export const PersonalShow = () => (
    <Show>
        <Box sx={{
            p: 3,
            backgroundColor: '#f8fafc',
            minHeight: '100vh'
        }}>
            <Box sx={{
                mb: 3,
                pb: 2,
                borderBottom: '1px solid #e5e7eb'
            }}>
                <Typography variant="h5" sx={{
                    fontWeight: 700,
                    color: '#111827',
                    mb: 0.5,
                    letterSpacing: '-0.025em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <PersonIcon sx={{ fontSize: 24, color: '#1663afff' }} aria-label="Detalles del personal" />
                    Detalles del Personal
                </Typography>
                <Typography variant="body2" sx={{
                    color: '#6b7280',
                    fontSize: '0.875rem'
                }}>
                    Información completa del miembro del personal
                </Typography>
            </Box>

            <Box sx={{
                maxWidth: 800,
                mx: 'auto',
                p: 4,
                backgroundColor: '#fff',
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
                <Typography variant="h6" sx={{
                    fontWeight: 700,
                    color: '#111827',
                    mb: 4,
                    letterSpacing: '-0.025em'
                }}>
                    Información del Personal
                </Typography>

                <SimpleShowLayout>
                    <TextField source="username" label="Usuario" />
                    <TextField source="nombreCompleto" label="Nombre Completo" />
                    <TextField source="role" label="Rol" />
                    <TextField source="turno" label="Turno" />
                    <TextField source="createdAt" label="Fecha de Creación" />
                    <TextField source="updatedAt" label="Última Actualización" />
                    <TextField source="id" label="ID de Usuario" />
                </SimpleShowLayout>
            </Box>
        </Box>
    </Show>
);

// Crear personal (solo admin)
export const PersonalCreate = () => (
    <Create>
        <Box sx={{
            p: 3,
            backgroundColor: '#f8fafc',
            minHeight: '100vh'
        }}>
            <Box sx={{
                mb: 3,
                pb: 2,
                borderBottom: '1px solid #e5e7eb'
            }}>
                <Typography variant="h5" sx={{
                    fontWeight: 700,
                    color: '#111827',
                    mb: 0.5,
                    letterSpacing: '-0.025em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <PersonIcon sx={{ fontSize: 24, color: '#1663afff' }} aria-label="Crear personal" />
                    Crear Nuevo Personal
                </Typography>
                <Typography variant="body2" sx={{
                    color: '#6b7280',
                    fontSize: '0.875rem'
                }}>
                    Registro de nuevo miembro del personal
                </Typography>
            </Box>

            <Box sx={{
                maxWidth: 800,
                mx: 'auto'
            }}>
                <SimpleForm toolbar={false}>
                    <Box sx={{
                        p: 4,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 700,
                            color: '#111827',
                            mb: 4,
                            letterSpacing: '-0.025em'
                        }}>
                            Información del Personal
                        </Typography>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                            gap: 3,
                            mb: 4
                        }}>
                            <TextInput
                                source="username"
                                label="Usuario"
                                validate={required()}
                                helperText="Nombre de usuario para iniciar sesión"
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: 1.5
                                    }
                                }}
                            />
                            <TextInput
                                source="password"
                                label="Contraseña"
                                type="password"
                                validate={required()}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: 1.5
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: 3,
                            mb: 4
                        }}>
                            <TextInput
                                source="nombreCompleto"
                                label="Nombre Completo"
                                validate={required()}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: 1.5
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                            gap: 3,
                            mb: 4
                        }}>
                            <SelectInput
                                source="role"
                                label="Rol"
                                choices={rolesChoices}
                                validate={required()}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: 1.5
                                    }
                                }}
                            />
                            <SelectInput
                                source="turno"
                                label="Turno"
                                choices={turnosChoices}
                                validate={required()}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: 1.5
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: 3
                        }}>
                            <Typography variant="body2" sx={{
                                color: '#6b7280',
                                fontStyle: 'italic'
                            }}>
                                Las fechas de creación y actualización se generan automáticamente
                            </Typography>
                        </Box>

                        <CustomToolbar />
                    </Box>
                </SimpleForm>
            </Box>
        </Box>
    </Create>
);

// Editar personal (solo admin)
export const PersonalEdit = () => (
    <Edit>
        <Box sx={{
            p: 3,
            backgroundColor: '#f8fafc',
            minHeight: '100vh'
        }}>
            <Box sx={{
                mb: 3,
                pb: 2,
                borderBottom: '1px solid #e5e7eb'
            }}>
                <Typography variant="h5" sx={{
                    fontWeight: 700,
                    color: '#111827',
                    mb: 0.5,
                    letterSpacing: '-0.025em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <PersonIcon sx={{ fontSize: 24, color: '#1663afff' }} aria-label="Editar personal" />
                    Editar Personal
                </Typography>
                <Typography variant="body2" sx={{
                    color: '#6b7280',
                    fontSize: '0.875rem'
                }}>
                    Modificar información del miembro del personal
                </Typography>
            </Box>

            <Box sx={{
                maxWidth: 800,
                mx: 'auto'
            }}>
                <SimpleForm toolbar={false}>
                    <Box sx={{
                        p: 4,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 700,
                            color: '#111827',
                            mb: 4,
                            letterSpacing: '-0.025em'
                        }}>
                            Información del Personal
                        </Typography>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                            gap: 3,
                            mb: 4
                        }}>
                            <TextInput
                                source="username"
                                label="Usuario"
                                disabled
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: 1.5
                                    }
                                }}
                            />
                            <TextInput
                                source="password"
                                label="Nueva Contraseña (opcional)"
                                type="password"
                                helperText="Dejar vacío para mantener la actual"
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: 1.5
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: 3,
                            mb: 4
                        }}>
                            <TextInput
                                source="nombreCompleto"
                                label="Nombre Completo"
                                validate={required()}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: 1.5
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                            gap: 3,
                            mb: 4
                        }}>
                            <SelectInput
                                source="role"
                                label="Rol"
                                choices={rolesChoices}
                                validate={required()}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: 1.5
                                    }
                                }}
                            />
                            <SelectInput
                                source="turno"
                                label="Turno"
                                choices={turnosChoices}
                                validate={required()}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: 1.5
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                            gap: 3
                        }}>
                            <TextInput source="createdAt" label="Fecha de Creación" disabled />
                            <TextInput source="updatedAt" label="Última Actualización" disabled />
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: 3
                        }}>
                            <Typography variant="body2" sx={{
                                color: '#6b7280',
                                fontStyle: 'italic'
                            }}>
                                Las fechas se actualizan automáticamente
                            </Typography>
                        </Box>

                        <CustomToolbar />
                    </Box>
                </SimpleForm>
            </Box>
        </Box>
    </Edit>
);