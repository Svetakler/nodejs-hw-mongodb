import { Router } from 'express';
import {
  getAllContacts,
  getContactById,
  createNewContact,
  updateContactById,
  deleteContactById,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { contactSchema, contactUpdateSchema } from '../schemas/contact.js';

const router = Router();

router.get('/', getAllContacts);

router.get('/:contactId', isValidId, getContactById);

router.post('/', validateBody(contactSchema), createNewContact);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(contactUpdateSchema),
  updateContactById,
);

router.delete('/:contactId', isValidId, deleteContactById);

export default router;
