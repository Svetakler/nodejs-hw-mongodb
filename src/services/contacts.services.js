import { Contact } from '../models/contact.model.js';

export const findAllContacts = async () => {
  return await Contact.find({});
};

export const findContactById = async (contactId) => {
  return await Contact.findById(contactId);
};
