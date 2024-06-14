FROM python:3.9.18-alpine3.18

# Install necessary build tools and dependencies
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev

# Set environment variables
ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

ENV FLASK_APP=$FLASK_APP
ENV FLASK_ENV=$FLASK_ENV
ENV DATABASE_URL=$DATABASE_URL
ENV SCHEMA=$SCHEMA
ENV SECRET_KEY=$SECRET_KEY

# Set the working directory
WORKDIR /var/www

# Copy and install dependencies
COPY requirements.txt .

RUN pip install pipenv
RUN pip install -r requirements.txt
RUN pip install psycopg2

# Copy the application code
COPY . .

# Ensure the necessary modules are available
RUN pipenv install --deploy --system

# Initialize and run database migrations
RUN if [ ! -d "migrations" ]; then pipenv run flask db init; fi  # Ensure migrations are initialized only if the directory does not exist
RUN pipenv run flask db migrate -m "init"
RUN pipenv run flask db upgrade

# Run the seeding script (added this step)
RUN pipenv run python path/to/your/seeding_script.py

# Start the application
CMD ["gunicorn", "--worker-class", "eventlet", "-w", "1", "app:app"]
