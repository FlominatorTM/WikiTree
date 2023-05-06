import requests
import dateutil.parser
import argparse

from datetime import datetime 
from dateutil.relativedelta import relativedelta 

def get_args():
    parser = argparse.ArgumentParser(description='Creates a report of one project')
    parser.add_argument('--contribs', action='store_true', help='Checks edited profiles for keyword')
    parser.add_argument('--last', action='store_true', help='Gets last edit')
    parser.add_argument('--any', action='store_true', help='Checks for edits in last months')
    parser.add_argument('--checkin', action='store_true', help='Checks is user received check-in message')
    parser.add_argument('--reply', action='store_true', help='Checks is user replied to check-in message')
    parser.add_argument('--unbadge', action='store_true', help='Adds link to remove badge')
    parser.add_argument('--users', help='link to text file with user names')
    return parser.parse_args()

def get_members_file(filename):
    members = []
    with open(filename, encoding="utf-8") as f:
        while True:
            line = f.readline()
            if not line:
                break
            theUser = {}
            theUser["id"] = line;
            theUser["name"] = " ";
            members.append(theUser)
    return members

def get_member_users_project(project):

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
    global args
    
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
            if args.last is False and args.contribs is False:
                break
        
        print (editDateFormatted)
        if editDate > six_months_ago:
            theUser["anyEdit"] = True
            if args.contribs:
                relevant_edit = did_user_perform_relevant_edit(oneDay)
                if relevant_edit:
                    theUser["editedProject"] = True
                    break
            any_edit = True
        else:
            print("edit too old, done")
            break

def did_user_perform_relevant_edit(oneDay):
    words = ["German", "Deutsch", "Heiliges", "Holy Roman", "Prussia", "Preußen", "Alsace", "Elsass"]
    editsPerDay = oneDay.split("<span class='HISTORY-ITEM'>")
    for oneEdit in editsPerDay[1:]:
        linksInEdit = oneEdit.split("<a href=\"")
        
        #first part without link
        #third part usually contains the topic of the edit
        if len(linksInEdit) > 3:
            # print(linksInEdit)
            endOfLink = linksInEdit[3].find("\"")
            subjectLink = linksInEdit[3][0:endOfLink]
            if "http" in subjectLink and not "Special" in subjectLink:
                print (subjectLink)
                if does_profile_contain(subjectLink, words):
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
        

def get_checkin_requested(theUser, checkInToken):
    if args.checkin is False:
        return
    print(theUser["id"])
    link = 'https://www.wikitree.com/wiki/' + theUser["id"]
    f = requests.get(link)
    userPage = f.text
    indexCheckInToken = userPage.find(checkInToken)
    
    # print(str(indexCheckInToken))
    theUser["check-in-requested"] = indexCheckInToken > -1
    theUser["check-in-replied"] = False
    
    if theUser["check-in-requested"]:
        indexOfReplyButtons = userPage.index("comment-info small", indexCheckInToken)
        
        indexOfNextDiv = userPage.index("<div", indexOfReplyButtons)
        indexEndOfThatDiv = userPage.index(">", indexOfNextDiv)

        #<div id="comment_7317201" class="comment comment-depth-1 comment-reply    " data-comment-id="7317201" data-reply-to="7316984" data-depth="1">

        if "comment-reply" in userPage[indexOfNextDiv:indexEndOfThatDiv]:
            theUser["check-in-replied"] = True
            replyToken = '<div class="comment-body">'
            indexOfActualReply = userPage.index(replyToken, indexEndOfThatDiv) 
            indexOfActualReply += len(replyToken)
            indexEndOfActualReply = userPage.index("</div>", indexOfActualReply)
            theUser["check-in-reply"] = userPage[indexOfActualReply:indexEndOfActualReply].strip()
            theUser["check-in-negative"] = is_reply_negative(theUser["check-in-reply"])

def is_reply_negative(reply):
    replyLower = reply.lower()
    return "no " in replyLower or "don't" in replyLower or "drop out" in replyLower

def write_report(members):
    global args
    f = open("members.htm", "w")
    f.write('<html><head></head><body><table border="1">')
    f.write("<tr>")
    f.write("<th>ID</th>")
    f.write("<th>Name</th>")
    
    if args.last is True:
        f.write("<th>Last edit</th>")
        
    if args.checkin is True:
        f.write("<th>Check in?</th>")
    
    if args.reply is True:
        f.write("<th>Reply check-in</th>")
    
    if args.any is True:
        f.write("<th>Any edit?</th>")
    
    if args.contribs is True:
        f.write("<th>Project edit?</th>")
        
    if args.unbadge:
        f.write("<th>Badge</th>")
    f.write("</tr>")
    for member in sorted(members, key=lambda d: d['lastEdit']):
        f.write("<tr>")
        f.write("<td>")
        f.write('<a href="https://www.wikitree.com/wiki/' + member["id"] + '">' + member["id"] + '</a>')
        f.write("</td>")
        f.write("<td>")
        f.write(member["name"])
        f.write("</td>")

        if args.last:
            f.write("<td>")
            f.write( member["lastEditFormatted"])
            f.write("</td>")
            
        if args.checkin:
            f.write("<td>")
            if member["check-in-requested"]:
                f.write("yes")
            else:
                f.write("no")
            f.write("</td>")

        if args.reply:
            f.write("<td>")
            if member["check-in-replied"]:
                if member["check-in-negative"]:
                    f.write("<b>")
                f.write(member["check-in-reply"])
                if member["check-in-negative"]:
                    f.write("</b>")            
            else:
                f.write("&nbsp");
            f.write("</td>")


        if args.any:
            f.write("<td>")
            if member["anyEdit"]:
                f.write("yes")
            else:
                f.write("no")
            f.write("</td>")    
        
        if args.contribs:
            f.write("<td>")
            if member["editedProject"]:
                f.write("yes")
            else:
                f.write("no")
            f.write("</td>")
            
        if args.unbadge:
            f.write("<td>")
            f.write('<a href="https://www.wikitree.com/index.php?title=Special:AwardBadge&badge_id=180&users='+ member["id"]+'&action=remove">remove now</a>')
            f.write("</td>")
        f.write("</tr>")
    f.write("</table></body>")
    f.close()
        

args = get_args()
profiles_global = {}

members = []

if not args.users:
    members = get_member_users_project("germany")    
else:
    members= get_members_file(args.users)

#pgm


for member in members:
    check_edit_history(member)
    get_checkin_requested(member, "annual check-in time 2023. If you still ")
    print(member)

write_report(members)
