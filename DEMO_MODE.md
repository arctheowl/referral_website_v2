# Demo Mode Guide

Demo mode allows you to showcase the referral system without requiring a database or any configuration. All data is stored locally in the browser using localStorage.

## 🚀 Quick Start

### Enable Demo Mode

```bash
./scripts/enable-demo-mode.sh
npm run dev
```

That's it! No database setup required.

### Access Demo

1. Visit `http://localhost:3000/demo` to see the flow selector
2. Or navigate directly to any page - demo mode will use mock data automatically

## 🎭 Features

- **No Database Required**: Works completely offline
- **All Flows Available**: Experience every user journey
- **Easy Deployment**: Can be deployed to any static hosting
- **Reset Anytime**: Clear data and start fresh
- **Perfect for Demos**: Show stakeholders the complete system

## 📱 Available Flows

### 1. New User Flow
- Start from eligibility check
- Complete the full process from beginning to end
- Experience the waiting room and selection process

### 2. Selected User
- See what happens when a user is selected
- Complete the referral form
- View submission confirmation

### 3. Not Selected
- Experience the rejection flow
- View resources and waitlist options
- See alternative support information

### 4. Waiting in Queue
- View the waiting room interface
- See countdown timer and queue position
- Experience the queue status

## 🔧 How It Works

Demo mode uses:
- **localStorage**: All data stored in browser
- **Mock Data Utilities**: Client-side data management
- **No Server Actions**: All operations happen client-side
- **Automatic Detection**: Pages automatically use demo mode when enabled

## 📦 Deployment

### Static Deployment (Vercel, Netlify, etc.)

1. Enable demo mode:
   ```bash
   ./scripts/enable-demo-mode.sh
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy - no environment variables needed!

### Environment Variables for Demo

The only required variable is:
```env
DEMO_MODE=true
NEXT_PUBLIC_DEMO_MODE=true
```

No `DATABASE_URL` is needed!

## 🎯 Demo Page

Visit `/demo` to:
- Select different user flows
- Reset all data
- Navigate to different pages
- See session information

## 🔄 Resetting Data

### From Demo Page
Click "Reset All Data" button

### From Browser Console
```javascript
localStorage.removeItem('demo_referral_data');
localStorage.removeItem('referral_session_id');
location.reload();
```

## 📊 Data Storage

All demo data is stored in localStorage under:
- `demo_referral_data`: Mock database data
- `referral_session_id`: Current session identifier

## ⚠️ Important Notes

1. **Browser Only**: Demo mode only works in the browser (client-side)
2. **No Persistence**: Data is cleared when browser storage is cleared
3. **Single User**: Each browser has its own demo data
4. **No Real Submissions**: Form submissions are simulated

## 🆚 Demo Mode vs Testing Mode

| Feature | Demo Mode | Testing Mode |
|---------|-----------|--------------|
| Database Required | ❌ No | ✅ Yes |
| Real Data | ❌ Mock | ✅ Real |
| Deployment | ✅ Easy | ⚠️ Requires DB |
| Use Case | Demos/Showcases | Development/Testing |

## 🐛 Troubleshooting

### Demo mode not working?
1. Check `.env.local` has `DEMO_MODE=true`
2. Restart the dev server
3. Clear browser localStorage
4. Visit `/demo` page to reset

### Data not persisting?
- Demo mode uses localStorage - check browser settings
- Private/Incognito mode may clear data on close
- Some browsers have storage limits

### Pages not loading?
- Ensure demo mode is enabled
- Check browser console for errors
- Try resetting data from `/demo` page

## 📝 Next Steps

1. **Try Different Flows**: Visit `/demo` and try each flow
2. **Customize Data**: Modify mock data in `src/lib/mock-data.ts`
3. **Deploy**: Use the demo mode for stakeholder presentations
4. **Share**: Demo mode is perfect for sharing with non-technical users
