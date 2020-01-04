import Mail from '../../lib/Mail';

class AnswerMail {
    get key() {
        return 'AnswerMail';
    }

    async handle({ data }) {
        const { helpOrder, answer } = data;
        Mail.sendMail({
            to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
            subject: 'Sua pergunta foi respondida',
            template: 'question_answer',
            context: {
                name: helpOrder.student.name,
                answer,
                question: helpOrder.question,
            },
        });
    }
}

export default new AnswerMail();
