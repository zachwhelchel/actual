let url = window.location.href;

let REACT_APP_BILLING_STATUS = process.env.REACT_APP_BILLING_STATUS;
let REACT_APP_TRIAL_END_DATE = process.env.REACT_APP_TRIAL_END_DATE;
let REACT_APP_ZOOM_RATE = process.env.REACT_APP_ZOOM_RATE;
let REACT_APP_ZOOM_LINK = process.env.REACT_APP_ZOOM_LINK;
let REACT_APP_COACH = process.env.REACT_APP_COACH;
let REACT_APP_COACH_FIRST_NAME = process.env.REACT_APP_COACH_FIRST_NAME;
let REACT_APP_USER_FIRST_NAME = process.env.REACT_APP_USER_FIRST_NAME;
let REACT_APP_UI_MODE = process.env.REACT_APP_UI_MODE;

let testableCoachList = [['select', 'Select a Coach...'], 
['kristinwade', 'Kristin Wade'],
['nicksmith', 'Nick Smith'],
['jordanjung', 'Jordan Denae'],
['randidegraw', 'Randi DeGraw'],
['melodybarthelemy', 'Melody Barthelemy'],
['alfredomatos', 'Alfredo Matos'],
['aitzanegron', 'Aitzarelys Negrón'],
['zachdemo', 'Zach Demo'],
['highlights', 'Highlights Demo'],
];

