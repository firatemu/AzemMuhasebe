import { ApiProperty } from '@nestjs/swagger';

export class SalesAgentResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    phone?: string;

    @ApiProperty()
    email?: string;

    @ApiProperty()
    isActive: boolean;

    static fromPrisma(prismaAgent: any): SalesAgentResponseDto {
        return {
            id: prismaAgent.id,
            fullName: prismaAgent.fullName,
            phone: prismaAgent.phone,
            email: prismaAgent.email,
            isActive: prismaAgent.isActive,
        };
    }
}
