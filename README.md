# Referral Website V2 - Advanced Queue Management System

A modern, scalable referral system with waiting room functionality, countdown timers, and intelligent queue management to handle high-demand applications while ensuring fair access.

## 🚀 Features

### Core Functionality
- **Waiting Room System**: Users join a virtual waiting room before the referral form opens
- **Countdown Timer**: Visual countdown to when the selection process begins
- **Queue Management**: Automatic handling of the first 50 users with real-time position tracking
- **Smart Selection**: Automatic selection of the first 50 users when the timer expires
- **Rejection Handling**: Graceful handling of non-selected users with resource recommendations

### User Experience
- **Real-time Updates**: Live countdown and queue position updates
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, accessible interface with Tailwind CSS
- **Progress Tracking**: Multi-step form with progress indicators
- **Status Management**: Clear communication of user status throughout the process

### Admin Features
- **Dashboard**: Comprehensive admin panel for system management
- **Timer Control**: Ability to set and adjust countdown timers
- **Queue Management**: Open/close queue and manually trigger user selection
- **Analytics**: View referral applications and waitlist entries
- **Real-time Monitoring**: Live system status and user statistics

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom components
- **Database**: Neon PostgreSQL with serverless connection
- **Icons**: Heroicons for consistent iconography
- **TypeScript**: Full type safety throughout the application

### Database Schema
- `countdown_timer`: Manages countdown timing and status
- `queue_management`: Tracks queue state and user limits
- `user_sessions`: Individual user session tracking
- `referral_applications`: Completed referral forms
- `waitlist`: Users who didn't make the initial selection

## 📁 Project Structure

```
referral_website_v2/
├── src/
│   ├── app/
│   │   ├── actions.ts              # Server actions for database operations
│   │   ├── admin/
│   │   │   └── page.tsx           # Admin dashboard
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Waiting room (main page)
│   │   ├── referral-form/
│   │   │   └── page.tsx           # Referral form for selected users
│   │   ├── not-selected/
│   │   │   └── page.tsx           # Rejection page with resources
│   │   └── submitted/
│   │       └── page.tsx           # Success confirmation page
│   ├── lib/
│   │   └── database.ts            # Database connection and schema
│   └── scripts/
│       └── init-db.ts             # Database initialization script
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- npm or yarn package manager

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd referral_website_v2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=your_neon_database_url_here
   ```

4. **Initialize the database**:
   ```bash
   npm run init-db
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to `http://localhost:3000`

## 🎯 How It Works

### User Journey

1. **Waiting Room**: Users land on the main page and are automatically added to the queue
2. **Countdown**: A visual countdown timer shows when the selection process will begin
3. **Queue Position**: Users can see their position in the queue and total queue size
4. **Selection**: When the timer expires, the first 50 users are automatically selected
5. **Form Access**: Selected users are redirected to the referral form
6. **Rejection**: Non-selected users are shown a rejection page with resources and waitlist option

### Admin Workflow

1. **Set Timer**: Configure when the selection process should begin
2. **Open Queue**: Allow users to join the waiting room
3. **Monitor**: Watch queue growth and system status in real-time
4. **Select Users**: Manually trigger selection or let the timer handle it automatically
5. **Review**: View completed applications and waitlist entries

## 🔧 Configuration

### Queue Settings
- **Max Users**: Configurable limit (default: 50)
- **Timer Duration**: Set countdown duration as needed
- **Queue Status**: Open/closed state management

### Database Configuration
The system uses Neon PostgreSQL with the following key tables:
- Automatic session management
- Real-time queue tracking
- Application form storage
- Waitlist management

## 📊 Admin Dashboard

Access the admin dashboard at `/admin` to:
- Monitor system status
- Manage countdown timers
- Control queue access
- View application statistics
- Review submitted forms
- Manage waitlist entries

## 🎨 Customization

### Styling
- Modify `tailwind.config.ts` for theme customization
- Update component styles in individual page files
- Customize color schemes and branding

### Functionality
- Adjust queue limits in `src/lib/database.ts`
- Modify form fields in `src/app/referral-form/page.tsx`
- Update resource links in `src/app/not-selected/page.tsx`

## 🔒 Security Considerations

- Server-side validation for all form submissions
- Session-based user tracking
- Database connection security
- Input sanitization and validation

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Ensure Node.js 18+ support
- Set `DATABASE_URL` environment variable
- Run `npm run build` for production build
- Use `npm start` for production server

## 📈 Performance

- Serverless database connections for scalability
- Optimized React components with proper state management
- Efficient queue management with minimal database queries
- Real-time updates without excessive polling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is part of the Mustard Seed referral system.

## 🆘 Support

For technical support or questions:
- Check the admin dashboard for system status
- Review server logs for error details
- Contact the development team for assistance

---

**Note**: This is a production-ready system designed to handle high-traffic referral applications with fair queue management and excellent user experience.