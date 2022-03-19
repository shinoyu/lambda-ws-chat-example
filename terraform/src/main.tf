terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    // Specify the S3 bucket using `-backend-config=*.tfbackend` to store tfstate files.
  }
}

provider "aws" {
  region  = var.region

  default_tags {
    tags = {
      App     = var.app_name
      Env     = var.stage
    }
  }
}