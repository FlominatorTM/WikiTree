import requests
link = 'https://www.wikitree.com/index.php?title=Special:Badges&b=germany&limit=5000'
f = requests.get(link)


members = []
# myDict["john"] = "johns value"
# myDict["jeff"] = "jeffs value
memberPageContent = f.text

isFirstRound = True
for member in memberPageContent.split('class="large"><a href="/wiki/'):
    if isFirstRound == True:
        # print("first round")
        isFirstRound = False
        continue
    # print("next round")
    print ("-----------------")
    # print(member)
    theUser = {}
    betweenIdAndName = '" target="_blank">'
    indexIdEnds = member.find(betweenIdAndName)
    indexNameBeginns = indexIdEnds + len(betweenIdAndName)
    afterName = "</a></span>"
    indexNameEnds = member.find(afterName);
    # print (str(indexNameBeginns))
    # print (str(indexNameEnds))
    if indexNameBeginns > 0:
        theUser["ID"] = member[0:indexIdEnds];
        theUser["name"] = member[indexNameBeginns:indexNameEnds];
        
        link = "https://www.wikitree.com/index.php?title=Special:Contributions&l=1&who=" + theUser["ID"];
        f = requests.get(link)
        contribPage = f.text;
        beginnOfHistory = "<span class='HISTORY-DATE'>";
        indexDate = contribPage.find(beginnOfHistory) + len(beginnOfHistory)
        indexDateEnd = contribPage.find('</span>', indexDate);
        # print (link)
        # print ( str (indexDate))
        # print ( str (indexDateEnd))
        # print ( contribPage[indexDate:indexDateEnd] )
        theUser["lastEdit"] = contribPage[indexDate:indexDateEnd]
        members.append(theUser)
        print(theUser)
        print(str(len(members)))
        