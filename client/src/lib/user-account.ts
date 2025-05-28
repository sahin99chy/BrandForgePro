// User account and subscription management

export interface UserSubscription {
  type: 'none' | 'monthly' | 'annual';
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  subscription: UserSubscription;
  unlockedTemplates: string[];
  credits: number;
  referralCode: string;
  referralCount: number;
}

// Default user state (not logged in)
const defaultUserState: UserAccount | null = null;

// Local storage key for user data
const USER_STORAGE_KEY = 'brandforge_user';
const UNLOCKED_TEMPLATES_KEY = 'unlockedTemplates';

// Get current user from local storage
export function getCurrentUser(): UserAccount | null {
  try {
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    return userData ? JSON.parse(userData) : defaultUserState;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return defaultUserState;
  }
}

// Save user to local storage
export function saveUser(user: UserAccount): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user:', error);
  }
}

// Check if user is logged in
export function isLoggedIn(): boolean {
  return !!getCurrentUser();
}

// Check if user has an active subscription
export function hasActiveSubscription(): boolean {
  const user = getCurrentUser();
  return user ? user.subscription.isActive : false;
}

// Check if a template is unlocked for the current user
export function isTemplateUnlocked(templateId: string): boolean {
  // First check local storage for individual template purchases
  try {
    const unlockedTemplates = localStorage.getItem(UNLOCKED_TEMPLATES_KEY);
    const unlocked = unlockedTemplates ? JSON.parse(unlockedTemplates) : [];
    if (unlocked.includes(templateId)) {
      return true;
    }
  } catch (error) {
    console.error('Failed to check unlocked templates:', error);
  }
  
  // Then check if user has a subscription
  const user = getCurrentUser();
  if (user && user.subscription.isActive) {
    return true;
  }
  
  // Finally check if the template is in the user's unlocked templates
  return user ? user.unlockedTemplates.includes(templateId) : false;
}

// Unlock a template for the current user
export function unlockTemplate(templateId: string): void {
  try {
    // First try to add to user account if logged in
    const user = getCurrentUser();
    if (user) {
      if (!user.unlockedTemplates.includes(templateId)) {
        user.unlockedTemplates.push(templateId);
        saveUser(user);
      }
      return;
    }
    
    // Otherwise store in local storage
    const unlockedTemplates = localStorage.getItem(UNLOCKED_TEMPLATES_KEY);
    const unlocked = unlockedTemplates ? JSON.parse(unlockedTemplates) : [];
    if (!unlocked.includes(templateId)) {
      unlocked.push(templateId);
      localStorage.setItem(UNLOCKED_TEMPLATES_KEY, JSON.stringify(unlocked));
    }
  } catch (error) {
    console.error('Failed to unlock template:', error);
  }
}

// Get user's credits
export function getUserCredits(): number {
  const user = getCurrentUser();
  return user ? user.credits : 0;
}

// Add credits to user account
export function addCredits(amount: number): void {
  const user = getCurrentUser();
  if (user) {
    user.credits += amount;
    saveUser(user);
  }
}

// Use credits to unlock a template
export function useCreditsForTemplate(templateId: string, creditCost: number): boolean {
  const user = getCurrentUser();
  if (user && user.credits >= creditCost) {
    user.credits -= creditCost;
    if (!user.unlockedTemplates.includes(templateId)) {
      user.unlockedTemplates.push(templateId);
    }
    saveUser(user);
    return true;
  }
  return false;
}

// Generate a referral code for the user
export function generateReferralCode(): string {
  return `BF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

// Process a successful referral
export function processReferral(referralCode: string): boolean {
  const user = getCurrentUser();
  if (user && user.referralCode === referralCode) {
    user.referralCount += 1;
    user.credits += 2; // Give 2 credits for each referral
    saveUser(user);
    return true;
  }
  return false;
}
