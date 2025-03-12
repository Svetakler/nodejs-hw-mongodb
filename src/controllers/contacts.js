import {
  findAllContacts,
  findContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import createError from 'http-errors';

export const getAllContacts = async (req, res) => {
  const paginationParams = parsePaginationParams(req.query);
  const sortParams = parseSortParams(req.query);
  const filterParams = parseFilterParams(req.query);

  const userId = req.user._id;

  const contacts = await findAllContacts(
    paginationParams,
    sortParams,
    filterParams,
    userId,
  );

  res.json(contacts);
  console.log('Authenticated User:', req.user);
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await findContactById(contactId, userId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.json(contact);
};

export const createNewContact = async (req, res) => {
  const userId = req.user._id;

  const newContact = await createContact(req.body, userId);

  res.status(201).json(newContact);
};

export const updateContactById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const updatedContact = await updateContact(contactId, req.body, userId);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.json(updatedContact);
};

export const deleteContactById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const deletedContact = await deleteContact(contactId, userId);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
