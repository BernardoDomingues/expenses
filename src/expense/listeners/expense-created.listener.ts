import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Expense } from '../entities/expense.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ExpenseCreatedListener {
  constructor(private mailerService: MailerService) {}

  @OnEvent('expense.created')
  async handleExpenseCreatedEvent(expense: Expense) {
    const mail = {
      to: expense.user.email,
      from: process.env.MAIL_USER,
      subject: 'Expense API - Confirmação de Cadastro',
      text: 'Despesa cadastrada com sucesso',
      html: `<table style="width: 100%; border-collapse: collapse;"><thead><tr><th style="background-color: #808080; color: white; padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">ID</th><th style="background-color: #808080; color: white; padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Descrição</th><th style="background-color: #808080; color: white; padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Valor</th><th style="background-color: #808080; color: white; padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Data</th></tr></thead><tbody><tr><td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${expense.id}</td><td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${expense.description}</td><td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">R$ ${expense.value}</td><td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${expense.date}</td></tr></tbody></table>
      `,
    };

    await this.mailerService.sendMail(mail);
  }
}
