import { Contacts } from '../models/contacts.js';

export const getContacts = async () => {
  return await Contacts.find();
};

export const getContactById = async (contactId) => {
  return await Contacts.findById(contactId);
};

export const createContact = async (payload) => {
  return await Contacts.create(payload);
};

export const updateContact = async (contactId, payload) => {
  return await Contacts.findOneAndUpdate({ _id: contactId }, payload, {
    new: true,
  });
};

export const deleteContact = async (contactId) => {
  return await Contacts.findOneAndDelete({ _id: contactId });
};
