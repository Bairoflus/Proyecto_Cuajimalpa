import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Alert,
    Typography,
    Box
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface ConflictingReport {
    id: string;
    folio: string | null;
    fechaHoraLlamada: string;
    ubicacion: string;
}

interface AuthorizationDialogProps {
    open: boolean;
    onClose: () => void;
    onAuthorize: (motivo: string) => void;
    conflictingReport?: ConflictingReport;
    ambulancia: string;
}

export const AuthorizationDialog: React.FC<AuthorizationDialogProps> = ({
    open,
    onClose,
    onAuthorize,
    conflictingReport,
    ambulancia
}) => {
    const [motivo, setMotivo] = useState('');
    const [error, setError] = useState('');

    const handleAuthorize = () => {
        if (!motivo.trim()) {
            setError('Debe proporcionar un motivo para la autorización');
            return;
        }

        onAuthorize(motivo);
        setMotivo('');
        setError('');
    };

    const handleClose = () => {
        setMotivo('');
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth aria-labelledby="authorization-dialog-title">
            <DialogTitle id="authorization-dialog-title">
                <Box display="flex" alignItems="center" gap={1}>
                    <WarningIcon color="warning" aria-label="Advertencia" />
                    <Typography variant="h6">
                        Autorización Requerida - Unidad Duplicada
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mb: 2 }} role="alert">
                    La unidad <strong>{ambulancia}</strong> ya está asignada a otro incidente.
                </Alert>

                {conflictingReport && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            <strong>Incidente Existente:</strong>
                        </Typography>
                        <Typography variant="body2">
                            <strong>Folio:</strong> {conflictingReport.folio || 'Sin folio'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Fecha/Hora:</strong> {new Date(conflictingReport.fechaHoraLlamada).toLocaleString('es-MX')}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Ubicación:</strong> {conflictingReport.ubicacion}
                        </Typography>
                    </Box>
                )}

                <Typography variant="body2" sx={{ mb: 2 }}>
                    Como <strong>Jefe de Turno</strong>, puede autorizar la asignación de esta unidad al nuevo incidente.
                    Esta acción quedará registrada en la bitácora del sistema.
                </Typography>

                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Motivo de la Autorización *"
                    placeholder="Explique por qué autoriza asignar esta unidad a pesar del conflicto..."
                    value={motivo}
                    onChange={(e) => {
                        setMotivo(e.target.value);
                        setError('');
                    }}
                    error={!!error}
                    helperText={error || 'Este motivo se guardará en la bitácora del sistema'}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit" aria-label="Cancelar autorización">
                    Cancelar
                </Button>
                <Button
                    onClick={handleAuthorize}
                    variant="contained"
                    color="warning"
                    aria-label="Autorizar asignación de unidad duplicada"
                >
                    Autorizar Asignación
                </Button>
            </DialogActions>
        </Dialog>
    );
};
