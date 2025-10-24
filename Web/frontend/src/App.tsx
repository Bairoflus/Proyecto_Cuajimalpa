import { Admin, Resource } from 'react-admin';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { dataProvider } from './dataProvider';
import { ReportList, ReportCreate, ReportEdit, ReportShow } from './reports';
import { MyReportsList, MyReportShow } from './myReports';
import { TurnoReportsList, TurnoReportEdit, TurnoReportShow } from './turnoReports';
import { PersonalList, PersonalTurnoList, PersonalShow, PersonalCreate, PersonalEdit } from './personal';
import { Layout } from './Layout';
import { Dashboard } from './Dashboard';
import { authProvider } from './authProvider';
import { i18nProvider } from './i18nProvider';
import { Login } from './Login';
import { cuajimalpaTheme } from './theme';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';

const AppWithResources = () => {
    const [role, setRole] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    // Leer localStorage en useEffect para evitar problemas de renderizado
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedUsername = localStorage.getItem('username');
        setRole(storedRole);
        setUsername(storedUsername);

        console.log('Usuario actual:', { role: storedRole, username: storedUsername }); // Debug
    }, []);

    return (
        <ThemeProvider theme={cuajimalpaTheme}>
            <CssBaseline />
            <Admin
                key={username || 'no-user'}
                layout={Layout}
                loginPage={Login}
                dataProvider={dataProvider}
                dashboard={Dashboard}
                authProvider={authProvider}
                i18nProvider={i18nProvider}
                theme={cuajimalpaTheme}
            >
            {/* Admin: acceso completo */}
            {role === 'admin' && (
                <>
                    <Resource
                        name="reports"
                        list={ReportList}
                        create={ReportCreate}
                        edit={ReportEdit}
                        show={ReportShow}
                        icon={LocalHospitalIcon}
                        options={{ label: 'Todos los Reportes' }}
                    />
                    <Resource
                        name="personal"
                        list={PersonalList}
                        show={PersonalShow}
                        create={PersonalCreate}
                        edit={PersonalEdit}
                        icon={PeopleIcon}
                        options={{ label: 'Gestión de Personal' }}
                    />
                </>
            )}

            {/* Jefe: reportes de su turno (solo lectura) */}
            {role === 'jefe' && (
                <>
                    <Resource
                        name="turno-reports"
                        list={TurnoReportsList}
                        show={TurnoReportShow}
                        icon={LocalHospitalIcon}
                        options={{ label: 'Reportes del Turno' }}
                    />
                    <Resource
                        name="personal-turno"
                        list={PersonalTurnoList}
                        show={PersonalShow}
                        icon={PeopleIcon}
                        options={{ label: 'Personal del Turno' }}
                    />
                </>
            )}

            {/* Operador/Paramédico: crear reportes y ver solo los suyos */}
            {(role === 'operador' || role === 'paramedico') && (
                <Resource
                    name="my-reports"
                    list={MyReportsList}
                    show={MyReportShow}
                    create={ReportCreate}
                    icon={PersonIcon}
                    options={{ label: 'Mis Reportes' }}
                />
            )}

            {/* Resource por defecto cuando no hay rol (usuario no autenticado) */}
            {!role && (
                <Resource
                    name="reports"
                    list={ReportList}
                    icon={LocalHospitalIcon}
                    options={{ label: 'Reportes' }}
                />
            )}
            </Admin>
        </ThemeProvider>
    );
};

export const App = AppWithResources;