import { requireTeacher } from '../../utils/authorization';
import { Context } from '../../graphql/context';

/**
 * Resolvers exclusivos para Teacher
 * Todas as queries/mutations aqui requerem role TEACHER
 */
export const teacherResolvers = {
    Query: {
        /**
         * Lista quizzes criados pelo professor
         * Retorna dados mockados por enquanto
         */
        myQuizzes: async (_: unknown, __: unknown, context: Context) => {
            requireTeacher(context);

            // Dados mockados - futuramente buscar do banco
            return [
                {
                    id: '1',
                    title: 'Quiz de Matemática - Álgebra',
                    createdBy: context.user!.id,
                    questionCount: 10,
                    createdAt: new Date().toISOString(),
                },
                {
                    id: '2',
                    title: 'Quiz de História - Brasil Colonial',
                    createdBy: context.user!.id,
                    questionCount: 15,
                    createdAt: new Date().toISOString(),
                },
            ];
        },

        /**
         * Estatísticas dos alunos (para o professor)
         */
        myStudentsStats: async (_: unknown, __: unknown, context: Context) => {
            requireTeacher(context);

            // Mockado por enquanto
            return {
                totalStudents: 25,
                activeStudents: 20,
                averageScore: 75.5,
            };
        },
    },
};
