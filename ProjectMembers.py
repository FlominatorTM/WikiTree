import requests, datetime
import dateutil.parser

def get_member_users(project):

    link = 'https://www.wikitree.com/index.php?title=Special:Badges&b=' + project + '&limit=5000'
    f = requests.get(link)
    memberPageContent = f.text

    members = []

    # <span class="large"><a href="/wiki/Straub-620" target="_blank" title="">Florian Straub</a></span>

    isFirstRound = True
    for member in memberPageContent.split('class="large"><a href="/wiki/'):
        if isFirstRound == True:
            isFirstRound = False
            continue

        print ("-----------------")
        # print(member)
        theUser = {}
        betweenIdAndName = '" target="_blank">'
        indexIdEnds = member.find(betweenIdAndName)
        indexNameBeginns = indexIdEnds + len(betweenIdAndName)
        afterName = "</a></span>"
        indexNameEnds = member.find(afterName);
        if indexNameBeginns > 0:
            theUser["id"] = member[0:indexIdEnds];
            theUser["name"] = member[indexNameBeginns:indexNameEnds];
            
            
            
            members.append(theUser)
            print(theUser)
            
            # if len(members) > 2:
                # break
        print(str(len(members)))
    return members

def get_member_details(theUser, checkInSubstring):
    link = "https://www.wikitree.com/index.php?title=Special:Contributions&l=1&who=" + theUser["id"];
    f = requests.get(link)
    contribPage = f.text
    beginnOfHistory = "<span class='HISTORY-DATE'>";
    indexDate = contribPage.find(beginnOfHistory) + len(beginnOfHistory)
    indexDateEnd = contribPage.find('</span>', indexDate);
    # print ( contribPage[indexDate:indexDateEnd] )
    theUser["lastEditFormatted"] = contribPage[indexDate:indexDateEnd]
    theUser["lastEdit"] = dateutil.parser.parse(theUser["lastEditFormatted"])
    
    link = 'https://www.wikitree.com/wiki/' + theUser["id"]
    f = requests.get(link)
    userPage = f.text
    
    theUser["check-in-requested"] = checkInSubstring in userPage
    print(theUser)

#pgm
for member in get_member_users("germany"):
    get_member_details(member, "It’s Germany Project check-in time again")
    print(member)




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
    f.write("<td>")
    if member["check-in-requested"]:
        f.write("yes")
    else:
        f.write("no")
    f.write("</td>")
    f.write("</tr>")
f.write("</table></body>")
f.close()
    