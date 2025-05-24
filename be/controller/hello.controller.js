
const hello = (req, res) => {
    res.send({
        status: 'success',
        code  : 200,
        data  : {
            message: 'An update...'
        }
    })
}


module.exports = {
  hello
}