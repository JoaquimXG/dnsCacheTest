# DNS Cache Test


# Usage

1. Two servers need to be set up each with seperate DNS names
    - e.g. 1.x.com and 2.x.com
2. A third dns name is required for testing
    - e.g. test.x.com
3. Each server must be set up with AWS permissions 
    - Either through EC2 roles or .aws/config|.aws/credentials files
    - Permissions required are for CloudWatch-Logs and Route53
        - AmazonRoute53AutoNamingFullAccess
        - AWSOpsWorksCloudWatchLogs
4. Create a CloudWatch logGroup and logStream
5. Fill in .env files for each instance, details below
6. Configure a browser to point to test.x.com and auto-refresh every x seconds
7. Delay between DNS update and cache update will be logged to CloudWatch

Note: cloud-config is only assist in initial instance deployment, configuration has not been automated.

# Config

## Environment Variables

- HTTP_PORT 
    - http port server will listen on
- LOCAL_DNS
    - DNS name of local instance, e.g. 1.x.com
- LOCAL_IP
    - IP address of local instance
- PARTNER_DNS
    - DNS name of partner instance, e.g. 2.x.com
- PARTNER_IP
    - IP address of partner instance
- TEST_DNS
    - DNS name for testing cache latency, e.g. test.x.com
- AWS_REGION
    - AWS region where Route53 hosted zone and CloudWatch logs are maintained
- AWS_PROFILE
    - AWS Config profile to utilise from .aws/config|.aws/credentials file
- AWS_ZONE_ID
    - Hosted zone id for Route53 test domain
- LOG_GROUP_NAME
    - Name of CloudWatch log group
- LOG_STREAM_NAME
    - Name of CloudWatch log stream