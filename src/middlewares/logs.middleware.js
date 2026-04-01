function logger(req,res,next){
    const date = Date.now();

    res.on("finish" , ()=>{
        const duration = Date.now() - date;

        console.log(` Method : ${req.method} , URL : ${req.url} , Status : ${res.statusCode} , Duration : ${duration}ms , IP : ${req.ip}`)
    });

    next();
}

module.exports = logger;