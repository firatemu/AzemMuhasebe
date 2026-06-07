import { CompanyVehiclesService } from './company-vehicles.service';
import { PrismaService } from '../../common/prisma.service';
import { TenantResolverService } from '../../common/services/tenant-resolver.service';

// Mock service content check
const fs = require('fs');
const content = fs.readFileSync('company-vehicles.service.ts', 'utf8');
if (content.includes('include: { personnel: true, expenses: true }') || content.includes('expenses: true')) {
    console.log('Backend fix confirmed');
} else {
    console.log('Backend fix check failed');
}
