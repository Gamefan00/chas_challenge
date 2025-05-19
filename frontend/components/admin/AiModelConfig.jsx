"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIModelConfig({
  defaultModel = "gpt-4.1-mini",
  defaultTemperature = 1.0,
  defaultMaxTokens = 2048,
  onConfigChange,
}) {
  const [model, setModel] = useState(defaultModel);
  const [temperature, setTemperature] = useState(defaultTemperature);
  const [maxTokens, setMaxTokens] = useState(defaultMaxTokens);

  const handleModelChange = (value) => {
    setModel(value);
    if (onConfigChange) {
      onConfigChange({ model: value, temperature, maxTokens });
    }
  };

  const handleTemperatureChange = (value) => {
    const newTemperature = value[0];
    setTemperature(newTemperature);
    if (onConfigChange) {
      onConfigChange({ model, temperature: newTemperature, maxTokens });
    }
  };

  const handleMaxTokensChange = (e) => {
    const newMaxTokens = parseInt(e.target.value, 10);
    setMaxTokens(newMaxTokens);
    if (onConfigChange) {
      onConfigChange({ model, temperature, maxTokens: newMaxTokens });
    }
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground text-lg font-semibold">
          AI-Modell Konfiguration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="ai-model" className="text-muted-foreground text-sm font-medium">
            AI-modell
          </Label>
          <Select value={model} onValueChange={handleModelChange}>
            <SelectTrigger id="ai-model" className="w-full bg-white">
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
            <Label htmlFor="temperature" className="text-muted-foreground text-sm font-medium">
              Temperatur
            </Label>
            <span className="text-sm font-medium">{temperature.toFixed(1)}</span>
          </div>
          <Slider
            id="temperature"
            defaultValue={[temperature]}
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
          <Label htmlFor="max-tokens" className="text-muted-foreground text-sm font-medium">
            Max tokens
          </Label>
          <Input
            id="max-tokens"
            type="number"
            value={maxTokens}
            onChange={handleMaxTokensChange}
            className="w-full bg-white"
          />
          <p className="text-muted-foreground text-xs">
            Maximala antalet tokens som kan genereras i ett svar.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