if (url.includes("kristinwade")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "49.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://www.fiscal-bliss.com/booking-calendar/mybudgetcoach-meeting"
  REACT_APP_COACH = "kristinwade"
  REACT_APP_COACH_FIRST_NAME = "Kristin"
  REACT_APP_USER_FIRST_NAME = "Kristin"
  REACT_APP_UI_MODE = "coach"
} 
else if (url.includes("nicksmith")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 28th, 2023"
  REACT_APP_ZOOM_RATE = "40.00 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/personalwealthadventures/one-hour-session"
  REACT_APP_COACH = "nicksmith"
  REACT_APP_COACH_FIRST_NAME = "Nick"
  REACT_APP_USER_FIRST_NAME = "Nick"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("jordanjung")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "39.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/jordan_denae/1-hour-meeting"
  REACT_APP_COACH = "jordanjung"
  REACT_APP_COACH_FIRST_NAME = "Jordan"
  REACT_APP_USER_FIRST_NAME = "Jordan"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("randidegraw")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "39.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://meetings.hubspot.com/randi-degraw/mybudgetcoach"
  REACT_APP_COACH = "randidegraw"
  REACT_APP_COACH_FIRST_NAME = "Randi"
  REACT_APP_USER_FIRST_NAME = "Randi"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("zachwhelchel")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "39.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/jordan_denae/1-hour-meeting"
  REACT_APP_COACH = "jordanjung"
  REACT_APP_COACH_FIRST_NAME = "Jordan"
  REACT_APP_USER_FIRST_NAME = "Zach"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("melodybarthelemy")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "35.00 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/frugallymelody/my-budget-coach"
  REACT_APP_COACH = "melodybarthelemy"
  REACT_APP_COACH_FIRST_NAME = "Melody"
  REACT_APP_USER_FIRST_NAME = "Melody"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("alfredomatos")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "49.00 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/cashviewpoint/mybudgetcoach"
  REACT_APP_COACH = "alfredomatos"
  REACT_APP_COACH_FIRST_NAME = "Alfredo"
  REACT_APP_USER_FIRST_NAME = "Alfredo"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("aitzarelysnegron")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "47.00 USD / 45 Minute Session"
  REACT_APP_ZOOM_LINK = "https://StrategiesandTEA.as.me/MBC"
  REACT_APP_COACH = "aitzanegron"
  REACT_APP_COACH_FIRST_NAME = "Aitzarelys"
  REACT_APP_USER_FIRST_NAME = "Aitzarelys"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("georgewu")) {
  REACT_APP_BILLING_STATUS = "free_trial"
  REACT_APP_TRIAL_END_DATE = "February 14th, 2024"
  REACT_APP_ZOOM_RATE = "49.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://www.fiscal-bliss.com/booking-calendar/mybudgetcoach-meeting"
  REACT_APP_COACH = "kristinwade"
  REACT_APP_COACH_FIRST_NAME = "Kristin"
  REACT_APP_USER_FIRST_NAME = "George"
  REACT_APP_UI_MODE = "user"
}
else if (url.includes("elizabethmckay")) {
  REACT_APP_BILLING_STATUS = "free_trial"
  REACT_APP_TRIAL_END_DATE = "February 18th, 2024"
  REACT_APP_ZOOM_RATE = "49.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://www.fiscal-bliss.com/booking-calendar/mybudgetcoach-meeting"
  REACT_APP_COACH = "kristinwade"
  REACT_APP_COACH_FIRST_NAME = "Kristin"
  REACT_APP_USER_FIRST_NAME = "Elizabeth"
  REACT_APP_UI_MODE = "user"
} 
else if (url.includes("enidnegron")) {
  REACT_APP_BILLING_STATUS = "free_trial"
  REACT_APP_TRIAL_END_DATE = "February 18th, 2024"
  REACT_APP_ZOOM_RATE = "47.00 USD / 45 Minute Session"
  REACT_APP_ZOOM_LINK = "https://StrategiesandTEA.as.me/MBC"
  REACT_APP_COACH = "aitzanegron"
  REACT_APP_COACH_FIRST_NAME = "Aitzarelys"
  REACT_APP_USER_FIRST_NAME = "Enid"
  REACT_APP_UI_MODE = "user"
}
else if (url.includes("mirlandepetitraymond")) {
  REACT_APP_BILLING_STATUS = "free_trial"
  REACT_APP_TRIAL_END_DATE = "February 21st, 2024"
  REACT_APP_ZOOM_RATE = "47.00 USD / 45 Minute Session"
  REACT_APP_ZOOM_LINK = "https://StrategiesandTEA.as.me/MBC"
  REACT_APP_COACH = "aitzanegron"
  REACT_APP_COACH_FIRST_NAME = "Aitzarelys"
  REACT_APP_USER_FIRST_NAME = "Mirlande"
  REACT_APP_UI_MODE = "user"
}
else if (url.includes("reynaperdomo")) {
  REACT_APP_BILLING_STATUS = "free_trial"
  REACT_APP_TRIAL_END_DATE = "February 21st, 2024"
  REACT_APP_ZOOM_RATE = "47.00 USD / 45 Minute Session"
  REACT_APP_ZOOM_LINK = "https://StrategiesandTEA.as.me/MBC"
  REACT_APP_COACH = "aitzanegron"
  REACT_APP_COACH_FIRST_NAME = "Aitzarelys"
  REACT_APP_USER_FIRST_NAME = "Reyna"
  REACT_APP_UI_MODE = "user"
}
else if (url.includes("jacquelinekeeley")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "40.00 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/personalwealthadventures/one-hour-session"
  REACT_APP_COACH = "nicksmith"
  REACT_APP_COACH_FIRST_NAME = "Nick"
  REACT_APP_USER_FIRST_NAME = "Jacqueline"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("zachdemo")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "39.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/zach-whelchel/1-hour"
  REACT_APP_COACH = "zachdemo"
  REACT_APP_COACH_FIRST_NAME = "Zach"
  REACT_APP_USER_FIRST_NAME = "Coach"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("spencerstephenson")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "40.00 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/personalwealthadventures/one-hour-session"
  REACT_APP_COACH = "nicksmith"
  REACT_APP_COACH_FIRST_NAME = "Nick"
  REACT_APP_USER_FIRST_NAME = "Spencer"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("katiesolomon")) {
  REACT_APP_BILLING_STATUS = "free_trial"
  REACT_APP_TRIAL_END_DATE = "February 28th, 2024"
  REACT_APP_ZOOM_RATE = "49.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://www.fiscal-bliss.com/booking-calendar/mybudgetcoach-meeting"
  REACT_APP_COACH = "kristinwade"
  REACT_APP_COACH_FIRST_NAME = "Kristin"
  REACT_APP_USER_FIRST_NAME = "Katie"
  REACT_APP_UI_MODE = "user"
}
else if (url.includes("katiegriffin")) {
  REACT_APP_BILLING_STATUS = "free_trial"
  REACT_APP_TRIAL_END_DATE = "March 21st, 2024"
  REACT_APP_ZOOM_RATE = "49.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://www.fiscal-bliss.com/booking-calendar/mybudgetcoach-meeting"
  REACT_APP_COACH = "kristinwade"
  REACT_APP_COACH_FIRST_NAME = "Kristin"
  REACT_APP_USER_FIRST_NAME = "Katie"
  REACT_APP_UI_MODE = "user"
}
else if (url.includes("celiabenton")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "39.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://meetings.hubspot.com/randi-degraw/mybudgetcoach"
  REACT_APP_COACH = "randidegraw"
  REACT_APP_COACH_FIRST_NAME = "Randi"
  REACT_APP_USER_FIRST_NAME = "Celia"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("bobbiolson")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "49.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://www.fiscal-bliss.com/booking-calendar/mybudgetcoach-meeting"
  REACT_APP_COACH = "kristinwade"
  REACT_APP_COACH_FIRST_NAME = "Kristin"
  REACT_APP_USER_FIRST_NAME = "Bobbi"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("adriennetaylor")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_USER_FIRST_NAME = "Adrienne"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("chelsehounshell")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_USER_FIRST_NAME = "Chelse"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("tashiekamaat")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_USER_FIRST_NAME = "Tashieka"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("naseemamcelroy")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_USER_FIRST_NAME = "Naseema"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("anitadombovari")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_USER_FIRST_NAME = "Anita"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("mikamarcondesdefreitas")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_USER_FIRST_NAME = "Mika"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("katsklar")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_USER_FIRST_NAME = "Kat"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("trevorvance")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_USER_FIRST_NAME = "Trevor"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("stacymastrolia")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_USER_FIRST_NAME = "Stacy"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("dariomartinez")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_USER_FIRST_NAME = "Dario"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("danielaaron")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_USER_FIRST_NAME = "Daniel"
  REACT_APP_UI_MODE = "coach"
}
else if (url.includes("localhost")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  // REACT_APP_ZOOM_RATE = "39.99 USD / hour"
  // REACT_APP_ZOOM_LINK = "https://calendly.com/zach-whelchel/1-hour"
  // REACT_APP_COACH = "zachdemo"
  // REACT_APP_COACH_FIRST_NAME = "Zach"
  REACT_APP_USER_FIRST_NAME = "User"
  REACT_APP_UI_MODE = "coach"

  REACT_APP_BILLING_STATUS = "free_trial"
  REACT_APP_TRIAL_END_DATE = "February 14th, 2024"
  REACT_APP_ZOOM_RATE = "49.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://www.fiscal-bliss.com/booking-calendar/mybudgetcoach-meeting"
  REACT_APP_COACH = "kristinwade"
  REACT_APP_COACH_FIRST_NAME = "Kristin"
  REACT_APP_USER_FIRST_NAME = "George"
  REACT_APP_UI_MODE = "user"
}

