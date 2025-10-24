import { createTheme } from '@mui/material/styles';

const BRAND = '#1663afff';

export const cuajimalpaTheme = createTheme({
    palette: {
        primary: {
            main: BRAND,
            light: '#3b82f6',
            dark: '#003D7A',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#64748b',
            light: '#94a3b8',
            dark: '#475569',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
        },
        error: {
            main: '#ef4444',
        },
        warning: {
            main: '#f59e0b',
        },
        success: {
            main: '#10b981',
        },
        info: {
            main: '#3b82f6',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            color: '#1e293b',
        },
        h2: {
            fontWeight: 700,
            color: '#1e293b',
        },
        h3: {
            fontWeight: 700,
            color: '#1e293b',
        },
        h4: {
            fontWeight: 700,
            color: '#1e293b',
        },
        h5: {
            fontWeight: 700,
            color: '#1e293b',
        },
        h6: {
            fontWeight: 600,
            color: '#1e293b',
        },
        subtitle1: {
            fontWeight: 600,
            color: '#475569',
        },
        subtitle2: {
            fontWeight: 600,
            color: '#475569',
        },
        body1: {
            color: '#1e293b',
        },
        body2: {
            color: '#64748b',
        },
        caption: {
            color: '#94a3b8',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    border: '1px solid #e2e8f0',
                    '&:hover': {
                        boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 16px rgba(22,99,175,0.25)',
                    },
                },
                contained: {
                    background: `linear-gradient(135deg, ${BRAND} 0%, #003D7A 100%)`,
                    '&:hover': {
                        background: `linear-gradient(135deg, #003D7A 0%, #002855 100%)`,
                        transform: 'translateY(-1px)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                },
                outlined: {
                    borderColor: '#e2e8f0',
                    borderWidth: 2,
                    '&:hover': {
                        borderColor: BRAND,
                        backgroundColor: '#f8fafc',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        '& fieldset': {
                            borderColor: '#e2e8f0',
                            borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                            borderColor: BRAND,
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                            '& fieldset': {
                                borderColor: BRAND,
                                borderWidth: '2px',
                            },
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: '#1e293b',
                        fontSize: '1rem',
                        '&::placeholder': {
                            color: '#94a3b8',
                            opacity: 1,
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        '&.Mui-focused': {
                            color: BRAND,
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e2e8f0',
                        borderWidth: '2px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: BRAND,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: BRAND,
                        borderWidth: '2px',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                },
                colorPrimary: {
                    backgroundColor: BRAND,
                    color: '#ffffff',
                },
                colorSecondary: {
                    backgroundColor: '#64748b',
                    color: '#ffffff',
                },
                colorSuccess: {
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                },
                colorWarning: {
                    backgroundColor: '#f59e0b',
                    color: '#ffffff',
                },
                colorError: {
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                },
            },
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: '1px solid #e2e8f0',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: '#f8fafc',
                    '& .MuiTableCell-head': {
                        fontWeight: 700,
                        color: '#475569',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.05em',
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(even)': {
                        backgroundColor: '#f8fafc',
                    },
                    '&:hover': {
                        backgroundColor: '#f1f5f9',
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    fontWeight: 500,
                },
                standardError: {
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                },
                standardWarning: {
                    backgroundColor: '#fffbeb',
                    color: '#d97706',
                    border: '1px solid #fed7aa',
                },
                standardSuccess: {
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                },
                standardInfo: {
                    backgroundColor: '#f0f9ff',
                    color: '#0284c7',
                    border: '1px solid #bae6fd',
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: '#e2e8f0',
                },
                bar: {
                    borderRadius: 8,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#1e293b',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderBottom: '1px solid #e2e8f0',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#ffffff',
                    borderRight: '1px solid #e2e8f0',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    margin: '4px 8px',
                    '&:hover': {
                        backgroundColor: '#f1f5f9',
                    },
                    '&.Mui-selected': {
                        backgroundColor: `${BRAND}15`,
                        color: BRAND,
                        '&:hover': {
                            backgroundColor: `${BRAND}25`,
                        },
                        '& .MuiListItemIcon-root': {
                            color: BRAND,
                        },
                    },
                },
            },
        },
    },
});

export const loginGradientBackground = {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 20s ease-in-out infinite',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '50%',
        height: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 25s ease-in-out infinite reverse',
    },
    '@keyframes float': {
        '0%, 100%': { transform: 'translate(0, 0)' },
        '50%': { transform: 'translate(30px, 30px)' },
    },
};