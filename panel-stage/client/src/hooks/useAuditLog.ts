import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

export function useEntityAuditLog(entityName: string, entityId: string) {
    return useQuery({
        queryKey: ['audit-log', entityName, entityId],
        queryFn: async () => {
            const response = await axios.get(`/audit-log/${entityName}/${entityId}`);
            return response.data;
        },
        enabled: !!entityName && !!entityId,
    });
}
