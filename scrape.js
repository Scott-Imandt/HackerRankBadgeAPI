
import * as cheerio from 'cheerio'

function getBadgeGradient($badge){

    if($badge.find('#badge-bronze-gradient').html() != null){
        return "Bronze"
    }
    else if($badge.find('#badge-silver-gradient').html()){
        return "Silver"
    }

    else if($badge.find('#badge-gold-gradient').html()){
        return "Gold"
    }
    
    return null
}

function getBadgeStarCount($badge){

    const starlist = $badge.find('.star')

    return starlist.length;
}


export async function scrape(username, codeType){


    const url = "https://www.hackerrank.com/profile/" + username

    //console.log(url)

    const res = await fetch(url);

    const html = await res.text();

    const $ = cheerio.load(html);

    if(($('title').first().text()) == "Programming Problems and Competitions :: HackerRank"){
        console.log("Error incorrect username")
        return null
    }

    const badgeList = $('.hacker-badge')

    let badgeIndex = null;

    badgeList.each((index, element)=> {
        if(codeType == $(element).text().toLowerCase()){
            //console.log($(element).html(), index);
            badgeIndex = index
        }
        
    })

    if(badgeIndex == null){
        
        console.log("ERROR: badge did not match anything on profile")
        return null
    }

    const $badge = $(badgeList[badgeIndex])


    const svg = ($(badgeList[badgeIndex]).find('.ui-badge-wrap').html())

    
    //get Gradient
    const badgeGradient = getBadgeGradient($badge) // returns string of badge type

    //get title
    const badgeTitle = $badge.text()

    //get star count
    const badgeStarCount = getBadgeStarCount($badge)

    //get image href
    const badgehref = $badge.find('.badge-icon').attr('href')
    
    
    const badgeReturn = {badgeTitle, badgeGradient, badgeStarCount, badgehref}
    

    //console.log(badgeReturn)
    return badgeReturn
    

};


