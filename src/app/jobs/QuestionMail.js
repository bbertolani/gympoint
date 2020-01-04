import Mail from '../../lib/Mail';

class AnswerMail {
    get key() {
        return 'QuestionMail';
    }

    async handle({ data }) {
        const { studentExist, question } = data;
        Mail.sendMail({
            to: `${studentExist.name} <${studentExist.email}>`,
            subject: 'Sua pergunta foi enviado com sucesso',
            template: 'question_sent',
            context: {
                name: studentExist.name,
                question,
            },
        });
    }
}

export default new AnswerMail();
