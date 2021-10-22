module.exports = {
  sendError(res, err = null) {
    console.log("ERROR:", err)
    return res.status(500).send({
      code: 500,
      message: "SERVER_ERROR",
      body: String(err)
    })
  }
}