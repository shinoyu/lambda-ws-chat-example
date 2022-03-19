# Create manage roles for serveless 

## Prerequisites

- above Docker v20.10

## Usage

1. Create AWS_PROFILE, role for write to S3 bucket.
2. Create S3 bucekt for store Terraform.state
3. run 
```sh
AWS_PROFILE={run-profile} ./terraform init -backend-config=/vars/{stage}.tfbackend
AWS_PROFILE={run-profile} ./terraform apply -var-file=/vars/{stage}.tfvars
```
