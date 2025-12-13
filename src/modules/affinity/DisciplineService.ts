import { PrismaClient, SchoolYear } from '@prisma/client';
import { prisma } from '../../prisma/client';

export class DisciplineService {
    // Helper to determiner school year order for comparison
    private getSchoolYearValue(year: SchoolYear): number {
        const order = [
            'FUNDAMENTAL_1_1', 'FUNDAMENTAL_1_2', 'FUNDAMENTAL_1_3', 'FUNDAMENTAL_1_4', 'FUNDAMENTAL_1_5',
            'FUNDAMENTAL_2_6', 'FUNDAMENTAL_2_7', 'FUNDAMENTAL_2_8', 'FUNDAMENTAL_2_9',
            'HIGH_SCHOOL_1', 'HIGH_SCHOOL_2', 'HIGH_SCHOOL_3'
        ];
        return order.indexOf(year);
    }

    async getVisibleDisciplines(characterSchoolYear: SchoolYear) {
        const characterYearValue = this.getSchoolYearValue(characterSchoolYear);

        // Get all disciplines
        const allDisciplines = await prisma.discipline.findMany();

        // Filter based on visibility (discipline year must be <= character year)
        return allDisciplines.filter(discipline => {
            return this.getSchoolYearValue(discipline.schoolYear) <= characterYearValue;
        });
    }

    async getAllDisciplines() {
        return prisma.discipline.findMany();
    }
}
