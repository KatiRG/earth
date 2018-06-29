
# -*- coding: utf-8 -*-

# Modules:

import netCDF4

import numpy as np

#création du fichier de sortie 
Data = open("cloud.json", "w")

folder='./'
#importation du fichier d'entrée 
nc = netCDF4.Dataset('APT.Sewall.4x.EARTH.ATM.nc')
#création des listes de longitudes, latitude et données 
lons = nc.variables['lon'][:]

lats = nc.variables['lat'][:]

data = nc.variables['cldl'][:,:,:]
#création des listes vides qui vont contenir les données 
lati=[]

loni=[]

datai=[]

Data.write('[')
#remplissage des listes 
for r in range (0,12):

    for j in range(0,96,1):

        for i in range(0,96,1):

            lati.append(float(lats[j]))

            if lons[i] > 180:

                loni.append(float(lons[i])-360)

            else:

                loni.append(float(lons[i]))


            datai.append(data[r,j,i])

            #écriture du header et des données 
            Data.write('{"header":{"nx":96,"ny":96,"la1":90,"la2":-90,"lo1":-180,"lo2":180,"dx":3.75,"dy":1.875},"data":[')

            for f in range(0,96*96):
                Data.write(str(datai[f]))
                if (f!=96*96-1):
                    Data.write(",")

            if (r!=11):        
                Data.write(']},')
            else:
                Data.write(']}]')
                datai=[]


