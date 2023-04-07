import requests
import dateutil.parser

from datetime import datetime 
from dateutil.relativedelta import relativedelta 

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
            # print(theUser)
            
            # if len(members) > 2:
                # break
        print(str(len(members)))
    return members

def check_edit_history(theUser):
    link = "https://www.wikitree.com/index.php?title=Special:Contributions&l=500&who=" + theUser["id"];
    f = requests.get(link)
    contribPage = f.text
    
    beginnOfHistory = "<span class='HISTORY-DATE'>"
    contribPageParts = contribPage.split(beginnOfHistory)
    
    now = datetime.now()
    six_months_ago = now + relativedelta(months=-6)
    
    any_edit = False
    dayNum = 0
    for oneDay in contribPageParts[1:] :
        # print(oneDay)
        "<span class='HISTORY-ITEM'>"
        dayNum+=1
        indexDateEnd = oneDay.find('</span>');
        # print (oneDay)
        # print ( contribPage[indexDate:indexDateEnd] )
        editDateFormatted = oneDay[0:indexDateEnd]
        editDate =   dateutil.parser.parse(editDateFormatted)
        
        # print (editDateFormatted)
        if dayNum is 1:
            theUser["lastEditFormatted"] = editDateFormatted
            theUser["lastEdit"] = editDate
            theUser["editedProject"] = False
            theUser["anyEdit"] = False
        
        print (editDateFormatted)
        if editDate > six_months_ago:
            theUser["anyEdit"] = True
            relevant_edit = did_user_perform_relevant_edit(oneDay)
            if relevant_edit is True:
                theUser["editedProject"] = True
                break
            any_edit = True
        else:
            print("edit too old, done")
            break

def did_user_perform_relevant_edit(oneDay):
    words = ["German", "Deutsch", "Heiliges", "Holy Roman", "Prussia", "Preußen"]
    editsPerDay = oneDay.split("<span class='HISTORY-ITEM'>")
    for oneEdit in editsPerDay[1:]:
        linksInEdit = oneEdit.split("<a href=\"")
        
        #first part without link
        #third part usually contains the topic of the edit
        if len(linksInEdit) > 3:
            # print(linksInEdit)
            endOfLink = linksInEdit[3].find("\"")
            subjectLink = linksInEdit[3][0:endOfLink]
            print (subjectLink)
            if "http" in subjectLink and not "Special" in subjectLink:
                if does_profile_contain(subjectLink, words) is True:
                    print("relevant edit found")
                    
                    return True
                else:
                    print("no project relevant edit")
        print("-------------------")
    return False


def does_profile_contain(link, words):
    
    if link in profiles_global:
        return profiles_global[link]
    else:
        f = requests.get(link)
        profile_text = f.text
        profiles_global[link] = False
        for word in words:
            if word in profile_text:
                profiles_global[link] = True
                return True
        return False
        

def get_checkin_requested(theUser, checkInSubstring):
    link = 'https://www.wikitree.com/wiki/' + theUser["id"]
    f = requests.get(link)
    userPage = f.text
    theUser["check-in-requested"] = checkInSubstring in userPage

profiles_global = {}
flo =  {}
flo['id'] = "Straub-620"
flo['name'] = "Flo"

members = []
members.append(flo)

#pgm
members = get_member_users("germany")

for member in members:
    check_edit_history(member)
    get_checkin_requested(member, "It’s Germany Project check-in time again")
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
    f.write("<td>")
    if member["anyEdit"]:
        f.write("yes")
    else:
        f.write("no")
    f.write("</td>")    
    f.write("<td>")
    if member["editedProject"]:
        f.write("yes")
    else:
        f.write("no")
    f.write("</td>")
    f.write("</tr>")
f.write("</table></body>")
f.close()
    