import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./contexts/AppContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { I18nProvider } from "./hooks/useI18n";
import { Home } from "./pages/Home";
import { TextInput } from "./pages/TextInput";
import { VoiceInput } from "./pages/VoiceInput";
import { Result } from "./pages/Result";
import { History } from "./pages/History";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/text-input" component={TextInput} />
      <Route path="/voice-input" component={VoiceInput} />
      <Route path="/result" component={Result} />
      <Route path="/history" component={History} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <I18nProvider>
            <AppProvider>
              <Toaster />
              <Router />
            </AppProvider>
          </I18nProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
