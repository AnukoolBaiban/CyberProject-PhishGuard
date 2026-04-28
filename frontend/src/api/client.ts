import axios from 'axios';
import type { AttemptCreate, Scenario } from '../types';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
    headers: { 'Content-Type': 'application/json' },
});

export async function getScenarios(): Promise<Scenario[]> {
    const response = await apiClient.get<Scenario[]>('/api/scenarios');
    return response.data;
}

export async function postAttempt(attempt: AttemptCreate): Promise<void> {
    await apiClient.post('/api/attempts', attempt);
}

export default apiClient;
