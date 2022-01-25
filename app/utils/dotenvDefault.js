require("dotenv").config()

const envOrNull = env => env ? env : null

HTTP_PORT = process.env.HTTP_PORT ? process.env.HTTP_PORT : 80
PARTNER_DNS = envOrNull(process.env.PARTNER_DNS) 
PARTNER_IP = envOrNull(process.env.PARTNER_IP) 
LOCAL_DNS = envOrNull(process.env.LOCAL_DNS) 
LOCAL_IP = envOrNull(process.env.LOCAL_IP) 
TEST_DNS = envOrNull(process.env.TEST_DNS)
AWS_REGION = envOrNull(process.env.AWS_REGION) 
AWS_PROFILE = envOrNull(process.env.AWS_PROFILE)
AWS_ZONE_ID = envOrNull(process.env.AWS_ZONE_ID)
LOG_GROUP_NAME = envOrNull(process.env.LOG_GROUP_NAME)
LOG_STREAM_NAME = envOrNull(process.env.LOG_STREAM_NAME)

module.exports = {
    HTTP_PORT,
    PARTNER_DNS,
    PARTNER_IP,
    LOCAL_DNS,
    LOCAL_IP,
    TEST_DNS,
    AWS_REGION,
    AWS_PROFILE,
    AWS_ZONE_ID,
    LOG_GROUP_NAME,
    LOG_STREAM_NAME 
}