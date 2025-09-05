# Application definition


import os
from pathlib import Path
from django.core.management.utils import get_random_secret_key

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "^o_4z9rx1v6qo8jz_fr*r%if^-&v9_)0(@!&f((4sdlhv#d#+e"


INSTALLED_APPS = [
    'channels',
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',

    # third-party apps
    'rest_framework',

    # local apps
    'chat',   # we’ll create this app in the next step
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'core.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'core.wsgi.application'


# ...

# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'chatdb',
        'USER': 'chatuser',
        'PASSWORD': 'chatpass',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}


CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}

DEBUG = True

ALLOWED_HOSTS=["localhost", "127.0.0.1"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Default React dev server
    "http://127.0.0.1:3000",  # Alternative React dev server
]

CORS_ALLOW_ALL_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_ALL_ORIGINS = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'



# Channels config (needed later for WebSockets)
ASGI_APPLICATION = "core.asgi.application"


CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}