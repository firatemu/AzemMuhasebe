import { IsOptional, IsBooleanString } from 'class-validator';
import { StatementQueryDto } from './statement-query.dto';

export class DetailedStatementQueryDto extends StatementQueryDto {
    @IsOptional()
    @IsBooleanString()
    invoiceLines?: string;

    @IsOptional()
    @IsBooleanString()
    collections?: string;

    @IsOptional()
    @IsBooleanString()
    checks?: string;
}

export interface DetailIncludeFlags {
    invoiceLines: boolean;
    collections: boolean;
    checks: boolean;
}

export function parseDetailIncludeFlags(query: {
    invoiceLines?: string;
    collections?: string;
    checks?: string;
}): DetailIncludeFlags {
    const parse = (v?: string) => v !== 'false' && v !== '0';
    return {
        invoiceLines: parse(query.invoiceLines),
        collections: parse(query.collections),
        checks: parse(query.checks),
    };
}
