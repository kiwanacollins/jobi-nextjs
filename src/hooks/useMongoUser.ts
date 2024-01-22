import { getUserById } from '@/lib/actions/user.action';
import { useState, useEffect } from 'react';

export async function useMongoUser(userId: string) {
  const mongoUser = await getUserById({ userId });
  return mongoUser;
}
