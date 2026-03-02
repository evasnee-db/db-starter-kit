"use client"

import * as React from "react"
import { AppShell, PageHeader } from "@/components/shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { NotebookIcon, PipelineIcon, WorkflowsIcon, CatalogIcon } from "@/components/icons"
import { Clock, Star, Copy, MoreVertical } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

const RECENT_ITEMS = [
  { name: "customer_churn_model", type: "Notebook", modified: "2 min ago", icon: NotebookIcon, status: "Running" },
  { name: "daily_etl_pipeline", type: "Pipeline", modified: "1 hr ago", icon: PipelineIcon, status: "Success" },
  { name: "prod_feature_store", type: "Workflow", modified: "3 hr ago", icon: WorkflowsIcon, status: "Success" },
  { name: "main.sales.transactions", type: "Table", modified: "Yesterday", icon: CatalogIcon, status: null },
  { name: "inference_job_v2", type: "Workflow", modified: "Yesterday", icon: WorkflowsIcon, status: "Failed" },
]

const STATUS_VARIANT: Record<string, "default" | "lime" | "coral" | "indigo"> = {
  Running: "indigo",
  Success: "lime",
  Failed: "coral",
}

export default function ShellDemoPage() {
  const [activeItem, setActiveItem] = React.useState("workspace")

  return (
    <AppShell activeItem={activeItem} onNavigate={setActiveItem} workspace="Production">
      <div className="flex flex-col gap-6 p-6">
        {/* Page header */}
        <PageHeader
          breadcrumbs={
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Production</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Workspace</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
          title="Welcome to Databricks"
          titleIcons={
            <Button variant="ghost" size="icon-xs" aria-label="Copy link">
              <Copy className="h-4 w-4" />
            </Button>
          }
          actions={
            <>
              <Button variant="ghost" size="icon-xs" aria-label="More options">
                <MoreVertical className="h-4 w-4" />
              </Button>
              <Button size="sm">Create</Button>
            </>
          }
        />

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active jobs", value: "12", delta: "+3 today" },
            { label: "Tables accessed", value: "48", delta: "this week" },
            { label: "Compute hours", value: "204", delta: "this month" },
          ].map((stat) => (
            <Card key={stat.label} className="flex flex-col gap-1 p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.delta}</p>
            </Card>
          ))}
        </div>

        {/* Recents table */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Recents</h2>
          </div>

          <Card className="overflow-hidden p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Modified</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT_ITEMS.map((item) => (
                  <TableRow key={item.name} className="cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-semibold text-foreground">
                          {item.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.type}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.modified}
                    </TableCell>
                    <TableCell>
                      {item.status && (
                        <Badge variant={STATUS_VARIANT[item.status] ?? "default"}>
                          {item.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Star className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
