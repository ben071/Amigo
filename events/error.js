module.exports = async (client, error) => {
    return client.logger.log(`[ERROR] ${error.message || error}`)
}