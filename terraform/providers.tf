# ──────────────────────────────────────────────────────────────────────────────
#  Terraform — Provider & backend configuration
#
#  Steps before first run:
#    1. az login
#    2. terraform init
#    3. terraform plan
#    4. terraform apply
#
#  To use Azure Blob Storage as remote state (recommended for teams):
#    a. Create a resource group, storage account, and container:
#         az group create -n rg-shopease-tfstate -l eastus2
#         az storage account create -n stshopeasetfstate -g rg-shopease-tfstate \
#             --sku Standard_LRS --kind StorageV2
#         az storage container create -n tfstate \
#             --account-name stshopeasetfstate
#    b. Uncomment the backend block below and run `terraform init -migrate-state`
# ──────────────────────────────────────────────────────────────────────────────
terraform {
  required_version = ">= 1.6"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }
  }

  # Uncomment after running the setup commands above:
  # backend "azurerm" {
  #   resource_group_name  = "rg-shopease-tfstate"
  #   storage_account_name = "stshopeasetfstate"
  #   container_name       = "tfstate"
  #   key                  = "shopease.prod.tfstate"
  # }
}

provider "azurerm" {
  features {
    resource_group {
      # Allows `terraform destroy` even when resources exist (safer for learning)
      prevent_deletion_if_contains_resources = false
    }
  }
}
