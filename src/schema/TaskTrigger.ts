
export type TaskTrigger = 
    OneTimeTrigger | 
    DailyTrigger | 
    WeeklyTrigger | 
    MonthlyTrigger | 
    CRONTrigger

interface OneTimeTrigger{
    startTimeUnix:number;
}

interface DailyTrigger extends OneTimeTrigger{
    numDaysBetweenRuns:number
}

interface WeeklyTrigger extends OneTimeTrigger{
    numWeeksBetweenRuns:number;
    sunday:boolean;
    monday:boolean;
    tuesday:boolean;
    wednesday:boolean;
    thursday:boolean;
    friday:boolean;
    saturday:boolean;
}

interface MonthlyTrigger extends OneTimeTrigger{
    months: {
        january: boolean;
        february:boolean;
        march:boolean;
        april:boolean;
        may: boolean;
        june: boolean;
        july:boolean;
        august:boolean;
        september:boolean;
        october:boolean;
        november:boolean;
        december:boolean;
    },
    daysOfTheMonth:{
        1:boolean;
        2: boolean;
        3: boolean;
        4: boolean;
        5: boolean;
        6: boolean;
        7: boolean;
        8: boolean;
        9: boolean;
        10: boolean;
        11: boolean;
        12: boolean;
        13: boolean;
        14: boolean;
        15: boolean;
        16: boolean;
        17: boolean;
        18: boolean;
        19: boolean;
        20: boolean;
        21: boolean;
        22: boolean;
        23: boolean;
        24: boolean;
        25: boolean;
        26: boolean;
        27: boolean;
        28: boolean;
        29: boolean;
        30: boolean;
        31: boolean;
        last: boolean;
    },
    weekOfTheMonth: {
        first: boolean;
        second: boolean;
        third: boolean;
        fourth: boolean;
        last: boolean;
    },
    dayOfTheWeek: {
        sunday: boolean;
        monday: boolean;
        tuesday:boolean;
        wednesday:boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
    }
}

interface CRONTrigger{
    cron: string;
}