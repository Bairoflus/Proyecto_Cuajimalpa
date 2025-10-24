import { AuthProvider } from "react-admin";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

export const authProvider: AuthProvider = {
    async login({ username, password }) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Credenciales inválidas');
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("turno", data.user.turno || "");
            localStorage.setItem("fullName", data.user.fullName);
            localStorage.setItem("userId", data.user.id);

            console.log(`Login exitoso para rol: ${data.user.role}`);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Error de conexión");
        }
    },

    async logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("turno");
        localStorage.removeItem("fullName");
        localStorage.removeItem("userId");
    },

    async checkError({ status }: { status: number }) {
        if (status === 401 || status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("turno");
            localStorage.removeItem("fullName");
            localStorage.removeItem("userId");
            throw new Error("Sesión expirada");
        }
    },

    async checkAuth() {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Autenticación requerida");
        }

        try {
            const response = await fetch(`${API_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("role");
                localStorage.removeItem("turno");
                localStorage.removeItem("fullName");
                localStorage.removeItem("userId");
                throw new Error("Sesión expirada");
            }
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("turno");
            localStorage.removeItem("fullName");
            localStorage.removeItem("userId");
            throw new Error("Autenticación requerida");
        }
    },

    async getPermissions() {
        return localStorage.getItem("role");
    },

    async getIdentity() {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No hay sesión activa");
        }

        return {
            id: localStorage.getItem("userId"),
            fullName: localStorage.getItem("fullName"),
            username: localStorage.getItem("username"),
            role: localStorage.getItem("role"),
            turno: localStorage.getItem("turno"),
        };
    },
};