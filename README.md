# Trip Planner Application

A full-stack trip planning application built with Django, PostgreSQL, React, Nginx, and Docker.

## Features
- Create and manage trips
- Add activities and itineraries
- Track expenses
- Manage packing checklists
- View statistics and dashboard
- Beautiful responsive UI

## Quick Start

1. Make sure Docker and Docker Compose are installed
2. Run: `docker-compose up --build`
3. Access the app at http://localhost:8080
4. Backend API at http://localhost:8080/api
5. Django Admin at http://localhost:8080/admin

## Create Superuser
docker-compose exec backend python manage.py createsuperuser

## Technologies
- Backend: Django 4.2, DRF, PostgreSQL
- Frontend: React 18, React Router, Axios, React Icons
- Server: Nginx, Gunicorn
- Container: Docker, Docker Compose
