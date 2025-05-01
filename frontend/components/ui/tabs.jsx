"use client";
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col", className)} {...props} />
  );
}

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("inline-flex w-full border-b border-gray-200", className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative -mb-px inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600",
        "focus:outline-none",
        "data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("mt-6 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
