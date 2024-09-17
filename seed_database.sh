#!/bin/bash

rm db.sqlite3
rm -rf ./raterapi/migrations
python3 manage.py migrate
python3 manage.py makemigrations raterapi
python3 manage.py migrate raterapi
python3 manage.py loaddata users
python3 manage.py loaddata tokens
python3 manage.py loaddata games
python3 manage.py loaddata playerimage
python3 manage.py loaddata playerratings
python3 manage.py loaddata playerreviews
python3 manage.py loaddata categories
python3 manage.py loaddata gamecategory