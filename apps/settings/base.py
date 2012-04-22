# This is your project's main settings file that can be committed to your
# repo. If you need to override a setting locally, use settings_local.py

from funfactory.settings_base import *

# Bundles is a dictionary of two dictionaries, css and js, which list css files
# and js files that can be bundled together by the minify app.
MINIFY_BUNDLES = {
    'css': {
        'app': (
            'css/app/style.css',
            'css/app/main.css',
        ),
        'project': (
            'css/project/pontoon.css',
        ),
    },
    'js': {
        'app': (
            'js/app/script.js',
            'js/app/main.js',
        ),
        'project': (
            'js/project/pontoon.js',
        ),
    }
}

# Defines the views served for root URLs.
ROOT_URLCONF = 'apps.urls'

INSTALLED_APPS = list(INSTALLED_APPS) + [
    # Application base, containing global templates.
    'apps.base',
    'apps.pontoon',
    'django.contrib.admin', 
    'django_browserid',
]

# Add BrowserID as authentication backend
AUTHENTICATION_BACKENDS = (
    'django_browserid.auth.BrowserIDBackend',
    'django.contrib.auth.backends.ModelBackend',
)

TEMPLATE_CONTEXT_PROCESSORS += (
    'django_browserid.context_processors.browserid_form',
)

# Required for BrowserID. Very important security feature
SITE_URL = 'http://localhost:8000'

LOGIN_REDIRECT_URL = '/'

# Instruct session-csrf to always produce tokens for anonymous users
ANON_ALWAYS = True

# Because Jinja2 is the default template loader, add any non-Jinja templated
# apps here:
JINGO_EXCLUDE_APPS = [
    'admin',
    'registration',
]

# Tells the extract script what files to look for L10n in and what function
# handles the extraction. The Tower library expects this.

# # Use this if you have localizable HTML files:
# DOMAIN_METHODS['lhtml'] = [
#    ('**/templates/**.lhtml',
#        'tower.management.commands.extract.extract_tower_template'),
# ]

# # Use this if you have localizable HTML files:
# DOMAIN_METHODS['javascript'] = [
#    # Make sure that this won't pull in strings from external libraries you
#    # may use.
#    ('media/js/**.js', 'javascript'),
# ]

LOGGING = dict(loggers=dict(playdoh = {'level': logging.DEBUG}))
