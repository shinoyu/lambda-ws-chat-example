variable "stage" {
  type = string
  description = "development or staging, production"
  default = "development"   
}

variable "app_name" {
  type = string
  description = "Application name"
  default = "ws-chat-example"
}

variable "region" {
  type = string
  description = "AWS region"
  default = "ao-northeast-1"
}

variable "management_user" {
  type = string
  description = "terraform run user name. need run options"
  default = ""
}