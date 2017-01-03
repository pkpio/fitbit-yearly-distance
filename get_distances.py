#!/usr/bin/env python3
"""
This script would get the cummulative distance covered by user while doing selected
activity types over the current calender year (2017). I created this to keep track of
my progress towards yearly goal of 1000 KMs cummulative. 

__author__ = "Praveen Kumar Pendyala"
__email__ = "mail@pkp.io"
"""
import fitbit
from fitbit.exceptions import HTTPTooManyRequests
import time
from datetime import timedelta, date, datetime
import json

########################   PARAMETERS - update to your taste ##########################
TRACKED_ACTIVITIES = ('Run','Running') # update this for more activity types if required
START_DATE = "2016-10-01" # Tracking from start of 2017
############################### END OF PARAMETERS #######################################

FITBIT_API_URL = 'https://api.fitbit.com/1'
fitbitCredsFile = "fitbit.json"

def ReadFromFitbit(api_call, *args, **kwargs):
	"""Peforms a read request from Fitbit API. The request will be paused if API rate limiting has 
	been reached!

	api_call -- api method to call
	args -- arguments to pass for the method
	"""
	# res_url,date_stamp,detail_level
	try:
	 	resp = api_call(*args,**kwargs)
	except HTTPTooManyRequests as e:
		print('')
		print('-------------------- Fitbit API rate limit reached -------------------')
		retry_time = datetime.now()+timedelta(seconds=e.retry_after_secs)
		print('Will retry at {}'.format(retry_time.strftime('%H:%M:%S')))
		print('')
		time.sleep(e.retry_after_secs)
		resp = ReadFromFitbit(api_call,*args,**kwargs)
	return resp


def CummDistanceOfFitbitActivities(start_date='', callurl=None):
	"""
	Get cummulative distances from activities data starting from a given day from Fitbit

	start_date -- timestamp in yyyy-mm-dd format of the start day
	callurl -- url to fetch activities from (optional)
	"""
	# Fitbit activities list endpoint is in beta stage. It may break in the future and not directly supported
	# by the python client library.
	if not callurl:
		callurl = '{}/user/-/activities/list.json?afterDate={}&sort=asc&offset=0&limit=20'.format(FITBIT_API_URL,start_date)
	activities_raw = ReadFromFitbit(fitbitClient.make_request, callurl)
	activities = activities_raw['activities']

	cumm_distance = [];
	for activity in activities:
		# Only interested in activities of certain types
		if activity['activityName'] not in TRACKED_ACTIVITIES: 
			continue

		# accumulate distance so far
		day_dist = (activity['startTime'],activity['distance'],activity['distanceUnit'])
		cumm_distance.append(day_dist);

	if activities_raw['pagination']['next'] != '':
	 	cumm_distance.extend(CummDistanceOfFitbitActivities(callurl=activities_raw['pagination']['next']))

	return cumm_distance


# Get a fitbit client to make requests
credentials = json.load(open(fitbitCredsFile))  
fitbitClient = fitbit.Fitbit(**credentials)

# Get cummulative distance and save to file
cumm_distance = CummDistanceOfFitbitActivities(START_DATE)
print(cumm_distance)
json.dump(cumm_distance, open('distance.txt','w'))

# Save updated fitbit credentails
credentials = json.load(open(fitbitCredsFile)) 
for t in ('access_token', 'refresh_token'):
	credentials[t] = fitbitClient.client.token[t]
json.dump(credentials, open(fitbitCredsFile, 'w'))


