locals {
  common_tags = {
    project     = var.project
    environment = var.env
    managed_by  = "terraform"
  }
}

# ── Resource Group ─────────────────────────────────────────────────────────────
resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.project}-${var.env}"
  location = var.location
  tags     = local.common_tags
}

# ── Azure Container Registry ───────────────────────────────────────────────────
# Stores Docker images built by CI/CD. AKS pulls from here using managed identity.
resource "azurerm_container_registry" "acr" {
  name                = "acr${var.project}${var.env}"   # globally unique, alphanumeric only
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"          # upgrade to Standard for geo-replication & content trust
  admin_enabled       = false            # use managed identity — never use admin credentials
  tags                = local.common_tags
}

# ── Log Analytics Workspace (AKS telemetry → Azure Monitor) ───────────────────
resource "azurerm_log_analytics_workspace" "law" {
  name                = "law-${var.project}-${var.env}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.common_tags
}

# ── AKS Cluster ────────────────────────────────────────────────────────────────
resource "azurerm_kubernetes_cluster" "aks" {
  name                = "aks-${var.project}-${var.env}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "${var.project}-${var.env}"
  kubernetes_version  = var.aks_kubernetes_version

  default_node_pool {
    name                = "system"
    vm_size             = var.node_vm_size
    os_disk_size_gb     = 30
    type                = "VirtualMachineScaleSets"   # required for autoscaling
    enable_auto_scaling = true
    min_count           = 1
    max_count           = 5
    # node_count is intentionally omitted — the cluster autoscaler manages it
    # when enable_auto_scaling = true; setting both causes a conflict.
  }

  # System-assigned managed identity — no service principal rotation needed
  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
    outbound_type     = "loadBalancer"
  }

  # Send container logs and metrics to Log Analytics
  oms_agent {
    log_analytics_workspace_id = azurerm_log_analytics_workspace.law.id
  }

  tags = local.common_tags
}

# ── Grant AKS kubelet identity AcrPull on the registry ────────────────────────
# This allows AKS nodes to pull images from ACR without storing credentials.
resource "azurerm_role_assignment" "aks_acr_pull" {
  principal_id                     = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.acr.id
  skip_service_principal_aad_check = true
}
