import { TranslationMessages } from 'ra-core';

export const spanishMessages: TranslationMessages = {
    ra: {
        action: {
            add_filter: 'Agregar filtro',
            add: 'Agregar',
            back: 'Volver',
            bulk_actions: '1 item seleccionado |||| %{smart_count} items seleccionados',
            cancel: 'Cancelar',
            clear_array_input: 'Limpiar la lista',
            clear_input_value: 'Limpiar valor',
            clone: 'Clonar',
            confirm: 'Confirmar',
            create: 'Crear',
            create_item: 'Crear %{item}',
            delete: 'Eliminar',
            edit: 'Editar',
            export: 'Exportar',
            list: 'Lista',
            refresh: 'Refrescar',
            remove_filter: 'Eliminar este filtro',
            remove_all_filters: 'Eliminar todos los filtros',
            remove: 'Eliminar',
            save: 'Guardar',
            search: 'Buscar',
            search_columns: 'Buscar columnas',
            select_all: 'Seleccionar todos',
            select_all_button: 'Seleccionar todos',
            select_row: 'Seleccionar esta fila',
            show: 'Mostrar',
            sort: 'Ordenar',
            undo: 'Deshacer',
            unselect: 'Deseleccionar',
            expand: 'Expandir',
            close: 'Cerrar',
            open_menu: 'Abrir menú',
            close_menu: 'Cerrar menú',
            update: 'Actualizar',
            move_up: 'Mover arriba',
            move_down: 'Mover abajo',
            open: 'Abrir',
            toggle_theme: 'Alternar modo claro/oscuro',
            select_columns: 'Columnas',
            update_application: 'Recargar aplicación',
        },
        boolean: {
            true: 'Sí',
            false: 'No',
            null: ' ',
        },
        page: {
            create: 'Crear %{name}',
            dashboard: 'Panel de control',
            reports: 'Reportes',
            edit: '%{name} %{recordRepresentation}',
            error: 'Algo salió mal',
            list: '%{name}',
            loading: 'Cargando',
            not_found: 'No encontrado',
            show: '%{name} %{recordRepresentation}',
            empty: 'No hay %{name} aún.',
            invite: '¿Quieres agregar uno?',
            access_denied: 'Acceso denegado',
            authentication_error: 'Error de autenticación',
        },
        input: {
            file: {
                upload_several:
                    'Arrastra algunos archivos para subir, o haz clic para seleccionar uno.',
                upload_single: 'Arrastra un archivo para subir, o haz clic para seleccionarlo.',
            },
            image: {
                upload_several:
                    'Arrastra algunas imágenes para subir, o haz clic para seleccionar una.',
                upload_single:
                    'Arrastra una imagen para subir, o haz clic para seleccionarla.',
            },
            references: {
                all_missing: 'No se pudieron encontrar los datos de las referencias.',
                many_missing:
                    'Al menos una de las referencias asociadas ya no parece estar disponible.',
                single_missing:
                    'Referencia asociada ya no parece estar disponible.',
            },
            password: {
                toggle_visible: 'Ocultar contraseña',
                toggle_hidden: 'Mostrar contraseña',
            },
        },
        message: {
            about: 'Acerca de',
            access_denied:
                "No tienes los permisos correctos para acceder a esta página",
            are_you_sure: '¿Estás seguro?',
            authentication_error:
                'El servidor de autenticación devolvió un error y tus credenciales no pudieron ser verificadas.',
            auth_error:
                'Ocurrió un error al validar el token de autenticación.',
            bulk_delete_content:
                '¿Estás seguro de querer eliminar este %{name}? |||| ¿Estás seguro de querer eliminar estos %{smart_count} items?',
            bulk_delete_title:
                'Eliminar %{name} |||| Eliminar %{smart_count} %{name}',
            bulk_update_content:
                '¿Estás seguro de querer actualizar este %{name} %{recordRepresentation}? |||| ¿Estás seguro de querer actualizar estos %{smart_count} items?',
            bulk_update_title:
                'Actualizar %{name} %{recordRepresentation} |||| Actualizar %{smart_count} %{name}',
            clear_array_input: '¿Estás seguro de querer limpiar toda la lista?',
            delete_content: '¿Estás seguro de querer eliminar este %{name}?',
            delete_title: 'Eliminar %{name} %{recordRepresentation}',
            details: 'Detalles',
            error: "Ocurrió un error en el cliente y tu solicitud no pudo ser completada.",
            invalid_form: 'El formulario no es válido. Por favor, revisa los errores',
            loading: 'Por favor, espera',
            no: 'No',
            not_found:
                'O bien escribiste una URL incorrecta, o seguiste un enlace incorrecto.',
            select_all_limit_reached:
                'Hay demasiados elementos para seleccionarlos todos. Solo se seleccionaron los primeros %{max} elementos.',
            unsaved_changes:
                "Algunas de tus modificaciones no se guardaron. ¿Estás seguro de querer ignorarlas?",
            yes: 'Sí',
            placeholder_data_warning: 'Problema de red: No se pudo actualizar los datos.',
        },
        navigation: {
            clear_filters: 'Limpiar filtros',
            no_filtered_results: 'No se encontró %{name} usando los filtros actuales.',
            no_results: 'No se encontró %{name}',
            no_more_results:
                'El número de página %{page} está fuera de los límites. Intenta la página anterior.',
            page_out_of_boundaries: 'Número de página %{page} fuera de los límites',
            page_out_from_end: 'No se puede ir después de la última página',
            page_out_from_begin: 'No se puede ir antes de la página 1',
            page_range_info: '%{offsetBegin}-%{offsetEnd} de %{total}',
            partial_page_range_info:
                '%{offsetBegin}-%{offsetEnd} de más de %{offsetEnd}',
            current_page: 'Página %{page}',
            page: 'Ir a la página %{page}',
            first: 'Ir a la primera página',
            last: 'Ir a la última página',
            next: 'Ir a la siguiente página',
            previous: 'Ir a la página anterior',
            page_rows_per_page: 'Filas por página:',
            skip_nav: 'Ir al contenido',
        },
        sort: {
            sort_by: 'Sort by %{field_lower_first} %{order}',
            ASC: 'ascendente',
            DESC: 'descendente',
        },
        auth: {
            auth_check_error: 'Por favor, inicia sesión para continuar',
            user_menu: 'Perfil',
            username: 'Nombre de usuario',
            password: 'Contraseña',
            email: 'Correo electrónico',
            sign_in: 'Iniciar sesión',
            sign_in_error: 'Autenticación fallida, por favor intenta nuevamente',
            logout: 'Cerrar sesión',
        },
        notification: {
            updated: 'Elemento actualizado |||| %{smart_count} elementos actualizados',
            created: 'Elemento creado',
            deleted: 'Elemento eliminado |||| %{smart_count} elementos eliminados',
            bad_item: 'Elemento incorrecto',
            item_doesnt_exist: 'El elemento no existe',
            http_error: 'Error de comunicación con el servidor',
            data_provider_error:
                'error de dataProvider. Revisa la consola para más detalles.',
            i18n_error:
                'No se pudieron cargar las traducciones para el idioma especificado',
            canceled: 'Acción cancelada',
            logged_out: 'Tu sesión ha terminado, por favor reconecta.',
            not_authorized: "No tienes permisos para acceder a este recurso.",
            application_update_available: 'Una nueva versión está disponible.',
        },
        validation: {
            required: 'Requerido',
            minLength: 'Debe tener al menos %{min} caracteres',
            maxLength: 'Debe tener %{max} caracteres o menos',
            minValue: 'Debe ser al menos %{min}',
            maxValue: 'Debe ser %{max} o menos',
            number: 'Debe ser un número',
            email: 'Debe ser un correo electrónico válido',
            oneOf: 'Debe ser uno de: %{options}',
            regex: 'Debe coincidir con un formato específico (regexp): %{pattern}',
            unique: 'Debe ser único',
        },
        saved_queries: {
            label: 'Consultas guardadas',
            query_name: 'Nombre de la consulta',
            new_label: 'Guardar consulta actual...',
            new_dialog_title: 'Guardar consulta actual como',
            remove_label: 'Eliminar consulta guardada',
            remove_label_with_name: 'Eliminar consulta "%{name}"',
            remove_dialog_title: 'Eliminar consulta guardada?',
            remove_message:
                '¿Estás seguro de querer eliminar ese elemento de tu lista de consultas guardadas?',
            help: 'Filtra la lista y guarda esta consulta para más tarde',
        },
        configurable: {
            customize: 'Customize',
            configureMode: 'Configurar esta página',
            inspector: {
                title: 'Inspector',
                content: 'Pasa el cursor sobre los elementos de la interfaz de usuario de la aplicación para configurarlos',
                reset: 'Restablecer configuración',
                hideAll: 'Ocultar todo',
                showAll: 'Mostrar todo',
            },
            Datagrid: {
                title: 'Datagrid',
                unlabeled: 'Columna sin etiqueta #%{column}',
            },
            SimpleForm: {
                title: 'Formulario',
                unlabeled: 'Campo sin etiqueta #%{input}',
            },
            SimpleList: {
                title: 'List',
                primaryText: 'Texto principal',
                secondaryText: 'Texto secundario',
                tertiaryText: 'Texto terciario',
            },
        },
    },
    resources: {
        posts: {
            name: 'Publicación |||| Publicaciones',
            fields: {
                id: 'ID',
                title: 'Título',
                body: 'Contenido',
                userId: 'Usuario'
            }
        },
        users: {
            name: 'Usuario |||| Usuarios',
            fields: {
                id: 'ID',
                name: 'Nombre',
                username: 'Nombre de usuario',
                email: 'Email'
            }
        },
        comments: {
            name: 'Comentario |||| Comentarios',
            fields: {
                id: 'ID',
                name: 'Nombre',
                email: 'Email',
                body: 'Comentario',
                postId: 'Publicación'
            }
        },
        albums: {
            name: 'Álbum |||| Álbumes',
            fields: {
                id: 'ID',
                title: 'Título',
                userId: 'Usuario'
            }
        },
        photos: {
            name: 'Foto |||| Fotos',
            fields: {
                id: 'ID',
                title: 'Título',
                url: 'URL de imagen',
                thumbnailUrl: 'URL de miniatura',
                albumId: 'Álbum'
            }
        },
        todos: {
            name: 'Tarea |||| Tareas',
            fields: {
                id: 'ID',
                title: 'Título',
                completed: 'Completado',
                userId: 'Usuario'
            }
        }
    }
};