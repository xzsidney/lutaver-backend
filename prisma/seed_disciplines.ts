import { PrismaClient, SchoolYear } from '@prisma/client';

const prisma = new PrismaClient();

const subjects = [
    // Fundamental I (Starts at 1_1)
    { code: 'PORT_F1', name: 'Língua Portuguesa - Fundamental I', description: 'Estudo de leitura, escrita, compreensão e gramática.', schoolYear: SchoolYear.FUNDAMENTAL_1_1 },
    { code: 'MAT_F1', name: 'Matemática - Fundamental I', description: 'Números, operações, raciocínio lógico e problemas.', schoolYear: SchoolYear.FUNDAMENTAL_1_1 },
    { code: 'CIEN_F1', name: 'Ciências - Fundamental I', description: 'Estudo da natureza, corpo humano, experimentos e observação científica.', schoolYear: SchoolYear.FUNDAMENTAL_1_1 },
    { code: 'HIST_F1', name: 'História - Fundamental I', description: 'Noções de passado, cultura, sociedade e temporalidade.', schoolYear: SchoolYear.FUNDAMENTAL_1_1 },
    { code: 'GEO_F1', name: 'Geografia - Fundamental I', description: 'Espaço geográfico, mapas, climas e lugares.', schoolYear: SchoolYear.FUNDAMENTAL_1_1 },
    { code: 'ARTE_F1', name: 'Arte - Fundamental I', description: 'Expressões artísticas: música, dança, desenho e teatro.', schoolYear: SchoolYear.FUNDAMENTAL_1_1 },
    { code: 'EDF_F1', name: 'Educação Física - Fundamental I', description: 'Movimento, jogos, coordenação, atividades físicas.', schoolYear: SchoolYear.FUNDAMENTAL_1_1 },
    { code: 'ER_F1', name: 'Ensino Religioso - Fundamental I', description: 'Valores, cultura, ética e diversidade religiosa.', schoolYear: SchoolYear.FUNDAMENTAL_1_1 },

    // Fundamental II (Starts at 2_6)
    { code: 'PORT_F2', name: 'Língua Portuguesa - Fundamental II', description: 'Leitura, produção textual, análise linguística e literatura.', schoolYear: SchoolYear.FUNDAMENTAL_2_6 },
    { code: 'MAT_F2', name: 'Matemática - Fundamental II', description: 'Aritmética, álgebra, geometria e estatística básica.', schoolYear: SchoolYear.FUNDAMENTAL_2_6 },
    { code: 'CIEN_F2', name: 'Ciências - Fundamental II', description: 'Biologia, química e física introdutória.', schoolYear: SchoolYear.FUNDAMENTAL_2_6 },
    { code: 'HIST_F2', name: 'História - Fundamental II', description: 'Civilizações, Brasil, cultura e sociedade.', schoolYear: SchoolYear.FUNDAMENTAL_2_6 },
    { code: 'GEO_F2', name: 'Geografia - Fundamental II', description: 'Ambiente, globalização, mapas, geopolítica.', schoolYear: SchoolYear.FUNDAMENTAL_2_6 },
    { code: 'ARTE_F2', name: 'Arte - Fundamental II', description: 'Expressão artística avançada e linguagens visuais.', schoolYear: SchoolYear.FUNDAMENTAL_2_6 },
    { code: 'EDF_F2', name: 'Educação Física - Fundamental II', description: 'Saúde, esportes, movimento e práticas corporais.', schoolYear: SchoolYear.FUNDAMENTAL_2_6 },
    { code: 'ER_F2', name: 'Ensino Religioso - Fundamental II', description: 'Ética, cidadania e diversidade cultural.', schoolYear: SchoolYear.FUNDAMENTAL_2_6 },
    { code: 'ING_F2', name: 'Inglês - Fundamental II', description: 'Leitura, vocabulário, conversação básica em inglês.', schoolYear: SchoolYear.FUNDAMENTAL_2_6 },

    // Ensino Médio (Starts at HIGH_SCHOOL_1)
    { code: 'PORT_M', name: 'Língua Portuguesa - Médio', description: 'Literatura, gramática, redação e análise textual.', schoolYear: SchoolYear.HIGH_SCHOOL_1 },
    { code: 'ING_M', name: 'Inglês - Médio', description: 'Compreensão, conversação, leitura e escrita em inglês.', schoolYear: SchoolYear.HIGH_SCHOOL_1 },
    { code: 'ARTE_M', name: 'Arte - Médio', description: 'Estudo das linguagens artísticas e cultura visual.', schoolYear: SchoolYear.HIGH_SCHOOL_1 },
    { code: 'EDF_M', name: 'Educação Física - Médio', description: 'Atividades físicas, saúde, corpo e movimento.', schoolYear: SchoolYear.HIGH_SCHOOL_1 },
    { code: 'BIO_M', name: 'Biologia', description: 'Vida, células, ecologia, genética e evolução.', schoolYear: SchoolYear.HIGH_SCHOOL_1 },
    { code: 'QUI_M', name: 'Química', description: 'Reações químicas, matéria, átomos e moléculas.', schoolYear: SchoolYear.HIGH_SCHOOL_1 },
    { code: 'FIS_M', name: 'Física', description: 'Energia, força, movimento, ondas e eletricidade.', schoolYear: SchoolYear.HIGH_SCHOOL_1 },
    { code: 'HIST_M', name: 'História - Médio', description: 'História do Brasil, mundo, política e sociedade.', schoolYear: SchoolYear.HIGH_SCHOOL_1 },
    { code: 'GEO_M', name: 'Geografia - Médio', description: 'Ambiente, geopolítica, cartografia e globalização.', schoolYear: SchoolYear.HIGH_SCHOOL_1 },
    { code: 'FILO_M', name: 'Filosofia', description: 'Pensamento filosófico, ética e reflexão crítica.', schoolYear: SchoolYear.HIGH_SCHOOL_1 },
    { code: 'SOC_M', name: 'Sociologia', description: 'Sociedade, grupos sociais, cultura e política.', schoolYear: SchoolYear.HIGH_SCHOOL_1 },
    { code: 'MAT_M', name: 'Matemática - Médio', description: 'Funções, estatística, álgebra e geometria.', schoolYear: SchoolYear.HIGH_SCHOOL_1 },
];

async function main() {
    console.log('Seeding Subjects...');
    for (const subject of subjects) {
        await prisma.discipline.upsert({
            where: { code: subject.code },
            update: {},
            create: subject,
        });
    }
    console.log('Done.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
