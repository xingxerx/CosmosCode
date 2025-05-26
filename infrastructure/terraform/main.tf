provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "./modules/vpc"
  name   = "${var.project_name}-vpc"
  cidr   = var.vpc_cidr
}

module "ecs" {
  source            = "./modules/ecs"
  name              = "${var.project_name}-cluster"
  vpc_id            = module.vpc.vpc_id
  subnet_ids        = module.vpc.private_subnet_ids
  app_image         = var.app_image
  app_count         = var.app_count
  app_port          = var.app_port
  fargate_cpu       = var.fargate_cpu
  fargate_memory    = var.fargate_memory
  execution_role_arn = aws_iam_role.ecs_execution_role.arn
}

module "batch" {
  source           = "./modules/batch"
  name             = "${var.project_name}-batch"
  vpc_id           = module.vpc.vpc_id
  subnet_ids       = module.vpc.private_subnet_ids
  compute_env_name = "${var.project_name}-compute-env"
  job_queue_name   = "${var.project_name}-job-queue"
  job_definition   = "${var.project_name}-job-def"
  container_image  = var.simulation_image
}