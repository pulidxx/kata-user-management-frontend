variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "crm-bdb-qa"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "qa"
}

variable "domain_name" {
  description = "name for CloudFront"
  type        = string
  default     = ""
}
