import sqlite3

dbfile = "data/userdata.db"

def initdb():
    return sqlite3.connect(dbfile)

def checkuser(user):
    db = initdb()
    c = db.cursor()

    c.execute("SELECT * FROM users WHERE name = ?", (user, ))
    dupusers = c.fetchall()

    db.close()

    return len(dupusers) > 0

def loginuser(user, password):
    db = initdb()
    c = db.cursor()

    c.execute("SELECT * FROM users WHERE name = ? AND password = ?", (user, password))
    creds = c.fetchall()

    db.close()

    return len(creds) > 0

def newuser(user, password):
    db = initdb()
    c = db.cursor()

    c.execute("SELECT * FROM users WHERE name = ?", (user, ))
    dupusers = c.fetchall()
    print(dupusers)

    c.execute("INSERT INTO users VALUES(?,?,?,?,?)", (user, password, 20000, "", ""))

    db.commit()
    db.close()

    return True

def changechips(user, newchips):
    db = initdb()
    c = db.cursor()

    c.execute("UPDATE users SET chips = ? WHERE name = ?", (newchips, user))

    db.commit()
    db.close()

def formatmatchdata(endchips, rank, time):
    return endchips + ":" + rank + ":" + time + ";"

def addpastmatch(user, match):
    db = initdb()
    c = db.cursor()

    c.execute("SELECT match_history WHERE name = ?", (user, ))
    match_history = c.fetchone()
    if match_history == None or match_history == "":
        c.execute("UPDATE users SET match_history = ? WHERE name = ?", (match, user))
    else:
        c.execute("UPDATE users SET match_history = ? WHERE name = ?", (match_history + match, user))

    db.commit()
    db.close()

def formatcurrdata(chips, playername):
    return chips + ":" + playername

def addcurrmatch(user, match):
    db = initdb()
    c = db.cursor()

    c.execute("UPDATE users SET current_games = ? WHERE name = ?", (match, user))

    db.commit()
    db.close()

def readcurrmatch(user):
    db = initdb()
    c = db.cursor()

    c.execute("SELECT current_games WHERE name = ?", (match, user))
    currmatch = c.fetchone()

    db.commit()
    db.close()

    return currmatch

def checkcurrmatch(user):
    db = initdb()
    c = db.cursor()

    c.execute("SELECT current_games WHERE name = ?", (match, user))
    currmatch = c.fetchone()
    rtrnval = (currmatch != "" and currmatch != None)

    db.commit()
    db.close()

    return rtrnval

def clearcurrmatch(user):
    db = initdb()
    c = db.cursor()

    c.execute("UPDATE users SET current_games = ? WHERE name = ?", ("", user))

    db.commit()
    db.close()