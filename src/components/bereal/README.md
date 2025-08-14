# BeReal Obozowy - Frontend Implementation

This directory contains the frontend implementation for the BeReal camp feature, allowing students to share daily photos from their camp activities.

## Features

### Core Functionality
- **Daily Photo Sharing**: Users can post one photo per day when BeReal is active
- **Social Feed**: View posts from all camp participants in chronological order
- **Automatic Late Marking**: Posts submitted after the deadline are marked as "late"
- **Real-time Status**: Shows when BeReal is active and when users can post

### Social Features
- **Like/Unlike**: Users can like and unlike posts
- **Photo Download**: Save photos as keepsakes
- **Profile Views**: See individual user profiles with their post history
- **Content Moderation**: Report inappropriate posts to admins

### UI/UX Features
- **Camera Integration**: Take photos or choose from gallery
- **Photo Preview**: Preview photos before posting
- **Status Indicators**: Visual indicators for BeReal activity
- **Responsive Design**: Works on mobile and desktop
- **Beautiful Animations**: Smooth transitions and loading states

## File Structure

```
src/
├── components/bereal/
│   ├── BerealPost.vue          # Individual post display component
│   ├── BerealStatus.vue        # BeReal status indicator
│   ├── BerealUploadButton.vue  # Photo upload functionality
│   └── ProfileInfo.vue         # User profile information
├── views/
│   ├── BerealView.vue          # Main BeReal feed
│   └── BerealProfileView.vue   # User profile page
└── stores/
    └── bereal.js               # Pinia stores for BeReal data
```

## API Integration

The frontend is ready for backend integration with the following expected endpoints:

### Core Endpoints
- `GET /api2/bereal/status/` - Get current BeReal status
- `GET /api2/bereal/posts/` - Get posts feed with pagination
- `POST /api2/bereal/posts/` - Upload new photo
- `DELETE /api2/bereal/posts/{id}/` - Delete post

### Social Endpoints
- `POST /api2/bereal/posts/{id}/like/` - Like a post
- `POST /api2/bereal/posts/{id}/unlike/` - Unlike a post
- `POST /api2/bereal/posts/{id}/report/` - Report inappropriate content

### Profile Endpoints
- `GET /api2/bereal/profile/{id}/` - Get user profile
- `GET /api2/bereal/profile/{id}/posts/` - Get user's posts

## Navigation

BeReal is accessible via:
- Bottom navigation tab (camera icon)
- Home screen status card (when active)
- Direct route: `/bereal`

## Usage

1. **When BeReal is Active**: Users see a prominent status card and can upload photos
2. **Viewing Feed**: Scroll through posts, like them, or report inappropriate content
3. **Profile Views**: Tap on user avatars to see their profile and post history
4. **Photo Management**: Download photos for keepsakes or delete your own posts

## Design

The BeReal feature follows the existing app design patterns:
- Consistent color scheme with theme variables
- Ionic Vue components for native feel
- Gradient backgrounds for active states
- Smooth animations and transitions
- Responsive layouts

## Backend Requirements

For full functionality, the backend needs to implement:
- User authentication (already exists)
- Photo upload and storage
- Post management with daily limits
- Like/unlike tracking
- Content moderation system
- Push notifications for BeReal times