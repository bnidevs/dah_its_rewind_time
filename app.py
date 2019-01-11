# dah_its_rewind_time - Robin Han, Bill Ni, Simon Tsui, Vincent Chi
# SoftDev1 pd8

import os
import random
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

from flask import Flask, redirect, url_for, render_template, session, request, flash, get_flashed_messages

from utils import database, api


# instantiate Flask object
app = Flask(__name__)
app.secret_key = os.urandom(32)

# manage cookies and user data here
user = None

def setUser(userName):
    global user
    user = userName


@app.route('/')
def home():
    if user in session:
        return render_template('login.html', username = user, errors = True, logged_in = True)
    return render_template('index.html', username = "", errors = True, logged_in = False)

@app.route('/register')
def register():
    if user in session:
        return redirect(url_for('home'))
    return render_template('register.html',username = "", logged_in=False)

@app.route('/login', methods=['POST'])
def login():
    if user in session:
        return redirect(url_for('home'))
    return render_template('login.html',username = "", logged_in=False)

@app.route('/authenticate', methods=['POST'])
def authenticate():
    if user in session:
        return redirect(url_for('home'))
    # instantiates DB_Manager with path to DB_FILE
    username, password, curr_page = request.form['username'], request.form['password'], request.form['address']
    print(curr_page)
    # LOGGING IN
    if request.form["submit"] == "Login":
        if username != "" and password != "" and database.loginuser(username, password):
            session[username] = password
            setUser(username)
            flash('Successfully logged in!')
            return redirect(curr_page)
        else:
            flash('Incorrect credentials!')
        return redirect(curr_page)
    # REGISTERING
    else:
        if len(username.strip()) != 0 and not database.checkuser(username):
            if len(password.strip()) != 0:
                # add account to DB
                database.newuser(username, password)
                flash('Successfully registered account for user  "{}"'.format(username))
                return redirect(url_for('home'))
            else:
                flash('Password length insufficient')
        elif len(username) == 0:
            flash('Username length insufficient')
        else:
            flash('Username already taken!')
        # Try to register again
        return render_template('register.html', username = "", errors = True)

@app.route('/logout')
def logout():
    '''
    Logs user out
    '''
    curr_page = request.args['address']
    session.pop(user, None)
    setUser(None)
    flash('Successfully logged out!')
    return redirect(curr_page)

#@app.route('/about')
#def about():
#    return render_template('about.html')

#@app.route('/contact')
#def contact():
#    pass

@app.route('/profile')
def profile():
    if user in session:
        return render_template('profile.html', logged_in = True)
    return render_template('index.html', errors = True, logged_in = False)

if __name__ == '__main__':
    app.debug = True
    app.run()
