const allowedOrigins=require('./allowedOrigins');
const corOptions={
    origin:(origin, callback)=>{
        if(allowedOrigins.indexOf(origin)!==-1 || !origin){
            callback(null,true);

        }
        else{
            callback(new Error('not allowed by cors'));
        }
    },
    credential:true,  //cookies , http authentation by cors
    optionsSuccessStatus:200 //cors prefight checks
}
module.exports=corOptions;