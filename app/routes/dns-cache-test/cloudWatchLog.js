
const {CloudWatchLogsClient, PutLogEventsCommand, DescribeLogStreamsCommand} = require("@aws-sdk/client-cloudwatch-logs")
const { fromIni } = require("@aws-sdk/credential-providers")
const {AWS_PROFILE, AWS_REGION, LOG_GROUP_NAME, LOG_STREAM_NAME} = require("../../utils/dotenvDefault")

const client = new CloudWatchLogsClient({credentials: fromIni({profile: AWS_PROFILE, region: AWS_REGION})})

const getSequenceToken = async () => {
    const command = new DescribeLogStreamsCommand({logGroupName: LOG_GROUP_NAME, logStreamNamePrefix: LOG_STREAM_NAME})
    let res = await client.send(command)
    let stream = res.logStreams.filter(stream => stream.logStreamName === LOG_STREAM_NAME)[0]
    
    return stream.uploadSequenceToken
}

module.exports = async dict => {
    events = [{timestamp: new Date().valueOf(), message: JSON.stringify(dict)}]

    while (true) {
        try {
            let seqToken = await getSequenceToken()

            const command = new PutLogEventsCommand({
                logEvents: events,
                logGroupName: LOG_GROUP_NAME,
                logStreamName : LOG_STREAM_NAME,
                sequenceToken: seqToken
            })

            await client.send(command)
            return
        }
        catch {
            continue
        }
    }
    
    
}
