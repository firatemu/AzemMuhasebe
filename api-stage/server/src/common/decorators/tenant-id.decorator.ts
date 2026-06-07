import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const TenantId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        // Priority: 1) header tenantId, 2) JWT user.tenantId, 3) JWT payload tenantId
        const tenantId = request.tenantId 
            || request.user?.tenantId 
            || (request.user as any)?.tenantId;

        if (!tenantId) {
            // Ideally this should be handled by a global guard or middleware, but safe to check here
            // For SuperAdmin context without specific tenant, this might be undefined.
            // But RolesService requires tenantId.
            throw new BadRequestException('Tenant Context Required');
        }
        return tenantId;
    },
);
