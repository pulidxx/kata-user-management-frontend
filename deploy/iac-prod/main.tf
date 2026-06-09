terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket       = "user-frontend-apuli13-prod-tf-state"
    key          = "terraform.tfstate"
    region       = "us-east-1"
    dynamodb_table = "user-frontend-apuli13-prod-terraform-locks"
    encrypt      = true
  }
}

provider "aws" {
  region = var.aws_region
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