let file = localStorage.getItem("uploaded_draw_io_file");
if (file != null) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "0.00 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/"
  REACT_APP_COACH = "drawioavatar"
  REACT_APP_COACH_FIRST_NAME = "Draw.io Avatar"
}

let testPublishedAvatar = localStorage.getItem("test_published_avatar");
if (testPublishedAvatar != null) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "0.00 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/"
  REACT_APP_COACH = testPublishedAvatar

  if (testPublishedAvatar === "kristinwade") {
    REACT_APP_COACH_FIRST_NAME = "Kristin"
    REACT_APP_ZOOM_RATE = "49.99 USD / hour"
    REACT_APP_ZOOM_LINK = "https://www.fiscal-bliss.com/booking-calendar/mybudgetcoach-meeting"
  }
  else if (testPublishedAvatar === "nicksmith") {
    REACT_APP_COACH_FIRST_NAME = "Nick"
    REACT_APP_ZOOM_RATE = "40.00 USD / hour"
    REACT_APP_ZOOM_LINK = "https://calendly.com/personalwealthadventures/one-hour-session"
  }
  else if (testPublishedAvatar === "jordanjung") {
    REACT_APP_COACH_FIRST_NAME = "Jordan"
    REACT_APP_ZOOM_RATE = "39.99 USD / hour"
    REACT_APP_ZOOM_LINK = "https://calendly.com/jordan_denae/1-hour-meeting"
  }
  else if (testPublishedAvatar === "randidegraw") {
    REACT_APP_COACH_FIRST_NAME = "Randi"
    REACT_APP_ZOOM_RATE = "39.99 USD / hour"
    REACT_APP_ZOOM_LINK = "https://meetings.hubspot.com/randi-degraw/mybudgetcoach"
  }
  else if (testPublishedAvatar === "melodybarthelemy") {
    REACT_APP_COACH_FIRST_NAME = "Melody"
    REACT_APP_ZOOM_RATE = "35.00 USD / hour"
    REACT_APP_ZOOM_LINK = "https://calendly.com/frugallymelody/my-budget-coach"
  }
  else if (testPublishedAvatar === "alfredomatos") {
    REACT_APP_COACH_FIRST_NAME = "Alfredo"
    REACT_APP_ZOOM_RATE = "49.00 USD / hour"
    REACT_APP_ZOOM_LINK = "https://calendly.com/cashviewpoint/mybudgetcoach"
  }
  else if (testPublishedAvatar === "aitzanegron") {
    REACT_APP_COACH_FIRST_NAME = "Aitza"
    REACT_APP_ZOOM_RATE = "47.00 USD / 45 Minute Session"
    REACT_APP_ZOOM_LINK = "https://StrategiesandTEA.as.me/MBC"
  }
  else {
    REACT_APP_COACH_FIRST_NAME = testPublishedAvatar
  }

}

//if we find that file then set everything to that...
//that's really the bulk of it...

export {REACT_APP_BILLING_STATUS, REACT_APP_TRIAL_END_DATE, REACT_APP_ZOOM_RATE, REACT_APP_ZOOM_LINK, REACT_APP_COACH, REACT_APP_COACH_FIRST_NAME, REACT_APP_USER_FIRST_NAME, REACT_APP_UI_MODE, testableCoachList}