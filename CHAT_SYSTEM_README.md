# Real-Time Chat System Setup Guide

## Overview
A complete real-time chat system has been added to Express Net Cafe website where customers can chat with admin in real-time.

## Features

### Customer Side:
- ✅ Floating chat widget on homepage
- ✅ Guest users can chat (requires name & email)
- ✅ Logged-in users auto-authenticated
- ✅ Real-time message updates (polls every 3 seconds)
- ✅ Clean, modern chat interface
- ✅ Mobile responsive

### Admin Side:
- ✅ Admin panel for managing all chats
- ✅ View all conversations
- ✅ Unread message notifications
- ✅ Real-time updates (polls every 3-5 seconds)
- ✅ Reply to customers
- ✅ Chat statistics dashboard

## Setup Instructions

### 1. Run Database Migration

First, run the SQL script to create the chat tables:

```bash
# Connect to your PostgreSQL database and run:
psql -U your_username -d your_database -f scripts/setup-chat.sql
```

Or manually execute the SQL:
```sql
-- Run this in your database
\i scripts/setup-chat.sql
```

### 2. Verify Database Tables

Check that these tables were created:
- `chat_sessions` - Stores chat conversations
- `chat_messages` - Stores individual messages

### 3. Test the Chat System

#### As a Customer:
1. Visit homepage (http://localhost:3000)
2. Click the floating chat button (bottom-right)
3. Enter your name and email (if not logged in)
4. Send a message
5. Messages appear instantly

#### As an Admin:
1. Login as admin
2. Go to Admin Panel > Chats
3. See all customer conversations
4. Click on a conversation to view messages
5. Reply to customers
6. Messages sync in real-time

## API Endpoints

### Chat Session
- `POST /api/chat/session` - Create/get chat session
- `GET /api/chat/session?sessionId={id}` - Get session details

### Messages
- `POST /api/chat/messages` - Send a message
- `GET /api/chat/messages?sessionId={id}` - Get all messages
- `PATCH /api/chat/messages` - Mark messages as read

### Admin
- `GET /api/admin/chats` - Get all chat sessions (admin only)

## Database Schema

### chat_sessions
```sql
- id (serial, primary key)
- user_id (integer, nullable) - Linked to users table
- guest_name (varchar) - For non-logged-in users
- guest_email (varchar) - For non-logged-in users
- status (varchar) - 'active' or 'closed'
- last_message_at (timestamp)
- created_at (timestamp)
```

### chat_messages
```sql
- id (serial, primary key)
- session_id (integer) - Links to chat_sessions
- sender_type (varchar) - 'customer' or 'admin'
- sender_id (integer, nullable) - User ID if logged in
- message (text)
- is_read (boolean)
- created_at (timestamp)
```

## How It Works

1. **Customer Opens Chat**: Widget checks if user is logged in
   - Logged in: Creates session with user_id
   - Guest: Asks for name/email, creates session with guest info

2. **Message Sending**: 
   - Customer sends message → Saved to database
   - Admin panel auto-refreshes (polling)
   - Admin replies → Saved to database
   - Customer widget auto-refreshes (polling)

3. **Real-Time Updates**:
   - Customer widget: Polls every 3 seconds
   - Admin panel: Polls every 3-5 seconds
   - Unread counts update automatically

## Customization

### Change Polling Interval
In `chat-widget.tsx`:
```typescript
// Line ~55
pollIntervalRef.current = setInterval(fetchMessages, 3000) // Change 3000 to desired ms
```

In `admin/chat-list.tsx`:
```typescript
// Line ~40
const interval = setInterval(fetchSessions, 5000) // Change 5000 to desired ms
```

### Add Sound Notifications
Add to `chat-widget.tsx` when new message arrives:
```typescript
const playNotificationSound = () => {
  const audio = new Audio('/notification.mp3')
  audio.play()
}
```

### Enable Email Notifications
Add to message POST handler in `/api/chat/messages/route.ts`:
```typescript
// After message is saved
await sendEmailNotification(session.email, message)
```

## Troubleshooting

### Chat widget not showing
- Check browser console for errors
- Verify ChatWidget is imported in page.tsx
- Clear browser cache

### Messages not updating
- Check network tab for API calls
- Verify polling intervals are running
- Check database connection

### Admin can't see chats
- Verify user role is 'admin'
- Check /api/admin/chats endpoint
- Review database permissions

## Future Enhancements

Possible upgrades:
- WebSocket for true real-time (no polling)
- File/image sharing in chat
- Typing indicators
- Push notifications
- Chat history export
- Auto-responses/chatbots
- Chat analytics

## Support

For issues or questions:
1. Check database logs
2. Review browser console
3. Test API endpoints directly
4. Verify user permissions
