import { PrismaClient, SchoolYear, RoomType } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTowerFloors() {
    console.log('🏗️ Seeding Tower Floors...');

    // Criar Andar 1 - FUNDAMENTAL_1_1
    const andar01 = await prisma.towerFloor.upsert({
        where: { floorNumber: 1 },
        update: {},
        create: {
            floorNumber: 1,
            name: 'Andar 1 - Fundamental I (1º Ano)',
            schoolYear: SchoolYear.FUNDAMENTAL_1_1,
            mapWidth: 1200,
            mapHeight: 720,
        },
    });

    console.log('✅ Andar 1 criado:', andar01.id);

    // Criar Andar 2 - FUNDAMENTAL_1_2
    const andar02 = await prisma.towerFloor.upsert({
        where: { floorNumber: 2 },
        update: {},
        create: {
            floorNumber: 2,
            name: 'Andar 2 - Fundamental I (2º Ano)',
            schoolYear: SchoolYear.FUNDAMENTAL_1_2,
            mapWidth: 1200,
            mapHeight: 720,
        },
    });

    console.log('✅ Andar 2 criado:', andar02.id);

    // Salas do Andar 1
    const andar01Rooms = [
        {
            id: 'classroom-a1',
            type: RoomType.CLASSROOM,
            name: 'SALA DE AULA',
            description: 'Espaço de aprendizado teórico.',
            mapLayout: JSON.stringify({
                image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600&h=400',
                color: '#3b82f6',
                actions: [
                    {
                        label: 'Projetor',
                        icon: '📽️',
                        command: 'Ativar projetor holográfico e carregar aula do dia.',
                    },
                    {
                        label: 'Presença',
                        icon: '👤',
                        command: 'Realizar chamada automática via biometria.',
                    },
                ],
                info: 'Ambiente climatizado com quadros interativos e acústica projetada para palestras.',
            }),
        },
        {
            id: 'science-lab-a1',
            type: RoomType.CLASSROOM,
            name: 'LAB. CIÊNCIAS',
            description: 'Laboratório de biotecnologia.',
            mapLayout: JSON.stringify({
                image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=600&h=400',
                color: '#10b981',
                actions: [
                    {
                        label: 'Exaustor',
                        icon: '🌀',
                        command: 'Ativar sistema de filtragem de ar Nível 4.',
                    },
                    {
                        label: 'Segurança',
                        icon: '🛡️',
                        command: 'Verificar contenção de materiais perigosos.',
                    },
                ],
                info: 'Equipado com microscópios eletrônicos e bancadas de contenção biológica avançada.',
            }),
        },
        {
            id: 'computer-lab-a1',
            type: RoomType.CLASSROOM,
            name: 'LAB. INFORMÁTICA',
            description: 'Centro de processamento de dados.',
            mapLayout: JSON.stringify({
                image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600&h=400',
                color: '#06b6d4',
                actions: [
                    {
                        label: 'Renderizar',
                        icon: '⚡',
                        command: 'Alocar poder da GPU para processamento distribuído.',
                    },
                    {
                        label: 'Firewall',
                        icon: '🧱',
                        command: 'Reforçar defesas da rede escolar.',
                    },
                ],
                info: 'Nodos de computação de alta performance e conexão de fibra óptica de 10Gbps.',
            }),
        },
        {
            id: 'nurse-a1',
            type: RoomType.INFIRMARY,
            name: 'ENFERMARIA',
            description: 'Suporte médico avançado.',
            mapLayout: JSON.stringify({
                image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600&h=400',
                color: '#ec4899',
                actions: [
                    {
                        label: 'Triagem',
                        icon: '📋',
                        command: 'Iniciar escaneamento de sinais vitais via sensores.',
                    },
                ],
                info: 'Posto médico 24h com equipamentos de primeiros socorros e telemedicina.',
            }),
        },
        {
            id: 'courtyard-a1',
            type: RoomType.COURTYARD,
            name: 'PÁTIO',
            description: 'Área social externa.',
            mapLayout: JSON.stringify({
                image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&q=80&w=600&h=400',
                color: '#84cc16',
                actions: [
                    {
                        label: 'Som',
                        icon: '🎵',
                        command: 'Tocar música ambiente relaxante no pátio.',
                    },
                    {
                        label: 'Luzes',
                        icon: '💡',
                        command: 'Ajustar iluminação externa para economia de energia.',
                    },
                ],
                info: 'Área verde com bancos inteligentes dotados de carregadores solares.',
            }),
        },
        {
            id: 'library-a1',
            type: RoomType.LIBRARY,
            name: 'BIBLIOTECA',
            description: 'Acervo digital infinito.',
            mapLayout: JSON.stringify({
                image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600&h=400',
                color: '#8b5cf6',
                actions: [
                    {
                        label: 'Silêncio',
                        icon: '🤫',
                        command: 'Ativar cancelamento de ruído ambiente.',
                    },
                    {
                        label: 'Busca',
                        icon: '🔍',
                        command: 'Localizar obras raras nos arquivos.',
                    },
                ],
                info: 'Milhares de volumes físicos e acesso a bases de dados acadêmicas globais.',
            }),
        },
        {
            id: 'principal-a1',
            type: RoomType.CLASSROOM,
            name: 'DIRETORIA',
            description: 'Comando central.',
            mapLayout: JSON.stringify({
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600&h=400',
                color: '#ef4444',
                actions: [
                    {
                        label: 'Reunião',
                        icon: '🤝',
                        command: 'Preparar sala para videoconferência segura.',
                    },
                ],
                info: 'Centro administrativo onde são tomadas as decisões estratégicas do campus.',
            }),
        },
        {
            id: 'teachers-a1',
            type: RoomType.CLASSROOM,
            name: 'SALA DOS PROFESSORES',
            description: 'Espaço para educadores.',
            mapLayout: JSON.stringify({
                image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600&h=400',
                color: '#f59e0b',
                actions: [
                    {
                        label: 'Café',
                        icon: '☕',
                        command: 'Iniciar preparo de café expresso para os docentes.',
                    },
                    {
                        label: 'Pautas',
                        icon: '📝',
                        command: 'Sincronizar pautas de reuniões pedagógicas.',
                    },
                ],
                info: 'Área de descanso e planejamento colaborativo para o corpo docente.',
            }),
        },
        {
            id: 'office-a1',
            type: RoomType.CLASSROOM,
            name: 'SECRETARIA',
            description: 'Administração escolar.',
            mapLayout: JSON.stringify({
                image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600&h=400',
                color: '#6366f1',
                actions: [
                    {
                        label: 'Arquivos',
                        icon: '📁',
                        command: 'Organizar registros digitais dos alunos.',
                    },
                ],
                info: 'Atendimento ao público e gestão de documentos acadêmicos.',
            }),
        },
        {
            id: 'canteen-a1',
            type: RoomType.CAFETERIA,
            name: 'CANTINA',
            description: 'Nutrição e convívio.',
            mapLayout: JSON.stringify({
                image: 'https://images.unsplash.com/photo-1567529684892-09290a1b2d05?auto=format&fit=crop&q=80&w=600&h=400',
                color: '#f97316',
                actions: [
                    {
                        label: 'Menu',
                        icon: '🍎',
                        command: 'Atualizar cardápio balanceado do dia.',
                    },
                    {
                        label: 'Higiene',
                        icon: '🧼',
                        command: 'Iniciar protocolo de sanitização UV nas mesas.',
                    },
                ],
                info: 'Cozinha industrial certificada servindo refeições saudáveis e balanceadas.',
            }),
        },
        {
            id: 'storage-a1',
            type: RoomType.CLASSROOM,
            name: 'ALMOXARIFADO',
            description: 'Estoque de suprimentos.',
            mapLayout: JSON.stringify({
                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600&h=400',
                color: '#64748b',
                actions: [
                    {
                        label: 'Estoque',
                        icon: '📦',
                        command: 'Realizar inventário automático de materiais.',
                    },
                ],
                info: 'Gestão automatizada de insumos escolares e equipamentos de manutenção.',
            }),
        },
        {
            id: 'restrooms-a1',
            type: RoomType.CLASSROOM,
            name: 'BANHEIROS',
            description: 'Instalações de higiene.',
            mapLayout: JSON.stringify({
                image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600&h=400',
                color: '#94a3b8',
                actions: [
                    {
                        label: 'Limpeza',
                        icon: '🧹',
                        command: 'Solicitar equipe de manutenção para este setor.',
                    },
                ],
                info: 'Instalações modernas com sensores de presença e economia de água.',
            }),
        },
        {
            id: 'gym-a1',
            type: RoomType.CLASSROOM,
            name: 'GINÁSIO',
            description: 'Complexo esportivo.',
            mapLayout: JSON.stringify({
                image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600&h=400',
                color: '#14b8a6',
                actions: [
                    {
                        label: 'Placar',
                        icon: '🔢',
                        command: 'Zerar placar eletrônico do ginásio.',
                    },
                ],
                info: 'Quadras poliesportivas com piso de absorção de impacto de última geração.',
            }),
        },
        {
            id: 'sports-field-a1',
            type: RoomType.COURTYARD,
            name: 'CAMPO ESPORTIVO',
            description: 'Campo de futebol e atletismo.',
            mapLayout: JSON.stringify({
                image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=600&h=400',
                color: '#10b981',
                actions: [
                    {
                        label: 'Irrigação',
                        icon: '💧',
                        command: 'Ativar sistema de irrigação automática do gramado.',
                    },
                    {
                        label: 'Iluminação',
                        icon: '💡',
                        command: 'Ligar refletores para treino noturno.',
                    },
                ],
                info: 'Campo oficial com grama sintética de última geração e pista de atletismo.',
            }),
        },
    ];

    // Limpar salas antigas do Andar 1 antes de inserir novas
    await prisma.room.deleteMany({
        where: {
            floorId: andar01.id,
        },
    });

    // Inserir salas do Andar 1
    for (const room of andar01Rooms) {
        await prisma.room.upsert({
            where: { id: room.id },
            update: {},
            create: {
                ...room,
                floorId: andar01.id,
            },
        });
    }

    console.log(`✅ ${andar01Rooms.length} salas criadas para Andar 1`);

    // Salas do Andar 2 (conteúdo diferente, mesmas posições)
    const andar02Rooms = andar01Rooms.map((room) => ({
        ...room,
        id: room.id.replace('-a1', '-a2'),
        name: room.name + ' 2',
        description: room.description + ' (2º Ano)',
    }));

    // Limpar salas antigas do Andar 2 antes de inserir novas
    await prisma.room.deleteMany({
        where: {
            floorId: andar02.id,
        },
    });

    // Inserir salas do Andar 2
    for (const room of andar02Rooms) {
        await prisma.room.upsert({
            where: { id: room.id },
            update: {},
            create: {
                ...room,
                floorId: andar02.id,
            },
        });
    }

    console.log(`✅ ${andar02Rooms.length} salas criadas para Andar 2`);
}

async function main() {
    try {
        await seedTowerFloors();
        console.log('✅ Seed concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao executar seed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();

