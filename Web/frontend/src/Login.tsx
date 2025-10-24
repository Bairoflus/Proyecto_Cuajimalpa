import { useState } from 'react';
import { useLogin, useNotify } from 'react-admin';
import {
    Box, Card, CardContent, TextField, Button, Avatar, Typography,
    InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock, Shield } from '@mui/icons-material';

const BRAND = '#1663afff';

export const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const login = useLogin();
    const notify = useNotify();

    const handleChange = (field: 'username' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login({ username: form.username, password: form.password });
        }
        catch {
            notify('Credenciales inválidas', { type: 'error' });
        }
        finally {
            setLoading(false);
        }
    };
    {/* CONTENEDOR PRINCIPAL - Fondo con gradiente y animaciones */ }
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
                position: 'relative',
                overflow: 'hidden',
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
            }}
        >
            <Box sx={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 4
                }}>
                    <Avatar
                        src="https://cuajimalpa.gob.mx/wp-content/uploads/2025/01/cropped-icono.png"
                        alt="Logo Cuajimalpa"
                        sx={{
                            width: 100,
                            height: 100,
                            mb: 3,
                            bgcolor: 'transparent',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            border: '4px solid rgba(255,255,255,0.9)',
                        }}
                    />
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: 'white',
                            textAlign: 'center',
                            mb: 0.5,
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        Alcaldía Cuajimalpa
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255,255,255,0.9)',
                            textAlign: 'center',
                            fontSize: '0.95rem',
                        }}
                    >
                        Sistema de Administración Digital
                    </Typography>
                </Box>

                <Card
                    sx={{
                        borderRadius: 6,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(10px)',
                        background: 'rgba(255,255,255,0.98)',
                    }}
                >
                    <CardContent sx={{ p: 5 }}>
                        {/* Encabezado del formulario */}
                        <Box sx={{ mb: 4 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    color: '#1e293b',
                                    mb: 1,
                                }}
                            >
                                Bienvenido
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#64748b',
                                }}
                            >
                                Ingresa tus credenciales para continuar
                            </Typography>
                        </Box>

                        {/* Formulario */}
                        <Box component="form" onSubmit={handleSubmit} aria-label="Formulario de inicio de sesión" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Box>
                                <Typography
                                    sx={{
                                        mb: 1,
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: '#475569'
                                    }}
                                >
                                    Usuario
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Ingrese su usuario"
                                    value={form.username}
                                    onChange={handleChange('username')}
                                    required
                                    autoFocus
                                    autoComplete="username"
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person sx={{ color: form.username ? BRAND : '#94a3b8' }} aria-label="Usuario" />
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            height: '56px',
                                            fontSize: '1rem',
                                            color: '#1e293b',
                                        }
                                    }}
                                    sx={{
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
                                            }
                                        },
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        mb: 1,
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: '#475569'
                                    }}
                                >
                                    Contraseña
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Ingrese su contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange('password')}
                                    required
                                    autoComplete="current-password"
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock sx={{ color: form.password ? BRAND : '#94a3b8' }} aria-label="Contraseña" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(s => !s)}
                                                    edge="end"
                                                    disabled={loading}
                                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                                    sx={{ color: '#94a3b8' }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            height: '56px',
                                            fontSize: '1rem',
                                            color: '#1e293b',
                                        }
                                    }}
                                    sx={{
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
                                            }
                                        },
                                    }}
                                />
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    mt: 2,
                                    py: 1.8,
                                    background: `linear-gradient(135deg, ${BRAND} 0%, #003D7A 100%)`,
                                    fontWeight: 600,
                                    fontSize: '1.05rem',
                                    color: 'white',
                                    textTransform: 'none',
                                    borderRadius: 3,
                                    boxShadow: '0 8px 24px rgba(22,99,175,0.35)',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        background: `linear-gradient(135deg, #003D7A 0%, #002855 100%)`,
                                        boxShadow: '0 12px 32px rgba(22,99,175,0.45)',
                                        transform: 'translateY(-2px)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                    },
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: 'white' }} />
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </Button>
                        </Box>

                        {/* Nota de seguridad */}
                        <Box
                            sx={{
                                mt: 4,
                                pt: 3,
                                borderTop: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'start',
                                gap: 1.5,
                            }}
                        >
                            <Shield sx={{ color: '#94a3b8', fontSize: 18, mt: 0.3 }} aria-label="Seguridad" />
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#64748b',
                                    lineHeight: 1.5,
                                    fontSize: '0.8rem',
                                }}
                            >
                                Sistema de uso exclusivo para personal autorizado de la Alcaldía Cuajimalpa.
                                Todos los accesos quedan registrados.
                            </Typography>
                        </Box>

                        {/* Usuarios de prueba */}
                        <Box
                            sx={{
                                mt: 3,
                                p: 2.5,
                                bgcolor: '#f8fafc',
                                borderRadius: 3,
                                border: '1px solid #e2e8f0',
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    color: '#475569',
                                    mb: 1.5,
                                    fontWeight: 600,
                                    fontSize: '0.8rem',
                                }}
                            >
                                Usuarios de prueba:
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    color: '#64748b',
                                    mb: 0.5,
                                    fontSize: '0.75rem',
                                }}
                            >
                                • Admin: admin | Contraseña: admin123
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    color: '#64748b',
                                    mb: 0.5,
                                    fontSize: '0.75rem',
                                }}
                            >
                                • Jefe: jefe1 | Contraseña: jefe123
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    color: '#64748b',
                                    fontSize: '0.75rem',
                                }}
                            >
                                • Operador: operador1 | Contraseña: operador123
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* Footer */}
                <Typography
                    sx={{
                        mt: 4,
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: 13,
                        textAlign: 'center',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                >
                    © 2025 Alcaldía Cuajimalpa de Morelos. Todos los derechos reservados.
                </Typography>
            </Box>
        </Box>
    );
};