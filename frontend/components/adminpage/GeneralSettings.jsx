"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";

export default function AIBotSettings() {
  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    botName: "Ansökshjälpen-AI",
    welcomeMessage:
      "Hej! Jag är Ansökshjälpen-AI och jag hjälper dig att fylla i din ansökan om arbetshjälpmedel till Försäkringskassan. Hur kan jag hjälpa dig idag?",
    enabled: true,
    saveHistory: true,
    sessionTimeout: 30,
  });

  // AI model config state
  const [modelConfig, setModelConfig] = useState({
    model: "gpt-4.1-mini",
    temperature: 1.0,
    maxTokens: 2048,
  });

  // Handle general settings changes
  const handleGeneralSettingChange = (field, value) => {
    setGeneralSettings({
      ...generalSettings,
      [field]: value,
    });
  };

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
  const handleMaxTokensChange = (e) => {
    setModelConfig({
      ...modelConfig,
      maxTokens: parseInt(e.target.value, 10),
    });
  };

  // Save all settings to backend
  const handleSave = () => {
    console.log("Saving combined settings:", {
      general: generalSettings,
      model: modelConfig,
    });
    // Implement actual API call here
  };

  return (
    <div className="space-y-6">
      {/* General Settings Card */}
      <Card className="w-full shadow-sm">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Grundinställningar</CardTitle>
            <CardDescription>
              Hantera grundläggande inställningar för AI-assistenten.
            </CardDescription>
          </div>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Spara ändringar
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Namn på assistenten</Label>
            <Input
              id="bot-name"
              value={generalSettings.botName}
              onChange={(e) => handleGeneralSettingChange("botName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="welcome-message">Välkomstmeddelande</Label>
            <Textarea
              id="welcome-message"
              value={generalSettings.welcomeMessage}
              onChange={(e) => handleGeneralSettingChange("welcomeMessage", e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="bot-enabled" className="cursor-pointer">
              Aktivera assistenten
            </Label>
            <Switch
              id="bot-enabled"
              checked={generalSettings.enabled}
              onCheckedChange={(checked) => handleGeneralSettingChange("enabled", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="save-history" className="cursor-pointer">
              Spara konversationshistorik
            </Label>
            <Switch
              id="save-history"
              checked={generalSettings.saveHistory}
              onCheckedChange={(checked) => handleGeneralSettingChange("saveHistory", checked)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="session-timeout">Sessionstid (dagar)</Label>
            <Input
              id="session-timeout"
              type="number"
              value={generalSettings.sessionTimeout}
              onChange={(e) =>
                handleGeneralSettingChange("sessionTimeout", parseInt(e.target.value))
              }
            />
            <p className="text-muted-foreground text-xs">
              Antal dagar som användardata sparas innan den automatiskt raderas.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Model Configuration Card */}
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">AI-Modell Konfiguration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ai-model" className="text-sm font-medium">
              AI-modell
            </Label>
            <Select value={modelConfig.model} onValueChange={handleModelChange}>
              <SelectTrigger id="ai-model" className="w-full">
                <SelectValue placeholder="Välj modell" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4.1-mini">GPT-4.1-mini</SelectItem>
                <SelectItem value="gpt-4.1">GPT-4.1</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
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
            <Input
              id="max-tokens"
              type="number"
              value={modelConfig.maxTokens}
              onChange={handleMaxTokensChange}
              className="w-full"
            />
            <p className="text-muted-foreground text-xs">
              Maximala antalet tokens som kan genereras i ett svar.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
