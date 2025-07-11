

export const otpTemplate = (name:string, otp:string)=>{
    return (
        `
        <html>
            <body>
                <h2>Hello ${name}</h2> <br/>
                <h3>This is your ${otp}</h3>
            </body>
        <html>
        `
    )
}
export const loginTemplate = (name:string, otp:string)=>{
    return (
        `
        <html>
            <body>
                <h2>Hello ${name}</h2> <br/>
                <h3>A login has been detected, kindly confirm the below information</h3>
            </body>
        <html>
        `
    )
}