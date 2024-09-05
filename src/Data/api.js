
// const baseURL='http://88.99.5.236:9857'
const baseURL='https://choplottodashboardbackend.visiontrek.io'



const LoginApi=`${baseURL}/api/auth/login`;
export {LoginApi}

const drawWinner=`${baseURL}/api/verify/getDrawData`
export {drawWinner}

const status=`${baseURL}/api/verify/statusWise`
export {status}

const subdatetime=`${baseURL}/api/verify/subscriptionData`
export {subdatetime}

const subscriptionMsisdn=`${baseURL}/api/verify/subscriptionByMsisdn`
export {subscriptionMsisdn}

const unsubapi=`${baseURL}/api/verify/unsub`
export {unsubapi}


const contestdetail=`${baseURL}/api/verify/contestDetail`
export {contestdetail}

const contestTicketId=`${baseURL}/api/verify/contestByticketId`
export {contestTicketId}

const revenueApi=`${baseURL}/api/verify/revenue`
export {revenueApi}

const getCountApi=`${baseURL}/api/verify/getCount`
export {getCountApi}



