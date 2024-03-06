'use server';

import Contact from '@/database/contact.model';
import { connectToDatabase } from '../mongoose';
import { revalidatePath } from 'next/cache';

interface contactFromParams {
  name: string;
  email: string;
  subject?: string;
  message: string;
  path: string;
}
export const createContact = async (params: contactFromParams) => {
  try {
    await connectToDatabase();
    const { name, email, subject, message, path } = params;
    // create a new contact
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });
    await newContact.save();
    revalidatePath(path);
    return { status: 'success', message: 'Message sent successfully' };
  } catch (error: any) {
    console.log('createContact  error:', error);
    return { status: 'error', message: error };
  }
};

export const getAllContactsMessages = async () => {
  try {
    await connectToDatabase();
    // Retrieve all contact messages from the collection
    const messages = await Contact.find({});
    return {
      status: 'success',
      messages: JSON.parse(JSON.stringify(messages))
    };
  } catch (error: any) {
    console.error('getAllContacts error:', error);
    return { status: 'error', message: error.message };
  }
};

interface IContactMessageDeleteParams {
  id: string;
  path: string;
}

export const deleteContactMessageById = async (
  params: IContactMessageDeleteParams
) => {
  try {
    await connectToDatabase();
    const { id, path } = params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      throw new Error('Job post not found');
    }
    revalidatePath(path);
    return { status: 'success', message: 'Message deleted successfully' };
  } catch (error) {
    console.log('error', error);
  }
};
