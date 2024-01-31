import requests
import dateutil.parser
import argparse

from datetime import datetime 
from dateutil.relativedelta import relativedelta 

words = ["German", "Deutsch", "Heiliges", "Holy Roman", "Prussia", "Preußen", "Alsace", "Elsass"]
headers = {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0'}
    
def get_args():
    parser = argparse.ArgumentParser(description='Creates a report about all users, who have a particular badge or who are in a list of user names')
    parser.add_argument('--badge', help='badge name to be checked for (default: germany)', default="germany")
    parser.add_argument('--users', help='text file with user IDs (e.g. Straub-620) as alternative to --badge')
    parser.add_argument('--join', action='store_true', help='show join date')
    parser.add_argument('--last', action='store_true', help='show last edit')
    parser.add_argument('--unbadge', action='store_true', help='show link to remove badge')
    parser.add_argument('--contribs', action='store_true', help='check edited profiles for Germany Project related keywords')
    parser.add_argument('--anysince', type=int, help='check for any edits since this number of months ago')
    parser.add_argument('--checkin', help='part of the checkin-in message to check if user received it')
    parser.add_argument('--reply', action='store_true', help='check if user replied to check-in message')
    parser.add_argument('--otherbadges', help='check if user also has these badges (pipe-separated list)')

    args = parser.parse_args()
    #if args.badge != None and args.users is not None:
    #    parser.error("either use --badge to specify a badge OR --users to specify a text file with user names")
    return args

def get_members_file(filename):
    members = []
    with open(filename, encoding="utf-8") as f:
        while True:
            line = f.readline().strip()
            if not line:
                break
            theUser = {}
            theUser["id"] = line;
            theUser["name"] = " ";
            members.append(theUser)
    return members

def get_member_users_project(project):

    global headers;
    link = 'https://www.wikitree.com/index.php?title=Special:Badges&b=' + project + '&limit=5000'
    f = requests.get(link, headers=headers)
    memberPageContent = f.text

    members = []

    # <span class="large"><a href="/wiki/Straub-620" target="_blank" title="">Florian Straub</a></span>

    isFirstRound = True
    for member in memberPageContent.split('class="large"><a href="/wiki/'):
        if isFirstRound == True:
            isFirstRound = False
            continue

        #print ("-----------------")
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
    
    print(str(len(members)) + " members found", flush=True)
    return members

def check_edit_history(theUser):
    global args
    global headers
    link = "https://www.wikitree.com/index.php?title=Special:Contributions&l=500&who=" + theUser["id"];
    f = requests.get(link, headers=headers)
    contribPage = f.text
    
    if "The page you were looking for was moved or deleted" in contribPage:
        print(theUser["id"] + " doesn't exist")
        return
    if theUser["name"] == " ":
        indexH1 = contribPage.find("h1") + len("<h1>")
        indexQuote = contribPage.find("'", indexH1)
        theUser["name"] = contribPage[indexH1:indexQuote]

    beginnOfHistory = "<span class='HISTORY-DATE'>"
    contribPageParts = contribPage.split(beginnOfHistory)
    
    now = datetime.now()
    months_any = 6;
    if args.anysince is not None:
        months_any = args.anysince
    six_months_ago = now + relativedelta(months=- months_any)
    
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
            if args.last is False and args.contribs is False and args.anysince is None:
                break
        
        #print (editDateFormatted)
        if args.anysince is not None and editDate > six_months_ago:
            theUser["anyEdit"] = True
            if args.contribs:
                relevant_edit = did_user_perform_relevant_edit(oneDay)
                if relevant_edit:
                    theUser["editedProject"] = True
                    break
            else: 
                break
        else:
            #print("edit too old, done")
            break

def did_user_perform_relevant_edit(oneDay):
    global words
    editsPerDay = oneDay.split("<span class='HISTORY-ITEM'>")
    for oneEdit in editsPerDay[1:]:
        linksInEdit = oneEdit.split("<a href=\"")
        
        #first part without link
        #third part usually contains the topic of the edit
        if len(linksInEdit) > 3:
            # print(linksInEdit)
            # todo: check if is own page
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
    global headers
    if link in profiles_global:
        return profiles_global[link]
    else:
        f = requests.get(link, headers=headers)
        profile_text = f.text
        profiles_global[link] = False
        for word in words:
            if word in profile_text:
                profiles_global[link] = True
                return True
        return False
        

def get_checkin_requested(theUser):
    global headers
    global args
    
    link = 'https://www.wikitree.com/wiki/' + theUser["id"]
    f = requests.get(link, headers=headers)
    userPage = f.text
    # print (link)
    if "This page does not exist."  in userPage or "The page you were looking for was moved or deleted" in userPage:
        print(theUser["id"] + " doesn't exist")
        theUser["lastEdit"] = datetime(1970, 1, 1, 0, 0)
        theUser["lastEditFormatted"] = ""
        theUser["name"] = "[deleted]"
        if args.otherbadges is not None:
            for other_badge in args.otherbadges.split('|'):
                theUser["other-badge-" + other_badge] = False;

        return

    midToken = 'data-mid="'
    indexMidStart = userPage.index(midToken) + len(midToken)
    indexMidEnd = userPage.index('"', indexMidStart)
    mId = userPage[indexMidStart:indexMidEnd]

    if args.join:
        get_date_joined(theUser,  mId, args.badge)
    
    if args.otherbadges is not None:
        badgePage = get_badge_page(mId)
        for other_badge in args.otherbadges.split('|'):
            theUser["other-badge-" + other_badge] = other_badge.strip() in badgePage;

    if args.checkin is None and args.reply is False:
        return

    indexCheckInToken = userPage.find(args.checkin)    
    # print(str(indexCheckInToken))
    theUser["check-in-requested"] = indexCheckInToken > -1
    theUser["check-in-replied"] = False
    theUser["check-in-reply-date"] = datetime(2122, 12, 19, 0, 0)
    
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
            
            #<time class="timeago" datetime="2023-05-05T20:43:44Z" title="May 05, 2023">10 hours ago</time>
            replyTimeToken = 'datetime="'
            
            indexOfReplyTimeStart = userPage.index(replyTimeToken, indexOfActualReply)
            indexOfReplyTimeStart += len(replyTimeToken)
            indexOfReplyTimeEnd = indexOfReplyTimeStart + len("2023-05-05T20:43:44")
            replyTime = userPage[indexOfReplyTimeStart:indexOfReplyTimeEnd]
            theUser["check-in-reply-date"] = dateutil.parser.parse(replyTime)

def get_badge_page(mId):
    global headers
    link = 'https://www.wikitree.com/index.php?title=Special:Badges&u=' + mId
    f = requests.get(link, headers=headers)

    startBadges =  "<!-- list of badges for this user -->";
    indexStartBadges = f.text.index(startBadges);
    return f.text[indexStartBadges:]


def get_date_joined(theUser, mId, badge):
    badgePage = get_badge_page(mId)
    
    # <li id="list_item_180">
    # <a href="/index.php?title=Special:Badges&amp;b=germany"><img src="/images/badge/germany.gif.pagespeed.ce.9pUpJX44h-.gif" alt="Germany Project Member" width="125" height="70" border="0"></a> <br>
    # <span class="large">Germany Project Member</span><br>
    # Active participant in the <a href="http://www.wikitree.com/wiki/Project:Germany">Germany/German Roots Project</a>.<br>
    # 29 Oct 2019
    # <br>
    # Awarded by <a href="/wiki/Haese-11" title="">Kylie Haese</a>
    
    indexLinkToBadge = badgePage.index("b=" + badge)
    indexBelowDate = badgePage.index("Awarded by ", indexLinkToBadge)
    indexBrAfterDate = badgePage.rindex("<", indexLinkToBadge, indexBelowDate) 
    indexBrBeforeDate = badgePage.rindex('>', indexLinkToBadge, indexBrAfterDate) + len('>')
    theUser["date-joined-formatted"] = badgePage[indexBrBeforeDate:indexBrAfterDate]
    theUser["date-joined"] = dateutil.parser.parse(badgePage[indexBrBeforeDate:indexBrAfterDate]) 
    
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
    
    if args.join:
        f.write("<th>Date joined</th>")
     
    if args.last:
        f.write("<th>Last edit</th>")
        
    if args.checkin is not None:
        f.write("<th>Check in?</th>")
    
    if args.reply:
        f.write("<th>Reply check-in</th>")
    
    if args.anysince != None:
        f.write("<th>any in last " + str(args.anysince) + " months?</th>")
    
    if args.contribs:
        f.write("<th>Project edit?</th>")

    if args.otherbadges is not None:
        for other_badge in args.otherbadges.split('|'):
            f.write("<th>Badge " + other_badge + "</th>")

    if args.unbadge:
        f.write("<th>Badge</th>")
    f.write("</tr>")
    
    if args.reply:
        sortkey='check-in-reply-date'
    else:
        sortkey='lastEdit'
    
    for member in sorted(members, key=lambda d: d[sortkey]):
        f.write("<tr>")
        f.write("<td>")
        f.write('<a href="https://www.wikitree.com/wiki/' + member["id"] + '">' + member["id"] + '</a>')
        f.write("</td>")
        f.write("<td>")
        f.write(member["name"])
        f.write("</td>")

        if args.join:
            f.write("<td>")
            f.write( member["date-joined-formatted"])
            f.write("</td>")

        if args.last:
            f.write("<td>")
            f.write( member["lastEditFormatted"])
            f.write("</td>")
            
        if args.checkin is not None:
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


        if args.anysince != None:
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
            
        if args.otherbadges is not None:
            for other_badge in args.otherbadges.split('|'):
                f.write("<td>")
                if member["other-badge-" + other_badge]:
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
    members = get_member_users_project(args.badge)    
else:
    members= get_members_file(args.users)

#pgm

numMembers = str(len(members))
done = 0
for member in members:
    check_edit_history(member)
    get_checkin_requested(member)
    done +=1
    print(str(done) +  "/" + numMembers + " " + str(member) + "\n", flush=True)
    
write_report(members)
