import { Request } from 'express';
import { ObjectId } from 'mongodb';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    fullName: string;
    role: string;
    turno: string;
  };
}

export interface IUser {
  _id?: ObjectId;
  username: string;
  password: string;
  fullName: string;
  role: 'admin' | 'jefe' | 'paramedico' | 'operador';
  turno: '1' | '2' | '3' | '4' | '5' | '6';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReport {
  _id?: ObjectId;
  folio: string | null;
  tipo: 'prehospitalaria' | 'urbana' | 'otro' | 'privada' | 'falsaAlarma';
  gravedad: 'baja' | 'media' | 'alta';

  // I. CRONOMETRÍA
  fechaHoraLlamada: Date;
  horaTraslado?: Date;
  horaSalida?: Date;
  horaHospital?: Date;
  fechaHoraArribo: Date;
  salidaHospital?: Date;
  fechaHoraCierre: Date | null;
  motivoAtencion?: 'enfermedad' | 'traumatismo' | 'ginecobstetricia';

  // DATOS GENERALES
  motivoLlamada?: string;
  incidenteCodigo?: string;

  // UBICACIÓN DEL SERVICIO
  ubicacion: {
    calle?: string;
    entre?: string;
    colonia?: string;
  } | string; // Permitir string para compatibilidad con formato antiguo
  delegacion?: string;
  lugarOcurrencia?: 'transporte_publico' | 'escuela' | 'trabajo' | 'hogar' | 'recreacion_deporte' | 'via_publica' | 'otro' | string;

  // II. CONTROL - RECURSOS Y PERSONAL
  ambulancia: string;
  entidad?: string;
  entidadUnidad?: string;
  paramedico: string;

  // Métricas
  kilometros?: number;
  kmRecorridos?: number;
  tiempoAtencionMin?: number;
  tiempoDeAtencion?: number;
  tiempoTrasladoMin?: number;
  tiempoDeTraslado?: number;

  // Campos booleanos para casos especiales
  esFalsaAlarma?: boolean;
  esPrivada?: boolean;
  privadaLlegoAntes?: boolean;
  motivoFalsaAlarma?: string;
  motivoPrivada?: string;
  notaIncidente?: string;

  // III. DATOS DEL PACIENTE (Prehospitalaria)
  paciente?: {
    nombre?: string;
    edad?: number;
    edadMeses?: number;
    sexo?: string;
    telefono?: string;
    ocupacion?: string;
    domicilio?: string;
    colonia?: string;
    alcaldia?: string;
    derechohabiente?: string;
  };
  pacienteNombre?: string;
  pacienteEdad?: number;
  pacienteSexo?: string;

  // IV. PARTO (Solo si motivoAtencion = ginecobstetricia)
  parto?: {
    // Datos de la madre
    semanasGesta?: number;
    horaInicioContracciones?: Date;
    frecuencia?: string;
    duracion?: string;
    // Datos postparto
    horaNacimiento?: Date;
    placentaExpulsada?: boolean;
    lugar?: string;
    productoEstado?: 'vivo' | 'muerto';
    sexoProducto?: 'M' | 'F';
    edadGestacional?: number;
    // APGAR
    apgar?: {
      color1?: number;
      color5?: number;
      color10?: number;
      color15?: number;
      color20?: number;
      fc1?: number;
      fc5?: number;
      fc10?: number;
      fc15?: number;
      fc20?: number;
      mueca1?: number;
      mueca5?: number;
      mueca10?: number;
      mueca15?: number;
      mueca20?: number;
      tonoMuscular1?: number;
      tonoMuscular5?: number;
      tonoMuscular10?: number;
      tonoMuscular15?: number;
      tonoMuscular20?: number;
      respiracion1?: number;
      respiracion5?: number;
      respiracion10?: number;
      respiracion15?: number;
      respiracion20?: number;
    };
  };

  // EVALUACIÓN MÉDICA
  diagnostico?: string;
  agenteCausal?: string;
  nivelConciencia?: 'alerta' | 'verbal' | 'dolor' | 'inconsciente';

  // V. CAUSA TRAUMÁTICA (Solo si motivoAtencion = traumatismo)
  causaTraumatica?: {
    agenteCausal?: string;
    especificar?: string;
    esAccidenteAutomobilistico?: boolean;
    tipoImpacto?: 'posterior' | 'lateral' | 'frontal' | 'rotacional' | 'volcadura';
    parabrisas?: 'integro' | 'estrellado';
    volante?: 'integro' | 'doblado';
    bolsaAire?: 'si' | 'no';
    cinturonSeguridad?: 'colocado' | 'no_colocado';
    dentroVehiculo?: 'si' | 'no' | 'eyectado';
    esAtropellado?: boolean;
    tipoAtropellado?: 'automotor' | 'motocicleta' | 'bicicleta' | 'maquinaria';
  };

  // VI. CAUSA CLÍNICA (Solo si motivoAtencion = enfermedad)
  causaClinica?: {
    origenProbable?: string;
    frecuencia?: 'primera_vez' | 'subsecuente';
  };

  // VII. EVALUACIÓN INICIAL
  evaluacionInicial?: {
    deglucion?: 'ausente' | 'presente';
    viaAerea?: 'permeable' | 'comprometida';
    ventilacion?: string;
    auscultacion?: string;
    hemitorax?: 'derecho' | 'izquierdo';
    sitio?: 'apical' | 'base';
    presenciaPulsos?: string;
    calidadPulso?: string;
    piel?: string;
    caracteristicasPiel?: string;
  };

  // SIGNOS VITALES
  signosVitales?: {
    ta?: string;
    fc?: number;
    fr?: number;
    temp?: number;
    spo2?: number;
    glucosa?: number;
  };

  // VIII. EVALUACIÓN SECUNDARIA
  evaluacionSecundaria?: {
    exploracionFisica?: string;
    pupilas?: string;
    monitores?: Array<{
      hora?: Date;
      fr?: number;
      fc?: number;
      tas?: string;
      tad?: string;
      sao2?: number;
      temp?: number;
      gluc?: number;
      neuroTest?: string;
    }>;
    glasgowTotal?: number;
    alergias?: string;
    medicamentosIngesta?: string;
    padecimientosCirugias?: string;
    ultimaComida?: string;
    eventosPrevios?: string;
    condicionPaciente?: 'critico' | 'no_critico' | 'estable' | 'inestable';
    prioridad?: 'rojo' | 'amarillo' | 'verde' | 'negro';
  };

  // IX. TRASLADO
  traslado?: {
    huboTraslado?: boolean;
    hospital?: string;
    quienRecibe?: string;
    folioCRU?: string;
    seNego?: boolean;
  };
  hayTraslado?: boolean;
  hospital?: string;
  quienRecibe?: string;

  // X. TRATAMIENTO
  insumos?: string;
  insumosCantidades?: string;
  tratamiento?: {
    viaAerea?: {
      aspiracion?: boolean;
      canulaOrofaringea?: boolean;
      canulaNasofaringea?: boolean;
      intubacionOrotraqueal?: boolean;
      combitubo?: boolean;
      mascarillaLaringea?: boolean;
    };
    controlCervical?: {
      manual?: boolean;
      collarinRigido?: boolean;
      collarinBlando?: boolean;
    };
    asistenciaVentilatoria?: {
      balon?: boolean;
      puntasNasales?: boolean;
      mascarillaSimple?: boolean;
      mascarillaReservorio?: boolean;
      ventiladorAutomatico?: boolean;
      litrosMin?: number;
    };
    medicamentos?: Array<{
      hora?: Date;
      medicamento?: string;
      dosis?: string;
      viaAdministracion?: string;
    }>;
    drTratante?: string;
    controlHemorragias?: {
      presionDirecta?: boolean;
      presionIndirecta?: boolean;
      vendajeCompresivo?: boolean;
    };
    viasVenosas?: {
      hartmann?: string;
      nacl?: string;
      glucosa?: string;
      lineaIV?: string;
      cateter?: string;
      cantidad?: string;
    };
    atencionBasica?: {
      rcpBasica?: boolean;
      rcpAvanzada?: boolean;
      curacion?: boolean;
      inmovilizacionExtremidades?: boolean;
      empaquetamiento?: boolean;
      vendaje?: boolean;
    };
  };

  // CAMPOS URBANA ADICIONALES
  incidenteUrbano?: string;
  descripcionEvento?: string;
  accionesRealizadas?: string;
  notaInformativa?: boolean;
  evidenciasFotograficas?: boolean;

  // XI. DATOS LEGALES
  observaciones?: string;
  pertenencias?: string;
  ministerioPublico?: {
    notificado?: boolean;
    responsableNombre?: string;
  };
  autoridadesConocimiento?: {
    dependencia?: string;
    numeroUnidad?: string;
    numeroOficiales?: number;
  };
  vehiculosInvolucrados?: Array<{
    tipoMarca?: string;
    placas?: string;
  }>;

  // CAMPOS DE CONTROL INTERNO
  observacionesJefe?: string | null;
  creadoPor: string;
  turnoCreacion: '1' | '2' | '3' | '4' | '5' | '6';
  casoAprobado: boolean;
  requiereRevision: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAuditLog {
  _id?: ObjectId;
  tipo: 'login' | 'logout' | 'crear_reporte' | 'editar_reporte' | 'eliminar_reporte' |
        'ver_reporte' | 'crear_usuario' | 'editar_usuario' | 'eliminar_usuario' |
        'asignacion_folio' | 'aprobacion_caso' | 'autorizacion_unidad_duplicada' |
        'acceso_estadisticas' | 'error_sistema' | 'cambio_password' | 'acceso_denegado';
  recursoId?: ObjectId | string; // ID del reporte, usuario, etc.
  recursoTipo?: 'reporte' | 'usuario' | 'sistema';
  usuario: string;
  usuarioRole: string;
  accion: string;
  detalles: {
    ip?: string;
    userAgent?: string;
    metodo?: string;
    url?: string;
    statusCode?: number;
    ambulancia?: string;
    motivoAutorizacion?: string;
    cambiosRealizados?: any;
    valorAnterior?: any;
    valorNuevo?: any;
    error?: string;
    folio?: string;
    tipo?: string;
    source?: string;
  };
  timestamp: Date;
}

