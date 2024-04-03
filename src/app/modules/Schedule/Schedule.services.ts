import {addHours, addMinutes, format} from 'date-fns';

const CreateScheduleIntoDb=async(payload:{startDate:string,endDate:string,startTime:string,endTime:string})=>{


    const {startDate,endDate,startTime,endTime}=payload;

    const currentDate=new Date(startDate);
    const endingDate=new Date(endDate);
    
    while (currentDate <= endingDate)
    {
        const startDateTime = new Date(
            addMinutes(
              addHours(
                `${format(currentDate, 'yyyy-MM-dd')}`,
                Number(startTime.split(':')[0])
              ),
              Number(startTime.split(':')[1])
            )
          );

          const endDateTime = new Date(
            addMinutes(
              addHours(
                `${format(endingDate, 'yyyy-MM-dd')}`,
                Number(endTime.split(':')[0])
              ),
              Number(endTime.split(':')[1])
            )
          );
        while(startDateTime<=endDateTime)
        {
            
        }
    }
  


    return payload
}

export const ScheduleService={
    CreateScheduleIntoDb
}