import { DataProvider } from 'react-admin';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const convertToReactAdminFormat = (item: any) => {
    if (!item) return item;

    return {
        ...item,
        id: item._id || item.id,
    };
};

const buildQueryString = (params: any) => {
    const query = new URLSearchParams();

    if (params.pagination) {
        query.append('page', params.pagination.page.toString());
        query.append('perPage', params.pagination.perPage.toString());
    }

    if (params.filter && Object.keys(params.filter).length > 0) {
        Object.entries(params.filter).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                query.append(key, value.toString());
            }
        });
    }

    return query.toString();
};

const getResourceEndpoint = (resource: string) => {
    // Mapear todos los tipos de reportes al endpoint /reports
    if (resource === 'reports' || resource === 'turno-reports' || resource === 'my-reports') {
        return 'reports';
    }
    // Mapear personal al endpoint /users
    if (resource === 'personal' || resource === 'personal-turno') {
        return 'users';
    }
    return resource;
};

const convertUserData = (data: any, toBackend: boolean = false) => {
    if (toBackend) {
        // Frontend -> Backend
        const { nombreCompleto, ...rest } = data;
        return {
            ...rest,
            fullName: nombreCompleto || data.fullName,
        };
    } else {
        // Backend -> Frontend
        const { fullName, ...rest } = data;
        return {
            ...rest,
            nombreCompleto: fullName || data.nombreCompleto,
        };
    }
};

export const dataProvider: DataProvider = {
    getList: async (resource, params) => {
        const endpoint = getResourceEndpoint(resource);
        const queryString = buildQueryString(params);
        const url = `${API_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            headers: getAuthHeaders(),
        });

        const result = await handleResponse(response);

        // Convertir datos de usuarios
        const data = (resource === 'personal' || resource === 'personal-turno')
            ? result.data.map((item: any) => convertUserData(convertToReactAdminFormat(item), false))
            : result.data.map(convertToReactAdminFormat);

        return {
            data,
            total: result.total,
        };
    },

    getOne: async (resource, params) => {
        const endpoint = getResourceEndpoint(resource);
        const response = await fetch(`${API_URL}/${endpoint}/${params.id}`, {
            headers: getAuthHeaders(),
        });

        const result = await handleResponse(response);

        // Convertir datos de usuarios
        const data = (resource === 'personal' || resource === 'personal-turno')
            ? convertUserData(convertToReactAdminFormat(result.data), false)
            : convertToReactAdminFormat(result.data);

        return {
            data,
        };
    },

    getMany: async (resource, params) => {
        const endpoint = getResourceEndpoint(resource);
        const promises = params.ids.map(id =>
            fetch(`${API_URL}/${endpoint}/${id}`, {
                headers: getAuthHeaders(),
            }).then(handleResponse)
        );

        const results = await Promise.all(promises);

        // Convertir datos de usuarios
        const data = (resource === 'personal' || resource === 'personal-turno')
            ? results.map(result => convertUserData(convertToReactAdminFormat(result.data), false))
            : results.map(result => convertToReactAdminFormat(result.data));

        return {
            data,
        };
    },

    getManyReference: async () => ({ data: [], total: 0 }),

    create: async (resource, params) => {
        const endpoint = getResourceEndpoint(resource);

        // Convertir datos de usuarios antes de enviar
        const bodyData = (resource === 'personal' || resource === 'personal-turno')
            ? convertUserData(params.data, true)
            : params.data;

        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(bodyData),
        });

        const result = await handleResponse(response);

        // Convertir datos de usuarios de vuelta
        const data = (resource === 'personal' || resource === 'personal-turno')
            ? convertUserData(convertToReactAdminFormat(result.data), false)
            : convertToReactAdminFormat(result.data);

        return {
            data,
        };
    },

    update: async (resource, params) => {
        const endpoint = getResourceEndpoint(resource);

        // Convertir datos de usuarios antes de enviar
        const bodyData = (resource === 'personal' || resource === 'personal-turno')
            ? convertUserData(params.data, true)
            : params.data;

        const response = await fetch(`${API_URL}/${endpoint}/${params.id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(bodyData),
        });

        const result = await handleResponse(response);

        // Convertir datos de usuarios de vuelta
        const data = (resource === 'personal' || resource === 'personal-turno')
            ? convertUserData(convertToReactAdminFormat(result.data), false)
            : convertToReactAdminFormat(result.data);

        return {
            data,
        };
    },

    updateMany: async (resource, params) => {
        const endpoint = getResourceEndpoint(resource);
        const promises = params.ids.map(id =>
            fetch(`${API_URL}/${endpoint}/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(params.data),
            }).then(handleResponse)
        );

        await Promise.all(promises);

        return { data: params.ids };
    },

    delete: async (resource, params) => {
        const endpoint = getResourceEndpoint(resource);
        const response = await fetch(`${API_URL}/${endpoint}/${params.id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        await handleResponse(response);

        return {
            data: { id: params.id } as any,
        };
    },

    deleteMany: async (resource, params) => {
        const endpoint = getResourceEndpoint(resource);
        const promises = params.ids.map(id =>
            fetch(`${API_URL}/${endpoint}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            }).then(handleResponse)
        );

        await Promise.all(promises);

        return { data: params.ids };
    },
};