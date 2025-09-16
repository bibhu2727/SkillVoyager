// Initialize demo user for testing
export function initializeDemoUser() {
  if (typeof window !== 'undefined') {
    const existingUsers = JSON.parse(localStorage.getItem('skillvoyager_users') || '[]');
    
    // Check if demo user already exists
    const demoExists = existingUsers.find((user: any) => user.email === 'demo@skillvoyager.com');
    
    if (!demoExists) {
      const demoUser = {
        id: 'demo-user-1',
        name: 'Demo User',
        email: 'demo@skillvoyager.com',
        password: 'demo123',
        avatar: 'https://picsum.photos/100/100?random=demo'
      };
      
      existingUsers.push(demoUser);
      localStorage.setItem('skillvoyager_users', JSON.stringify(existingUsers));
    }
  }
}

// Call this function when the app loads
if (typeof window !== 'undefined') {
  initializeDemoUser();
}