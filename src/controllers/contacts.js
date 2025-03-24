import createHttpError from 'http-errors';

import {
  findAllContacts,
  findContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getAllContacts = async (req, res) => {
  try {
    const paginationParams = parsePaginationParams(req.query);
    const sortParams = parseSortParams(req.query);
    const filterParams = parseFilterParams(req.query);
    const { _id: userId } = req.user;

    const contacts = await findAllContacts(
      paginationParams,
      sortParams,
      filterParams,
      userId,
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
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const contact = await findContactById(contactId, userId);

  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createNewContact = async (req, res) => {
  const { _id: userId } = req.user;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = await createContact({ ...req.body, userId, photo: photoUrl });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const updatedContact = await updateContact(
    contactId,
    { ...req.body, photo: photoUrl },
    userId,
  );

  if (!updatedContact) throw createHttpError(404, 'Contact not found');

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

// export const updateContactById = async (req, res) => {
//   try {
//     const { contactId } = req.params;
//     const updatedContact = await updateContact(contactId, req.body);

//     if (updatedContact) {
//       res.status(200).json({
//         status: 200,
//         message: `Successfully updated contact with id ${contactId}!`,
//         data: updatedContact,
//       });
//     } else {
//       res.status(404).json({ message: 'Contact not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const deleteContactById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const deletedContact = await deleteContact(contactId, userId);
  if (!deletedContact) throw createHttpError(404, 'Contact not found');

  res.status(204).send();
};
