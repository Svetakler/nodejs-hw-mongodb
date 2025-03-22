import { Contact } from '../models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const findAllContacts = async (
  { page, perPage },
  { sortBy, sortOrder },
  filter,
  userId,
) => {
  const skip = (page - 1) * perPage;

  const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const completeFilter = { ...filter, userId };

  const totalItems = await Contact.countDocuments(completeFilter);

  const contacts = await Contact.find(completeFilter)
    .sort(sortOptions)
    .skip(skip)
    .limit(perPage);

  const paginationData = calculatePaginationData(totalItems, page, perPage);

  return {
    ...paginationData,
    data: contacts,
  };
};

export const findContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (contactData, userId, photoUrl) => {
  return await Contact.create({
    ...contactData,
    userId,
    photo: photoUrl,
  });
};

export const updateContact = async (contactId, updateData, userId) => {
  console.log(
    'Searching for contact with contactId:',
    contactId,
    'and userId:',
    userId,
  );
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true },
  );
};

export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
