variable "project" {
  description = "Short project name used as a prefix on all Azure resource names."
  type        = string
  default     = "shopease"
}

variable "env" {
  description = "Deployment environment (prod | staging | dev)."
  type        = string
  default     = "prod"
}

variable "location" {
  description = "Azure region for all resources."
  type        = string
  default     = "East US 2"
}

variable "node_count" {
  description = "Initial number of AKS worker nodes. Auto-scaling adjusts between min/max."
  type        = number
  default     = 2
}

variable "node_vm_size" {
  description = "VM SKU for AKS worker nodes."
  type        = string
  default     = "Standard_D2s_v3"   # 2 vCPU, 8 GB RAM
}

variable "aks_kubernetes_version" {
  description = "Kubernetes version for the AKS cluster."
  type        = string
  default     = "1.29"
}
