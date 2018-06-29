
# -*- coding: utf-8 -*-

# Modules:
import pandas as pd

import netCDF4

import numpy as np

Data = open("wind.json", "w")

folder='./'

nc = netCDF4.Dataset('APT.Sewall.4x.EARTH.ATM.nc')

lons = nc.variables['lon'][:]

lats = nc.variables['lat'][:]

# tair = nc.variables['t2m'][:,:,:]

data = nc.variables['u10m'][:,:,:]

data2= nc.variables['v10m'][:,:,:]

# print nc.variables.keys()

# print nc.variables.values()

# cldh = nc.variables['cldh'][:,:,:]

# cldl = nc.variables['cldl'][:,:,:]

# cldm = nc.variables['cldm'][:,:,:]

# evap = nc.variables['evap'][:,:,:]

lati=[]

loni=[]

# t2mi=[]

datai=[]

data2i=[]

# cldhi=[]

# cldli=[]

# cldmi=[]

# evapi=[]

Data.write('[')

for r in range(0,12):

    for j in range(0,96,1):

        for i in range(0,96,1):

            lati.append(float(lats[j]))

            if lons[i] > 180:

                loni.append(float(lons[i])-360)

            else:

                loni.append(float(lons[i]))

         # cldhmoy = round(float(tair[0,j,i]),4)

         # meant2m=round(float(tair[0,j,i]-273.12),4)
         # print (data.shape)
         # meandata=round(float(data[0,j,i]),4)

         # cldlmoy=round(float(cldl[0,j,i]),4)

         # cldmmoy=round(float(cldm[0,j,i]),4)

         # evapmoy=round(float(evap[0,j,i]),10)

         # t2mi.append(meant2m)

         # print(data[0,38,j,i])
         # for e in range (0,12):

         # data2i.append(round((data2[0,38,i,i]),2))

         # datai.append(round((data[0,38,j,i]),2))

            data2i.append(data2[r,j,i])

            datai.append(data[r,j,i])


         # cldhi.append(cldhmoy)

         # cldli.append(cldlmoy)

         # cldmi.append(cldmmoy)

         # evapi.append(evapmoy)

    Data.write('{"header": {"discipline": 0,"disciplineName": "Meteorological products","gribEdition": 2,"gribLength": 131858,"center": 7,"centerName": "US National Weather Service - NCEP(WMC)","subcenter": 0,"refTime": "2014-01-31T00:00:00.000Z","significanceOfRT": 1,"significanceOfRTName": "Start of forecast","productStatus": 0,"productStatusName": "Operational products","productType": 1,"productTypeName": "Forecast products","productDefinitionTemplate": 0,"productDefinitionTemplateName": "Analysis/forecast at horizontal level/layer at a point in time","parameterCategory": 2,"parameterCategoryName": "Momentum","parameterNumber": 2,"parameterNumberName": "U-component_of_wind","parameterUnit": "m.s-1","genProcessType": 2,"genProcessTypeName": "Forecast","forecastTime": 3,"surface1Type": 103,"surface1TypeName": "Specified height level above ground","surface1Value": 10,"surface2Type": 255,"surface2TypeName": "Missing","surface2Value": 0,"gridDefinitionTemplate": 0,"gridDefinitionTemplateName": "Latitude_Longitude","numberPoints": 65160,"shape": 6,"shapeName": "Earth spherical with radius of 6,371,229.0 m","gridUnits": "degrees","resolution": 48,"winds": "true","scanMode": 0,"nx": 96,"ny": 96,"basicAngle": 0,"subDivisions": 0,"lo1": 0,"la1": 90,"lo2": 360,"la2": -90,"dx": 3.75,"dy": 1.875},"data": [')

    for i in range(0,96*96):
        Data.write(str(datai[i]))
        if (i!=96*96-1):
            Data.write(",")

    Data.write(']},')

    Data.write('{"header": {"discipline": 0,"disciplineName": "Meteorological products","gribEdition": 2,"gribLength": 131858,"center": 7,"centerName": "US National Weather Service - NCEP(WMC)","subcenter": 0,"refTime": "2014-01-31T00:00:00.000Z","significanceOfRT": 1,"significanceOfRTName": "Start of forecast","productStatus": 0,"productStatusName": "Operational products","productType": 1,"productTypeName": "Forecast products","productDefinitionTemplate": 0,"productDefinitionTemplateName": "Analysis/forecast at horizontal level/layer at a point in time","parameterCategory": 2,"parameterCategoryName": "Momentum","parameterNumber": 2,"parameterNumberName": "U-component_of_wind","parameterUnit": "m.s-1","genProcessType": 2,"genProcessTypeName": "Forecast","forecastTime": 3,"surface1Type": 103,"surface1TypeName": "Specified height level above ground","surface1Value": 10,"surface2Type": 255,"surface2TypeName": "Missing","surface2Value": 0,"gridDefinitionTemplate": 0,"gridDefinitionTemplateName": "Latitude_Longitude","numberPoints": 65160,"shape": 6,"shapeName": "Earth spherical with radius of 6,371,229.0 m","gridUnits": "degrees","resolution": 48,"winds": "true","scanMode": 0,"nx": 96,"ny": 96,"basicAngle": 0,"subDivisions": 0,"lo1": 0,"la1": 90,"lo2": 360,"la2": -90,"dx": 3.75,"dy": 1.875},"data": [')

    for i in range(0,96*96):
        Data.write(str(data2i[i]))
        if (i!=96*96-1):
            Data.write(",")

    if (r!=11):        
        Data.write(']},')
    else:
        Data.write(']}]')
    datai=[]

   




# mypanda=pd.DataFrame({"lat":lati[:],"lon":loni[:],"t2m":t2mi[:],"precip":precipi[:],"cldh":cldhi[:],"cldl":cldli[:],"cldm":cldmi[:],"evap":evapi[:]})

# mypanda=pd.DataFrame({"":precipi[:]})

# mypanda=mypanda.fillna(999)



# mypanda.reset_index().to_json(orient='records',path_or_buf=folder+'precip.json')
