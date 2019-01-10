# dah_its_rewind_time - Vincent Chi, Robin Han, Bill Ni, Simon Tsui
# SoftDev1 pd8
# P02: The End

# Used for API access and methods
import json
import random
import requests
import urllib.request as request

from urllib.request import Request


'''
API HELPERS
'''

def fetchInfo(url):
    ''' Returns loaded response '''
    response = requests.get(url)
    info = response.json()
    return info

deckID = "blank"

def newDeck():
    info = fetchInfo("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    global deckID
    deckID = info['deck_id']

newDeck()
    
def draw(num):
    #print(deckID)
    url = "https://deckofcardsapi.com/api/deck/{0}/draw/?count={1}".format(deckID, num)
    #print(url)
    info = fetchInfo(url)
    retList = []
    i = 0
    while ( i < num):
        retList.append(info['cards'][i]['code'])
        i += 1
        
    return retList

    

print("1:", draw(2))
print("2:", draw(2))
print("3:", draw(3))
print("4:", draw(0))
#print(deckID)
