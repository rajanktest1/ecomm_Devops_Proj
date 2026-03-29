output "resource_group_name" {
  description = "Azure Resource Group name — needed for GitHub Actions secrets."
  value       = azurerm_resource_group.rg.name
}

output "acr_login_server" {
  description = "ACR login server URL — set this as the ACR_LOGIN_SERVER GitHub secret."
  value       = azurerm_container_registry.acr.login_server
}

output "aks_cluster_name" {
  description = "AKS cluster name — set this as the AKS_CLUSTER_NAME GitHub secret."
  value       = azurerm_kubernetes_cluster.aks.name
}

output "aks_kubernetes_version" {
  description = "Kubernetes version currently running on the cluster."
  value       = azurerm_kubernetes_cluster.aks.kubernetes_version
}

output "configure_kubectl" {
  description = "Run this command locally to configure kubectl for this cluster."
  value       = "az aks get-credentials --resource-group ${azurerm_resource_group.rg.name} --name ${azurerm_kubernetes_cluster.aks.name} --overwrite-existing"
}

# terraform output -raw kube_config > ~/.kube/shopease-prod.yaml
output "kube_config" {
  description = "Raw kubeconfig — pipe to a file to use with kubectl directly."
  value       = azurerm_kubernetes_cluster.aks.kube_config_raw
  sensitive   = true
}
