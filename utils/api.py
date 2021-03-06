# dah_its_rewind_time - Robin Han, Bill Ni, Simon Tsui, Vincent Chi
# SoftDev1 pd8
# P02: NewYorkHoldEm

# Used for API access and methods
import json
import random
#import requests
import urllib.request as request

from urllib.request import Request

'''
LIST OF KEYS
'''
'''
key0 = open('key0.txt', 'r')
key1 = open('key1.txt', 'r')
key2 = open('key2.txt', 'r')
movieDB_key = key0.readline().strip()
showtimes_key = key1.readline().strip()
ipStack_key = key2.readline().strip()
key0.close()
key1.close()
key2.close()
'''

'''
API HELPERS
'''

def fetchInfo(url):
    ''' Returns loaded response '''
    response = request.urlopen(url)
    response = response.read()
    info = json.loads(response)
    return info

