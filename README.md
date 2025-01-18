## React(Vite) + Django Chat Application

An interactive, real-time chat application built with React for the front-end and Django for the back-end, featuring Google Authentication for secure login.
## Features
Features
- 🔒 Secure Google Authentication: Easy login using Google OAuth2.
- 💬 Real-time Chat: Send and receive messages instantly with WebSocket technology.
- 👥 User Management: Manage user accounts and authentication seamlessly.
- 🎨 Responsive Design: Mobile-friendly and Basic UI.
- ⚡ Scalable Backend: Powered by Django and Django Channels for asynchronous communication.


## Install (method 1 )

Creating Virtual Environment:

```sh
$ python -m venv env
$ source env/bin/activate
```
Django Setup:

```sh
$ cd backend
$ pip install requirements.txt
```
React + Vite  Setup:
```sh
$ cd frontend
$ npm install 
```
## Usage
```sh
$ cd frontend
$ npm run dev

```
```sh
$ cd backend
$ py manage.py createsuperuser
$ py manage.py runserver
```

## **Method 2 - using Docker**
**usage**
```sh
$ cd backend
$ py manage.py createsuperuser
$ cd ..
$ docker-compose up --build
```

If this project helped you, please ⭐ the repository and follow for more updates..!

