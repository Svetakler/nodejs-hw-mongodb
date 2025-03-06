import createError from 'http-errors';

import {
  findAllContacts,
  findContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getAllContacts = async (req, res) => {
  try {
    const paginationParams = parsePaginationParams(req.query);
    const sortParams = parseSortParams(req.query);
    const filterParams = parseFilterParams(req.query);

    const contacts = await findAllContacts(
      paginationParams,
      sortParams,
      filterParams,
    );

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await findContactById(contactId);

    if (contact) {
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNewContact = async (req, res) => {
  try {
    const contact = await createContact(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created contact!',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContactById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, req.body);

    if (updatedContact) {
      res.status(200).json({
        status: 200,
        message: `Successfully updated contact with id ${contactId}!`,
        data: updatedContact,
      });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContactById = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContact(contactId);
  if (!deletedContact) throw createError(404, 'Contact not found');
  res.status(204).send();
};
