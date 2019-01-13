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

def getpassword(user):
    db = initdb()
    c = db.cursor()

    c.execute("SELECT password FROM users WHERE name = ?", (user, ))
    password = c.fetchone()[0]

    db.close()

    return password

def resetpassword(user, newpass):
    db = initdb()
    c = db.cursor()

    c.execute("UPDATE users SET password = ? WHERE name = ?", (newpass, user))

    db.commit()
    db.close()

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

def deformatmatch(match):
    return match.split(":")

def getpastmatches(user):
    db = initdb()
    c = db.cursor()

    c.execute("SELECT match_history FROM users WHERE name = ?", (user, ))
    match_history = c.fetchone()[0].split(";")
    if match_history[-1] == "" and match_history[0] != "":
        match_history = match_history[0:-1]

    for i in range(len(match_history)):
        currmatch = deformatmatch(match_history[i])
        match_history[i] = {"time": currmatch[2], "chips": int(currmatch[0]), "rank": int(currmatch[1])}

    print(match_history)

    db.close()

    return match_history

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

    c.execute("SELECT current_games FROM users WHERE name = ?", (match, user))
    currmatch = c.fetchone()[0]

    db.close()

    return currmatch

def checkcurrmatch(user):
    db = initdb()
    c = db.cursor()

    c.execute("SELECT current_games FROM users WHERE name = ?", (match, user))
    currmatch = c.fetchone()[0]
    rtrnval = (currmatch != "" and currmatch != None)

    db.close()

    return rtrnval

def clearcurrmatch(user):
    db = initdb()
    c = db.cursor()

    c.execute("UPDATE users SET current_games = ? WHERE name = ?", ("", user))

    db.commit()
    db.close()

def fetchchips(user):
    db = initdb()
    c = db.cursor()

    c.execute("SELECT chips FROM users WHERE name = ?", (user, ))
    chips = c.fetchone()[0]

    db.close()

    return chips