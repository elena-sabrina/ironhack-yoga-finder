VIEW

- Home/Intro

- Sign In
- Sign Up
- Profle
- Edit Profile

- Search
- Class Detail

ROUTES

GET - '/' - Home view

GET - '/authentication/sign-up' - Displays teacher registration form
POST - '/authentication/sign-up' - ❗Handle teacher registration requests
GET - '/authentication/sign-in' - Displays sign in form
POST - '/authentication/sign-in' - ❗Handle sign in requests
POST - '/authentication/sign-out' - ❗Handle sign out request

GET - '/profile' - 🔐 Displays the profile of the currently authenticated teacher
GET - '/profile/edit' - 🔐 Displays profile editing form of the currently authenticated teacher
POST - '/profile/edit' - 🔐 ❗Handle teacher editing in requests
POST - '/profile/delete' - 🔐 ❗Handle teacher deletion in requests

GET - '/yoga/index' - Displays all yoga classes in form
POST - '/yoga/...' - search??? ❗
GET - '/yoga/detailpage' - Displays details of specific yoga class
GET - '/yoga/create' - 🔐 Displays yoga class creation form
POST - '/yoga/create' - 🔐 ❗Handle yoga class creation requests

USER MODEL

Teacher

- Username
- Email
- Password

Class

- Name
- Date
- Time
- Teacher
- Place
- Type
