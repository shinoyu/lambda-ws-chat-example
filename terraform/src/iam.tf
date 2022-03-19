resource "aws_iam_policy" "lambda_manage" {
  name = "${var.app_name}-${var.stage}-lambda-management-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "lambda:*"
        Resource = [
          "arn:aws:lambda:*:${local.account_id}:function:*",
          "arn:aws:lambda:*:${local.account_id}:layer:*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "lambda:ListFunctions",
          "lambda:ListEventSourceMappings",
          "lambda:ListLayerVersions",
          "lambda:ListLayers",
          "lambda:GetAccountSettings",
          "lambda:CreateEventSourceMapping",
          "lambda:ListCodeSigningConfigs"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_policy" "s3_manage" {
  name = "${var.app_name}-${var.stage}-s3-management-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:ListBuckets"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_policy" "dynamodb_manage" {
  name = "${var.app_name}-${var.stage}-dynamodb-management-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:List*",
          "dynamodb:DescribeReservedCapacity*",
          "dynamodb:DescribeLimits",
          "dynamodb:DescribeTimeToLive"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role" "management" {
  name = "${var.app_name}-${var.stage}-management-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "sts:AssumeRole"
        Principal = {
          Service = [
            "ec2.amazonaws.com",
          ]
        }
      }
    ]
  })
  managed_policy_arns = [
    aws_iam_policy.lambda_manage.arn,
    aws_iam_policy.dynamodb_manage.arn,
    aws_iam_policy.s3_manage.arn
  ]
}

resource "aws_iam_group" "management" {
  name = "${var.app_name}-${var.stage}-management-group"
}

// Fixme. foreach 
resource "aws_iam_group_policy_attachment" "lambda_management" {
  group = aws_iam_group.management.name
  policy_arn = aws_iam_policy.lambda_manage.arn
}

resource "aws_iam_group_policy_attachment" "dynamodb_management" {
  group = aws_iam_group.management.name
  policy_arn = aws_iam_policy.dynamodb_manage.arn
}

resource "aws_iam_group_policy_attachment" "s3_management" {
  group = aws_iam_group.management.name
  policy_arn = aws_iam_policy.s3_manage.arn
}
//

resource "aws_iam_group_membership" "management" {
  users = [
    var.management_user
  ]
  group = aws_iam_group.management.name
}

output "iam_policy_ids" {
  value = [
    aws_iam_policy.lambda_manage.id,
    aws_iam_policy.dynamodb_manage.id,
    aws_iam_policy.s3_manage.id,
  ]
}

output "iam_role_ids" {
  value = [
    aws_iam_role.management.id,
  ]
}
