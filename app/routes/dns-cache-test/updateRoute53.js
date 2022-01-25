const log = require("../../utils/logger")
const { AWS_REGION, AWS_PROFILE, AWS_ZONE_ID, TEST_DNS, PARTNER_IP } = require("../../utils/dotenvDefault")
const { Route53Client, ListResourceRecordSetsCommand, ChangeResourceRecordSetsCommand} = require("@aws-sdk/client-route-53")
const { fromIni } = require("@aws-sdk/credential-providers")

const client = new Route53Client({credentials: fromIni({profile: AWS_PROFILE, region: AWS_REGION})})


const recordMatches = async (name, type, values) => {
    const command = new ListResourceRecordSetsCommand({HostedZoneId: AWS_ZONE_ID})
    const res = await client.send(command)

    // Get RecordSet
    let recordSet = res.ResourceRecordSets.filter(
        recordSet => recordSet.Name === name && recordSet.Type === type)[0]
    
    // Check to confirm if is a match or not
    isMatch = true
    recordSet.ResourceRecords.some((record, i) => {
        if (record.Value != values[i]) {
            isMatch = false
            return true
        }
    })
    return isMatch
}

const updateRecord = async (name, type, values) => {
    records = values.map(value => ({Value: value}))
    newRecordSet = {
        Name: name,
        Type: type,
        TTL: 1,
        ResourceRecords: values.map(value => ({Value: value}))
    }

    const command = new ChangeResourceRecordSetsCommand({ChangeBatch: {Changes: [{Action: "UPSERT", ResourceRecordSet: newRecordSet}]} ,HostedZoneId: AWS_ZONE_ID})
    const res = await client.send(command)
}

module.exports = async () => {
    await updateRecord(TEST_DNS, "A", [PARTNER_IP])
    
    while (!await recordMatches(TEST_DNS, "A", [PARTNER_IP])) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await updateRecord(TEST_DNS, "A", [PARTNER_IP])
    }

    return
}
