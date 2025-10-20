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
    revalidatePath('/dashboard/admin-dashboard/messages');
    return { status: 'success', message: 'Message sent successfully' };
  } catch (error: any) {
    console.log('createContact  error:', error);
    return { status: 'error', message: error };
  }
};

interface GetMessagesParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export const getAllContactsMessages = async ({
  page = 1,
  pageSize = 10,
  searchQuery = ''
}: GetMessagesParams = {}) => {
  try {
    await connectToDatabase();
    
    // Build search filter
    const searchFilter = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } },
            { subject: { $regex: searchQuery, $options: 'i' } },
            { message: { $regex: searchQuery, $options: 'i' } }
          ]
        }
      : {};

    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize;

    // Get total count for pagination
    const totalMessages = await Contact.countDocuments(searchFilter);
    
    // Retrieve contact messages with pagination and sorting
    const messages = await Contact.find(searchFilter)
      .sort({ sentAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(pageSize);
    
    const totalPages = Math.ceil(totalMessages / pageSize);
    
    return {
      status: 'success',
      messages: JSON.parse(JSON.stringify(messages)),
      pagination: {
        currentPage: page,
        totalPages,
        totalMessages,
        pageSize
      }
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
