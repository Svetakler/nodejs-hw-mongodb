import { Contact } from '../models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const findAllContacts = async (
  { page, perPage },
  { sortBy, sortOrder },
  filter,
) => {
  const skip = (page - 1) * perPage;

  const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const totalItems = await Contact.countDocuments(filter);

  const contacts = await Contact.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(perPage);

  const paginationData = calculatePaginationData(totalItems, page, perPage);

  return {
    ...paginationData,
    data: contacts,
  };
};

export const findContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

export const updateContact = async (contactId, updateData) => {
  return await Contact.findByIdAndUpdate(contactId, updateData, { new: true });
};

export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
