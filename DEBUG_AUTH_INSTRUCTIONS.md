# Authentication Debug Instructions

## Issue: Logged-in name doesn't change after sign-up

### Steps to Debug:

1. **Visit the Debug Page**
   - Navigate to `/debug-auth` in your browser
   - This page shows all authentication data in real-time

2. **Check Console Logs**
   - Open browser Developer Tools (F12)
   - Go to Console tab
   - Look for authentication-related logs

3. **Test the Flow**
   - Sign up with a new name
   - Check if the user data is stored correctly
   - Login with the new credentials
   - See if the name updates in the sidebar

4. **Debug Actions Available**
   - **Debug Auth**: Logs all auth data to console
   - **Clear Auth Data**: Resets all authentication data
   - **Reset Auth Data**: Available in Profile page

### What to Look For:

1. **In Console Logs:**
   - "Creating new user during signup:" - Check if name is correct
   - "Login successful, setting user session:" - Check if correct user is loaded
   - "Loading saved user from localStorage:" - Check if user persists
   - "Sidebar user data:" - Check what the sidebar receives

2. **In Debug Page:**
   - Current User should show your logged-in user data
   - LocalStorage should contain your user data
   - Display Name Logic should show the correct name

### Common Issues:

1. **Demo User Interference**: The app initializes a demo user that might override your data
2. **LocalStorage Conflicts**: Old data might be cached
3. **Fallback Logic**: Sidebar falls back to static userProfile.name if user.name is empty

### Quick Fixes:

1. **Clear All Data**: Use "Clear Auth Data" button
2. **Fresh Start**: Clear browser data for localhost
3. **Check Name Field**: Ensure name field in signup form is not empty

### Files Modified for Debugging:

- `src/contexts/auth-context.tsx` - Added console logs
- `src/components/layout/sidebar-nav.tsx` - Added debug logs and improved name logic
- `src/lib/auth-utils.ts` - Added utility functions
- `src/components/profile/profile-form.tsx` - Added debug buttons
- `src/app/debug-auth/page.tsx` - Debug page to view all data