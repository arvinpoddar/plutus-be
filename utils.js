module.exports = {
  sendError(res, err = null) {
    console.log("ERROR:", err)
    return res.status(500).send({
      code: 500,
      message: "SERVER_ERROR",
      body: String(err)
    })
  },

  sendCustomError(res, code = 500, message = "Something went wrong") {
    return res.status(code).send({
      code: code,
      message: "SERVER_ERROR",
      body: message
    })
  }
}