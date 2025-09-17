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
import Leaderboard from "@/pages/Leaderboard";
import Achievements from "@/pages/Achievements";
import Lessons from "@/pages/Lessons";
import LessonDemo from "@/pages/LessonDemo";
import FuelForFootball from "@/pages/lessons/FuelForFootball";
import Streak from "@/pages/Streak";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";

// Onboarding components
import { OnboardingProvider } from "@/pages/onboarding/OnboardingContext";
import MascotIntroStep from "@/pages/onboarding/MascotIntroStep";
import QuickQuestionsStep from "@/pages/onboarding/QuickQuestionsStep";
import NameStep from "@/pages/onboarding/NameStep";
import AgeStep from "@/pages/onboarding/AgeStep";
import GoalStep from "@/pages/onboarding/GoalStep";
import FruitsStep from "@/pages/onboarding/FruitsStep";
import VeggiesStep from "@/pages/onboarding/VeggiesStep";
import FoodsStep from "@/pages/onboarding/FoodsStep";
import SportsStep from "@/pages/onboarding/SportsStep";
import AvatarStep from "@/pages/onboarding/AvatarStep";
import EmailStep from "@/pages/onboarding/EmailStep";
import PasswordStep from "@/pages/onboarding/PasswordStep";
import ConsentStep from "@/pages/onboarding/ConsentStep";
import ReviewStep from "@/pages/onboarding/ReviewStep";

function OnboardingRoutes() {
  return (
    <OnboardingProvider>
      <Switch>
        <Route path="/profile/intro" component={MascotIntroStep} />
        <Route path="/profile/questions" component={QuickQuestionsStep} />
        <Route path="/profile/name" component={NameStep} />
        <Route path="/profile/age" component={AgeStep} />
        <Route path="/profile/goal" component={GoalStep} />
        <Route path="/profile/preferences/fruits" component={FruitsStep} />
        <Route path="/profile/preferences/veggies" component={VeggiesStep} />
        <Route path="/profile/preferences/foods" component={FoodsStep} />
        <Route path="/profile/preferences/sports" component={SportsStep} />
        <Route path="/profile/avatar" component={AvatarStep} />
        <Route path="/profile/email" component={EmailStep} />
        <Route path="/profile/password" component={PasswordStep} />
        <Route path="/profile/consent" component={ConsentStep} />
        <Route path="/profile/review" component={ReviewStep} />
      </Switch>
    </OnboardingProvider>
  );
}

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
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/lessons" component={Lessons} />
      <Route path="/lesson/demo" component={LessonDemo} />
      <Route path="/lesson/fuel-for-football" component={FuelForFootball} />
      <Route path="/streak" component={Streak} />
      
      {/* Onboarding Flow - Single Provider */}
      <Route path="/profile/intro" component={OnboardingRoutes} />
      <Route path="/profile/questions" component={OnboardingRoutes} />
      <Route path="/profile/name" component={OnboardingRoutes} />
      <Route path="/profile/age" component={OnboardingRoutes} />
      <Route path="/profile/goal" component={OnboardingRoutes} />
      <Route path="/profile/preferences/fruits" component={OnboardingRoutes} />
      <Route path="/profile/preferences/veggies" component={OnboardingRoutes} />
      <Route path="/profile/preferences/foods" component={OnboardingRoutes} />
      <Route path="/profile/preferences/sports" component={OnboardingRoutes} />
      <Route path="/profile/avatar" component={OnboardingRoutes} />
      <Route path="/profile/email" component={OnboardingRoutes} />
      <Route path="/profile/password" component={OnboardingRoutes} />
      <Route path="/profile/consent" component={OnboardingRoutes} />
      <Route path="/profile/review" component={OnboardingRoutes} />
      
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
