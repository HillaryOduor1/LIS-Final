import { ContactRepository } from '../repositories/contact.repository.js';
import { ContactMessageDTO } from '../dtos/request/contactMessage.dto.js';
import { emailService } from '../../../infrastructure/email/email.service.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { logger } from '../../../config/logger.js';
import { config } from '../../../config/env.js';

export class ContactService {
  constructor(contactModel) {
    if (!contactModel) {
      throw new Error('ContactModel is required');
    }
    this.repository = new ContactRepository(contactModel);
  }

  async submitMessage(data, tenantId, tenant) {
    const dto = new ContactMessageDTO(data);
    dto.validate();
    const message = await this.repository.create({ ...dto, tenantId, status: 'unread' });

    logger.info({
      tenantId,
      contactId: message._id,
      email: dto.email,
      name: dto.name,
      ip: data._ip || 'unknown',
    }, 'Contact form submitted successfully');

    // Determine contact email: use tenant.contactEmail if set, else fallback
    const contactEmail = tenant?.contactEmail || config.email.from || config.fallbackContactEmail;
    if (contactEmail) {
      emailService.sendContactNotification(contactEmail, tenant?.name || 'Tenant', dto)
        .catch((err) => logger.error({ err, tenantId, contactEmail }, 'Failed to send contact notification'));
    } else {
      logger.warn({ tenantId }, 'No contact email configured – notification not sent');
    }

    // Send auto-reply to user
    emailService.sendAutoReply(dto.email, dto.name, tenant?.name || 'our team', dto.message)
      .catch((err) => logger.error({ err, email: dto.email }, 'Failed to send auto-reply'));

    return message;
  }
  async markAsRead(id, tenantId) {
    const message = await this.repository.markAsRead(id, tenantId);
    if (!message) throw new AppError('Message not found', 404);
    return message;
  }

  async deleteMessage(id, tenantId) {
    const deleted = await this.repository.delete(id, tenantId);
    if (!deleted) throw new AppError('Message not found', 404);
  }
}
