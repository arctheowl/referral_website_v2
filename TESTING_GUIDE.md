# Testing Guide - Referral Website V2

This guide explains how to test and showcase all pages of the referral website, and how to configure it for production deployment.

## 🧪 Testing Mode (Showcase All Pages)

### Setup Testing Mode

1. **Run the testing setup script:**
   ```bash
   ./scripts/set-testing-mode.sh
   ```

2. **Copy the testing configuration:**
   ```bash
   cp .env.testing .env.local
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

### Testing Mode Features

- **🔧 Testing Navigation Panel**: Purple gear icon in top-right corner
- **📱 Direct Page Access**: Navigate to any page directly
- **🐛 Debug Information**: Session status, queue position, countdown info
- **🚫 Bypass Restrictions**: Skip user flow validation
- **📊 Admin Access**: Direct access to admin dashboard

### Available Pages in Testing Mode

| Page | URL | Description | Access |
|------|-----|-------------|---------|
| Main Page | `/` | Waiting room with countdown | Always accessible |
| Referral Form | `/referral-form` | Application form | Direct access |
| Not Selected | `/not-selected` | Rejection page with resources | Direct access |
| Submitted | `/submitted` | Confirmation page | Direct access |
| Admin Dashboard | `/admin` | System management | Direct access |
| Debug Page | `/debug` | Debug version without DB | Direct access |
| Minimal Test | `/minimal` | Minimal test page | Direct access |
| Session Test | `/session-test` | Session testing | Direct access |

### Testing Navigation Panel

The testing navigation panel (purple gear icon) provides:

- **Page List**: All available pages with descriptions
- **Current Page Indicator**: Shows which page you're on
- **Environment Info**: Shows current mode (TESTING/DEVELOPMENT)
- **Quick Actions**:
  - Clear Session & Go Home
  - Open Admin in New Tab

## 🚀 Production Mode (Enforced User Flow)

### Setup Production Mode

1. **Run the production setup script:**
   ```bash
   ./scripts/set-production-mode.sh
   ```

2. **Copy the production configuration:**
   ```bash
   cp .env.production .env.local
   ```

3. **Build and start production server:**
   ```bash
   npm run build
   npm start
   ```

### Production Mode Features

- **🔒 Flow Enforcement**: Users must follow correct sequence
- **🚫 No Debug Info**: Clean interface without technical details
- **✅ Session Validation**: Proper session checking required
- **🛡️ Access Control**: Invalid sessions redirected to main page
- **🎯 User Experience**: Focused on end-user journey

### Production User Flow

```
1. User visits main page (/)
   ↓
2. User gets session ID and queue position
   ↓
3. Countdown timer runs
   ↓
4. When countdown completes:
   - First 50 users → /referral-form
   - Others → /not-selected
   ↓
5. After form submission → /submitted
```

### Production Access Rules

| User Status | Allowed Pages | Blocked Pages |
|-------------|---------------|---------------|
| `waiting` | `/` (main page) | All others |
| `selected` | `/referral-form` | All others |
| `rejected` | `/not-selected` | All others |
| `completed` | `/submitted` | All others |
| No session | `/` (redirected) | All others |

## 🛠️ Development Mode (Default)

Development mode is the default when neither testing nor production mode is explicitly set.

### Development Mode Features

- **🔧 Testing Navigation**: Available
- **🐛 Debug Information**: Visible
- **📱 Direct Access**: Allowed
- **⚠️ Flow Warnings**: Some restrictions with warnings

## 📋 Testing Checklist

### Testing Mode Checklist

- [ ] Testing navigation panel appears
- [ ] Can navigate to all pages directly
- [ ] Debug information is visible
- [ ] Session can be cleared and reset
- [ ] Admin dashboard accessible
- [ ] All pages load without errors

### Production Mode Checklist

- [ ] No testing navigation panel
- [ ] No debug information visible
- [ ] User flow is enforced
- [ ] Invalid sessions redirect to main page
- [ ] Only appropriate pages accessible based on user status
- [ ] Clean, professional interface

### Cross-Mode Testing

- [ ] Session persistence works in both modes
- [ ] Database operations function correctly
- [ ] Form submissions work properly
- [ ] Countdown timer functions correctly
- [ ] User selection logic works
- [ ] Admin functions work in both modes

## 🔧 Configuration Files

### Environment Variables

| Variable | Testing Mode | Production Mode | Description |
|----------|--------------|-----------------|-------------|
| `TESTING_MODE` | `true` | Not set | Enables testing features |
| `NODE_ENV` | `development` | `production` | Node environment |
| `DATABASE_URL` | Same as prod | Same as prod | Database connection |

### Configuration Logic

The system uses `src/lib/config.ts` to determine behavior:

```typescript
// Environment detection
const mode = process.env.NODE_ENV === 'production' ? 'production' : 
              process.env.TESTING_MODE === 'true' ? 'testing' : 'development';

// Feature flags
const canAccessPageDirectly = currentConfig.allowDirectPageAccess;
const shouldShowDebugInfo = currentConfig.showDebugInfo;
const shouldShowAllNavigation = currentConfig.showAllNavigation;
```

## 🚨 Troubleshooting

### Common Issues

1. **Testing navigation not appearing**
   - Check `TESTING_MODE=true` in `.env.local`
   - Restart development server

2. **Production flow not enforced**
   - Ensure `TESTING_MODE` is not set in `.env.local`
   - Check `NODE_ENV=production`

3. **Pages not loading**
   - Verify database connection
   - Check console for errors
   - Ensure all dependencies installed

4. **Session issues**
   - Clear browser localStorage
   - Restart server
   - Check database connection

### Debug Commands

```bash
# Check current configuration
grep -E "(TESTING_MODE|NODE_ENV)" .env.local

# Clear session data
localStorage.removeItem('referral_session_id')

# Check database connection
npm run init-db

# View logs
npm run dev 2>&1 | tee logs.txt
```

## 📊 Performance Testing

### Load Testing

1. **Multiple Users**: Test with multiple browser sessions
2. **Session Persistence**: Verify sessions survive page reloads
3. **Database Performance**: Monitor database queries
4. **Memory Usage**: Check for memory leaks

### Security Testing

1. **Session Hijacking**: Attempt to use another user's session
2. **Direct Access**: Try accessing pages without proper flow
3. **Form Duplication**: Attempt multiple form submissions
4. **SQL Injection**: Test form inputs for security

## 🎯 Best Practices

### Testing Mode
- Use for demonstrations and development
- Show all features and capabilities
- Test edge cases and error conditions
- Verify all pages work correctly

### Production Mode
- Deploy only after thorough testing
- Monitor user experience and flow
- Ensure proper session management
- Maintain security and performance

### Development
- Use development mode for regular coding
- Switch to testing mode for demonstrations
- Test in production mode before deployment
- Keep configurations separate and documented
