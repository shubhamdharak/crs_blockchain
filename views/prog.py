import re

n = int(input())
fnm = []
lnm=[]

if(n<=2 or n>=100):
    print("NA")
else:
    for _ in range(n):
        a = input().split(" ")


        fnm.append(a[0])
        lnm.append(a[1])

    for x in range(n):
        if fnm.count(fnm[x]) > 1:
            print(fnm[x]+" "+lnm[x])
        else:
            print(fnm[x])







