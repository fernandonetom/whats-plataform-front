import * as dateFns from 'date-fns'
import pt from 'date-fns/locale/pt-BR'
export class DateUtils {
  static diffToString(dateInString: string): string {
    const date = dateFns.parseISO(dateInString);
    const now = new Date()

    const diffInSeconds = dateFns.differenceInSeconds(now, date)

    if(diffInSeconds < 60){
      return `${diffInSeconds} segundos atrás`
    }

    const diffInMinutes = dateFns.differenceInMinutes(now, date)

    if(diffInMinutes < 60){
      return `${diffInMinutes} minutos atrás`
    }

    const diffInHours = dateFns.differenceInHours(now, date)

    if(diffInHours < 24){
      return `${diffInHours} horas atrás`
    }

    if(diffInHours < 48){
      return `ontem`
    }

    if(diffInHours < (24 * 7)){
      return dateFns.format(date, "EEEE", {locale: pt})
    }
    
    return dateFns.format(date, "dd/MM", {locale: pt})
  }
}
