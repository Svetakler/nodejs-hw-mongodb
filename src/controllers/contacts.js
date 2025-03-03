import createError from 'http-errors';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const contacts = await getContacts();
  res
    .status(200)
    .json({ message: 'Contacts retrieved successfully', data: contacts });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) throw createError(404, 'Contact not found');
  res
    .status(200)
    .json({ message: 'Contact retrieved successfully', data: contact });
};

export const createContactController = async (req, res) => {
  const newContact = await createContact(req.body);
  res
    .status(201)
    .json({ message: 'Contact created successfully', data: newContact });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await updateContact(contactId, req.body);
  if (!updatedContact) throw createError(404, 'Contact not found');
  res
    .status(200)
    .json({ message: 'Contact updated successfully', data: updatedContact });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContact(contactId);
  if (!deletedContact) throw createError(404, 'Contact not found');
  res.status(200).json({ message: 'Contact deleted successfully' });
};
