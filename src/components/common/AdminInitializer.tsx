import { initializeAdmins } from '@/lib/admin-setup';

let hasInitialized = false;

export default async function AdminInitializer() {
  // Run admin initialization only once per server startup
  if (!hasInitialized) {
    hasInitialized = true;
    try {
      await initializeAdmins();
    } catch (error) {
      console.error('Failed to initialize admins:', error);
    }
  }
  
  return null; // This component doesn't render anything
}