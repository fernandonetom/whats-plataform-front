export function handleAxiosError(error: any){
  if(error?.isAxiosError){
    if(error?.response?.data){
      return error.response.data
    }
  }

  return error.message
}