exports.notFound = (req, res, next) => {
    const error = new Error(`Not found ${req.originalUrl}`)
    res.status(404)
    next(error)
}

exports.errorHandler = (err,req,res,next)=>{
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(value => value.message);
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode
        res.status(statusCode)
        res.json({
            message: message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
            success: false
        })

    }else{
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode
        res.status(statusCode)
        res.json({
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
            success: false
        })
    }
    
}