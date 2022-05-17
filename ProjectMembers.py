import requests, datetime
import dateutil.parser
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
        theUser["id"] = member[0:indexIdEnds];
        theUser["name"] = member[indexNameBeginns:indexNameEnds];
        
        link = "https://www.wikitree.com/index.php?title=Special:Contributions&l=1&who=" + theUser["id"];
        f = requests.get(link)
        contribPage = f.text;
        beginnOfHistory = "<span class='HISTORY-DATE'>";
        indexDate = contribPage.find(beginnOfHistory) + len(beginnOfHistory)
        indexDateEnd = contribPage.find('</span>', indexDate);
        # print (link)
        # print ( str (indexDate))
        # print ( str (indexDateEnd))
        # print ( contribPage[indexDate:indexDateEnd] )
        theUser["lastEditFormatted"] = contribPage[indexDate:indexDateEnd]
        theUser["lastEdit"] = dateutil.parser.parse(theUser["lastEditFormatted"])
        members.append(theUser)
        print(theUser)
        
        # if len(members) > 5:
            # break
print(str(len(members)))
# sortedMembers = 

f = open("members.htm", "w")
f.write("<html><head></head><body><table>")
for member in sorted(members, key=lambda d: d['lastEdit']):
    f.write("<tr>")
    f.write("<td>")
    f.write('<a href="https://www.wikitree.com/wiki/' + member["id"] + '">' + member["id"] + '</a>')
    f.write("</td>")
    f.write("<td>")
    f.write(member["name"])
    f.write("</td>")
    f.write("<td>")
    f.write( member["lastEditFormatted"])
    f.write("</td>")
    f.write("</tr>")
f.write("</table></body>")
f.close()
    