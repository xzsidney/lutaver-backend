import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupWisdom() {
    console.log('🧹 Removendo atributo WISDOM do banco de dados...\n');

    try {
        // 1. Encontrar AttributeDefinition com code WISDOM
        const wisdomAttr = await prisma.attributeDefinition.findUnique({
            where: { code: 'WISDOM' as any },
        });

        if (!wisdomAttr) {
            console.log('✅ Atributo WISDOM não encontrado. Nada a fazer.');
            return;
        }

        console.log(`Encontrado: AttributeDefinition com ID ${wisdomAttr.id}`);

        // 2. Deletar CharacterAttributes relacionados (cascade automático, mas confirmando)
        const deletedCharAttrs = await prisma.characterAttribute.deleteMany({
            where: { attributeId: wisdomAttr.id },
        });

        console.log(`✅ Deletados ${deletedCharAttrs.count} CharacterAttribute(s) relacionados ao WISDOM`);

        // 3. Deletar AttributeDefinition
        await prisma.attributeDefinition.delete({
            where: { id: wisdomAttr.id },
        });

        console.log('✅ AttributeDefinition WISDOM deletado com sucesso!\n');
        console.log('Agora você pode executar a migration novamente:');
        console.log('npx prisma migrate dev --name add_unique_user_id_and_remove_wisdom');

    } catch (error) {
        console.error('❌ Erro ao limpar WISDOM:', error);
        throw error;
    }
}

cleanupWisdom()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
