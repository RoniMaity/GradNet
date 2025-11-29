# GradNet

## 1. Project Title & Overview
**App Name:** GradNet  
**Purpose:** A platform designed to connect college students with alumni for networking, mentorship, and discussions.  

The goal is to help students seek career guidance, internship opportunities, and professional advice, while also enabling alumni to stay engaged with their alumni community.

---

## 2. Key Features / Modules

### 1. User Authentication & Profiles
- Sign Up / Login for students and alumni  
- Email verification  
- Profile management (Name, College, Degree, Graduation Year, Work Experience, Skills, Achievements, Profile Picture)  
- Privacy settings for posts and connections 

### 2. Home Feed (Like Twitter/LinkedIn)
- Create and view posts with text, images, and links  
- Like, comment, and share functionality  
- Follow/unfollow users with a personalized feed  
- Search posts by user, hashtag, or keyword  

### 3. Connections
- Send, accept, or reject connection requests

### 4. Circles (Groups)
- Create and join circles (e.g., department, batch, or interest-based)  
- Post and comment within circles  
- Membership and join-request management  

### 5. Notifications
- Event-driven notifications for:
  - Connection requests  
  - Likes/comments on posts  
  - Circle invites

### 6. Profile Page
- Display personal and professional information  
- Show the user’s posts, connections, and circles  

### 7. Admin Panel
- Manage users, circles, and reported posts  

---

## 3. User Roles

| Role | Permissions |
|------|--------------|
| **Student** | Create profile, connect with alumni, post content, and join circles|
| **Alumni** | All student permissions, plus create mentorship circles and guide students |
| **Admin** | Manage users, moderate posts, oversee circles, and handle reports |

---

## 4. Page / Screen List (Frontend)
- Landing Page  
- Login / Register Page  
- Home Feed Page  
- Profile Page  
- Connections
- Circles Page  
- Notifications Page  
- Admin Dashboard

---

## 5. Database Schema

### Users
- user_id (PK)  
- name  
- gender  
- email  
- isAlumni (boolean)  
- grad_year  
- college_id (FK → Colleges.college_id)  
- profile_img_url  
- created_at  

---

### Followers  
(Handles many-to-many follow relationships)
- follower_id (FK → Users.user_id)  
- followed_id (FK → Users.user_id)  
- **Primary Key:** (follower_id, followed_id)  

---

### Experience
- experience_id (PK)  
- user_id (FK → Users.user_id)  
- job_title  
- company_name  
- duration  
- description  

---

### Colleges
- college_id (PK)  
- college_name  
- location  

---

### Circles
- circle_id (PK)  
- circle_name  
- owner_id (FK → Users.user_id)  
- college_id (FK → Colleges.college_id)  

---

### Posts
- post_id (PK)  
- user_id (FK → Users.user_id, nullable if posted by circle)  
- circle_id (FK → Circles.circle_id, nullable if posted by user)  
- caption  
- content  
- img_url  
- likes_count  
- created_at  

---

### PostLikes
- user_id (FK → Users.user_id)  
- post_id (FK → Posts.post_id)  
- **Primary Key:** (user_id, post_id)  

---

### Relationships Summary
- Users —< Followers >— Users  
- Users —< Experience  
- Users —< Posts >— Circles  
- Users —< Circles  
- Users —< UserColleges >— Colleges  
- Posts —< PostLikes >— Users  

---

## 6. Tech Stack (Tentative)
- **Frontend:** React.js, Redux (optional)  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL/MongoDB/MySQL
- **Authentication:** JWT, bcrypt  
- **Hosting/Deployment:** Vercel/Heroku for frontend, AWS/Heroku for backend  

---

## 7. Workflow
1. User registers as a student or alumnus and logs in.  
2. Sets up profile and explores the feed.  
3. Users post, like, comment, and follow others.  
4. Students can connect and chat with alumni.  
5. Users can create or join circles to discuss specific topics.  
6. Admin moderates posts and manages reported content.  

---

## 8. Expected Outcomes
- A fully functional full-stack web application connecting students and alumni.  
- Core features: authentication, profile management, posting, connections.  
- Optional features: admin panel and notifications.
- Final deployment accessible online via Vercel/Heroku.  

---
