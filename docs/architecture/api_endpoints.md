# API Endpoint Documentation

## Auth Service
- `POST /api/v1/auth/register`: Register a new user.
- `POST /api/v1/auth/login`: Authenticate and return JWT and Refresh Token.
- `POST /api/v1/auth/refresh`: Obtain a new JWT.
- `POST /api/v1/auth/logout`: Invalidate session.
- `POST /api/v1/auth/verify`: Verify email/phone using OTP.

## User Service
- `GET /api/v1/users/me`: Get current user profile.
- `PUT /api/v1/users/me`: Update profile (avatar, bio).
- `GET /api/v1/users/{id}`: Get public profile.
- `POST /api/v1/users/friends/request`: Send friend request.
- `PUT /api/v1/users/friends/accept`: Accept friend request.

## Messaging Service
- `POST /api/v1/messages/send`: Send a message (Text/Media/MiniApp).
- `PUT /api/v1/messages/{id}/edit`: Edit message content.
- `DELETE /api/v1/messages/{id}`: Soft delete a message.
- `POST /api/v1/messages/{id}/react`: Add a reaction to a message.
- `GET /api/v1/messages/history/{groupId}`: Fetch paginated chat history.

## Group Service
- `POST /api/v1/groups/create`: Create new basic/super group.
- `POST /api/v1/groups/{id}/members`: Add users to group.
- `PUT /api/v1/groups/{id}/roles`: Modify user roles (Admin/Moderator).
- `DELETE /api/v1/groups/{id}/members/{userId}`: Kick user.

## Feed / Moments Service
- `POST /api/v1/posts`: Create a new feed post.
- `GET /api/v1/posts/timeline`: Fetch algorithmic feed.
- `POST /api/v1/posts/{id}/like`: Like a post.
- `POST /api/v1/posts/{id}/comments`: Add a comment.

## Wallet & Payment Service
- `GET /api/v1/wallet/balance`: Fetch user balance.
- `POST /api/v1/wallet/transfer`: P2P money transfer.
- `POST /api/v1/wallet/red-packet`: Create a group red packet (gift).
- `GET /api/v1/wallet/transactions`: Fetch transaction history.

## Mini App Platform Service
- `POST /api/v1/miniapps/publish`: Developer endpoint to submit/update an app.
- `GET /api/v1/miniapps/list`: Fetch available store apps.
- `GET /api/v1/miniapps/{id}`: Fetch app metadata and bundle URL.
- `POST /api/v1/miniapps/{id}/install`: Add app to user's launcher.

### Exposed Sandbox Endpoints (For Mini App Engine inside WebView)
- `GET /sandbox/api/user/info`
- `POST /sandbox/api/payment/request`
- `POST /sandbox/api/chat/open`
- `POST /sandbox/api/post/share`
