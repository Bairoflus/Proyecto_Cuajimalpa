import type { ReactNode } from "react";
import { Layout as RALayout, CheckForApplicationUpdate, AppBar as RAAppBar, Menu as RAMenu, MenuItemLink, DashboardMenuItem, useGetIdentity, UserMenu, MenuItemLink as RAMenuItemLink, Logout } from "react-admin";
import { Avatar, Typography, Box, Divider, Chip, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getTurnoDisplayForRole, canCreateReports, isUserInTurno } from './utils/turnoUtils';

const CustomUserMenu = () => {
    const { data: identity } = useGetIdentity();
    const turnoDisplay = identity ? getTurnoDisplayForRole(identity.role, identity.turno) : '';
    const isOutOfTurno = turnoDisplay === 'FUERA DE TURNO';

    return (
        <UserMenu
            label={identity?.fullName || 'Usuario'}
            icon={
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: identity?.role === 'admin' ? '#10b981' : isOutOfTurno ? '#ef4444' : '#3b82f6',
                        fontSize: '0.875rem',
                        fontWeight: 600
                    }}
                    aria-label={`Menú de usuario: ${identity?.fullName || 'Usuario'}`}
                >
                    {identity?.fullName?.charAt(0).toUpperCase()}
                </Avatar>
            }
        >
            <Logout />
        </UserMenu>
    );
};

const CustomAppBar = () => {
    const theme = useTheme();
    const { data: identity } = useGetIdentity();

    const turnoDisplay = identity ? getTurnoDisplayForRole(identity.role, identity.turno) : '';
    const isInTurno = identity ? isUserInTurno(identity.turno) : false;
    const isOutOfTurno = turnoDisplay === 'FUERA DE TURNO';

    return (
        <RAAppBar
            userMenu={<CustomUserMenu />}
            sx={{
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
        >
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-between',
                px: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                    <Avatar
                        src="https://cuajimalpa.gob.mx/wp-content/uploads/2025/01/cropped-icono.png"
                        alt="Logo Cuajimalpa"
                        sx={{
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 },
                            bgcolor: 'transparent',
                        }}
                    />
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#1e293b',
                                fontWeight: 700,
                                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                                lineHeight: 1.2
                            }}
                        >
                            Alcaldía Cuajimalpa
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#64748b',
                                fontSize: { xs: '0.65rem', sm: '0.75rem' }
                            }}
                        >
                            Sistema de Emergencias Médicas
                        </Typography>
                    </Box>
                </Box>

                {identity && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                        <Box sx={{
                            textAlign: 'right',
                            display: { xs: 'none', sm: 'block' }
                        }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#1e293b',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                }}
                            >
                                {identity.fullName}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 0.5 }}>
                                {identity.role === 'admin' ? (
                                    <Chip
                                        label="ADMINISTRADOR GENERAL"
                                        size="small"
                                        color="success"
                                        aria-label="Rol: Administrador General"
                                        sx={{
                                            fontSize: { xs: '0.55rem', sm: '0.6rem' },
                                            height: { xs: 18, sm: 20 },
                                            fontWeight: 'bold'
                                        }}
                                    />
                                ) : (
                                    <>
                                        <Chip
                                            label={identity.role}
                                            size="small"
                                            color="primary"
                                            aria-label={`Rol: ${identity.role}`}
                                            sx={{
                                                fontSize: { xs: '0.55rem', sm: '0.6rem' },
                                                height: { xs: 18, sm: 20 },
                                                textTransform: 'capitalize'
                                            }}
                                        />
                                        <Chip
                                            label={turnoDisplay}
                                            size="small"
                                            color={isOutOfTurno ? "error" : "secondary"}
                                            aria-label={`Turno: ${turnoDisplay}`}
                                            sx={{
                                                fontSize: { xs: '0.55rem', sm: '0.6rem' },
                                                height: { xs: 18, sm: 20 },
                                                fontWeight: isOutOfTurno ? 'bold' : 'normal'
                                            }}
                                        />
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>
        </RAAppBar>
    );
};

const CustomMenu = () => {
    const role = localStorage.getItem('role');

    return (
        <RAMenu
            sx={{
                '& .MuiPaper-root': {
                    backgroundColor: '#ffffff',
                    borderRight: '1px solid #e2e8f0',
                }
            }}
        >

            {role === 'admin' && (
                <>
                    <DashboardMenuItem primaryText="Dashboard" leftIcon={<DashboardIcon aria-label="Dashboard" />} />
                    <MenuItemLink
                        to="/reports"
                        primaryText="Todos los Reportes"
                        leftIcon={<LocalHospitalIcon aria-label="Reportes médicos" />}
                    />
                    <MenuItemLink
                        to="/personal"
                        primaryText="Gestión de Personal"
                        leftIcon={<PeopleIcon aria-label="Personal" />}
                    />
                </>
            )}

            {role === 'jefe' && (
                <>
                    <MenuItemLink
                        to="/turno-reports"
                        primaryText="Reportes del Turno"
                        leftIcon={<LocalHospitalIcon aria-label="Reportes del turno" />}
                    />
                    <MenuItemLink
                        to="/personal-turno"
                        primaryText="Personal del Turno"
                        leftIcon={<PeopleIcon aria-label="Personal del turno" />}
                    />
                </>
            )}

            {(role === 'operador' || role === 'paramedico') && (
                <MenuItemLink
                    to="/my-reports"
                    primaryText="Mis Reportes"
                    leftIcon={<PersonIcon aria-label="Mis reportes" />}
                />
            )}

            <Divider sx={{ my: 2, mx: 2 }} />

            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography
                    variant="caption"
                    sx={{
                        color: '#94a3b8',
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        display: 'block',
                        textAlign: 'center',
                        lineHeight: 1.2
                    }}
                >
                    © 2025 Alcaldía Cuajimalpa
                </Typography>
            </Box>
        </RAMenu>
    );
};

export const Layout = ({ children }: { children: ReactNode }) => (
    <RALayout
        appBar={CustomAppBar}
        menu={CustomMenu}
        sx={{
            '& .RaLayout-content': {
                backgroundColor: '#f8fafc',
                minHeight: '100vh',
                width: '100%',
                maxWidth: '100%',
                overflow: 'auto',
                padding: 0,
                margin: 0,
                boxSizing: 'border-box',
            },
            '& .RaLayout-appFrame': {
                width: '100%',
                minHeight: '100vh',
                display: 'flex',
            },
            '& .MuiContainer-root': {
                maxWidth: '100% !important',
                width: '100%',
                padding: '0 !important',
                margin: '0 !important',
            },
            '& .MuiTableContainer-root': {
                width: '100%',
                maxWidth: '100%',
                overflow: 'auto',
            },
            '& .MuiDataGrid-root': {
                width: '100%',
                maxWidth: '100%',
            },
            width: '100%',
            minHeight: '100vh',
        }}
    >
        {children}
        <CheckForApplicationUpdate />
    </RALayout>
);
