
import { User } from '../types';

const STORAGE_KEY_USERS = 'flashai_users';

export const seedDatabase = () => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY_USERS);
    let users: Record<string, User> = existingData ? JSON.parse(existingData) : {};
    
    const now = Date.now();
    const MONTH_MS = 86400000 * 30;

    // 1. Ensure Admin User exists
    let changed = false;
    if (!users['admin']) {
        users['admin'] = {
            email: 'admin',
            password: '123456', 
            name: 'Administrator',
            role: 'admin',
            preferences: { 
                defaultCount: 50, 
                marketingEmails: false, 
                productUpdates: true,
                dailyStudyReminder: false 
            },
            subscription: { plan: 'pro', status: 'active' },
            createdAt: now - (MONTH_MS * 12),
            generationHistory: [],
            isVerified: true
        } as any;
        changed = true;
    }

    if (changed) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
        console.log('Admin user seeded.');
    }
    
  } catch (e: any) {
    console.error('Error seeding database:', e);
  }
};
