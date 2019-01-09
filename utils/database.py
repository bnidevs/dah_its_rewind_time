import sqlite3

dbfile = "data/userdata.db"

def initdb():
    return sqlite3.connect(dbfile)

def newuser(user, password):
    db = initdb()
    c = db.cursor()

    c.execute("SELECT * FROM users WHERE name = ?", (user, ))
    dupusers = c.fetchall()
    if len(data) > 0:
        return False

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
    if match_history == None:
        c.execute("UPDATE users SET match_history = ? WHERE name = ?", (match, user))
    else:
        c.execute("UPDATE users SET match_history = ? WHERE name = ?", (match_history + match, user))

    db.commit()
    db.close()