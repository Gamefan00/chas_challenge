"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import SaveBtn from "@/components/admin/SaveBtn";
import { StatusMessage } from "@/components/admin/StatusMessage";

export default function AIBotSettings() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // AI model config state
  const [modelConfig, setModelConfig] = useState({
    model: "gpt-4.1-mini",
    temperature: 1.0,
    maxTokens: 2048,
  });

  // Load settings from database on component mount
  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${BASE_URL}/settingsRoutes/aiModelConfig`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          console.error(`API Error: ${response.status} - ${response.statusText}`);
          throw new Error(`Det gick inte att ladda inställningarna (${response.status})`);
        }

        const data = await response.json();
        console.log("Received settings data:", data);

        if (data && data.modelConfig) {
          setModelConfig({
            model: data.modelConfig.model || "gpt-4.1-mini",
            temperature: data.modelConfig.temperature || 1.0,
            maxTokens: data.modelConfig.maxTokens || 2048,
          });
        } else {
          console.warn("No model config found in API response");
        }
      } catch (err) {
        console.error("Error loading model configuration:", err);
        setError(err.message || "Det gick inte att ladda inställningarna");
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, [BASE_URL]);

  // Handle model changes
  const handleModelChange = (value) => {
    setModelConfig({
      ...modelConfig,
      model: value,
    });
  };

  // Handle temperature changes
  const handleTemperatureChange = (value) => {
    setModelConfig({
      ...modelConfig,
      temperature: value[0],
    });
  };

  // Handle max tokens changes
  const handleMaxTokensChange = (value) => {
    setModelConfig({
      ...modelConfig,
      maxTokens: value,
    });
  };

  // Save all settings to backend
  const handleSave = async () => {
    console.log("Saving combined settings:", {
      modelConfig,
    });

    try {
      setSaveStatus({ type: "loading", message: "Sparar..." });

      const response = await fetch(`${BASE_URL}/settingsRoutes/aiModelConfig`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          modelConfig,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      setSaveStatus({ type: "success", message: "Inställningarna har sparats" });

      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus({ type: "error", message: "Det gick inte att spara inställningarna" });
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex min-h-[300px] items-center justify-center pt-6">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p>Laddar inställningar...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      {/* AI Model Configuration Card */}
      <Card className="w-full shadow-sm">
        <CardHeader className="flex justify-between">
          <CardTitle className="text-lg font-semibold">AI-Modell Konfiguration</CardTitle>
          <SaveBtn onClick={handleSave} status={saveStatus} />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status messages */}
          {error && (
            <div className="border-destructive bg-destructive/10 text-destructive flex items-center rounded-md border p-3">
              <AlertCircle className="mr-2 h-4 w-4" />
              {error}
            </div>
          )}

          <StatusMessage status={saveStatus} />
          <div className="space-y-2">
            <Label htmlFor="ai-model" className="text-sm font-medium">
              AI-modell
            </Label>
            <Select value={modelConfig.model} onValueChange={handleModelChange}>
              <SelectTrigger id="ai-model" className="w-full">
                <SelectValue placeholder="Välj modell" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4.1">GPT-4.1</SelectItem>
                <SelectItem value="gpt-4.1-mini">GPT-4.1-mini</SelectItem>
                <SelectItem value="gpt-4.1-nano">GPT-4.1-nano</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Den AI-modell som används för att generera svar.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature" className="text-sm font-medium">
                Temperatur
              </Label>
              <span className="text-sm font-medium">{modelConfig.temperature.toFixed(1)}</span>
            </div>
            <Slider
              id="temperature"
              value={[modelConfig.temperature]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={handleTemperatureChange}
              className="w-full"
            />
            <p className="text-muted-foreground text-xs">
              Lägre värden ger mer konsekventa svar, högre värden ger mer kreativa svar.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-tokens" className="text-sm font-medium">
              Max tokens
            </Label>
            <Select value={modelConfig.maxTokens} onValueChange={handleMaxTokensChange}>
              <SelectTrigger id="max-tokens" className="w-full">
                <SelectValue placeholder="Maximala antalet tokens" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={256}>256 - Idealiskt för snabba svar</SelectItem>
                <SelectItem value={1024}>1024 - Standardanvändning</SelectItem>
                <SelectItem value={2048}>2048 - Bra för detaljerade svar</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Maximala antalet tokens som kan genereras i ett svar.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
