import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/Dashboard";
import DashboardV2 from "@/pages/DashboardV2";
import FoodLog from "@/pages/FoodLog";
import FoodLogNew from "@/pages/FoodLogNew";
import ActivityLog from "@/pages/ActivityLog";
import Success from "@/pages/Success";
import Feedback from "@/pages/Feedback";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";

// Onboarding components
import { OnboardingProvider } from "@/pages/onboarding/OnboardingContext";
import WelcomeStep from "@/pages/onboarding/WelcomeStep";
import NameStep from "@/pages/onboarding/NameStep";
import AgeStep from "@/pages/onboarding/AgeStep";
import GoalStep from "@/pages/onboarding/GoalStep";
import AvatarStep from "@/pages/onboarding/AvatarStep";
import EmailStep from "@/pages/onboarding/EmailStep";
import PasswordStep from "@/pages/onboarding/PasswordStep";
import ConsentStep from "@/pages/onboarding/ConsentStep";
import ReviewStep from "@/pages/onboarding/ReviewStep";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={DashboardV2} />
      <Route path="/home" component={DashboardV2} />
      <Route path="/dashboard-v1" component={Dashboard} />
      <Route path="/food-log" component={FoodLogNew} />
      <Route path="/activity-log" component={ActivityLog} />
      <Route path="/success" component={Success} />
      <Route path="/feedback" component={Feedback} />
      
      {/* Onboarding Flow */}
      <Route path="/start">
        <OnboardingProvider>
          <WelcomeStep />
        </OnboardingProvider>
      </Route>
      
      <Route path="/profile/name">
        <OnboardingProvider>
          <NameStep />
        </OnboardingProvider>
      </Route>
      
      <Route path="/profile/age">
        <OnboardingProvider>
          <AgeStep />
        </OnboardingProvider>
      </Route>
      
      <Route path="/profile/goal">
        <OnboardingProvider>
          <GoalStep />
        </OnboardingProvider>
      </Route>
      
      <Route path="/profile/avatar">
        <OnboardingProvider>
          <AvatarStep />
        </OnboardingProvider>
      </Route>
      
      <Route path="/profile/email">
        <OnboardingProvider>
          <EmailStep />
        </OnboardingProvider>
      </Route>
      
      <Route path="/profile/password">
        <OnboardingProvider>
          <PasswordStep />
        </OnboardingProvider>
      </Route>
      
      <Route path="/profile/consent">
        <OnboardingProvider>
          <ConsentStep />
        </OnboardingProvider>
      </Route>
      
      <Route path="/profile/review">
        <OnboardingProvider>
          <ReviewStep />
        </OnboardingProvider>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
