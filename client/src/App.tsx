import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/Dashboard";
import DashboardV2 from "@/pages/DashboardV2";
import DashboardRedesign from "@/pages/DashboardRedesign";
import FoodLog from "@/pages/FoodLog";
import FoodLogNew from "@/pages/FoodLogNew";
import ActivityLog from "@/pages/ActivityLog";
import ActivityLogNew from "@/pages/ActivityLogNew";
import Success from "@/pages/Success";
import Feedback from "@/pages/Feedback";
import Leaderboard from "@/pages/Leaderboard";
import Achievements from "@/pages/Achievements";
import Lessons from "@/pages/Lessons";
import LessonDemo from "@/pages/LessonDemo";
import FuelForFootball from "@/pages/lessons/FuelForFootball";
import BrainFuelForSchool from "@/pages/lessons/BrainFuelForSchool";
import LessonPlayer from "@/pages/lessons/LessonPlayer";
import Streak from "@/pages/Streak";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";

// Settings pages
import Settings from "@/pages/settings/Settings";
import Profile from "@/pages/settings/Profile";
import Subscription from "@/pages/settings/Subscription";
import ManageChildren from "@/pages/settings/ManageChildren";

// Child onboarding components
import { AddChildProvider } from "@/pages/settings/children/AddChildContext";
import ChildNameStep from "@/pages/settings/children/ChildNameStep";
import ChildAgeStep from "@/pages/settings/children/ChildAgeStep";
import ChildGoalStep from "@/pages/settings/children/ChildGoalStep";
import ChildFruitsStep from "@/pages/settings/children/ChildFruitsStep";
import ChildVeggiesStep from "@/pages/settings/children/ChildVeggiesStep";
import ChildFoodsStep from "@/pages/settings/children/ChildFoodsStep";
import ChildSportsStep from "@/pages/settings/children/ChildSportsStep";
import ChildAvatarStep from "@/pages/settings/children/ChildAvatarStep";
import ChildReviewStep from "@/pages/settings/children/ChildReviewStep";

// Onboarding components
import { OnboardingProvider } from "@/pages/onboarding/OnboardingContext";
import MascotIntroStep from "@/pages/onboarding/MascotIntroStep";
import QuickQuestionsStep from "@/pages/onboarding/QuickQuestionsStep";
import NameStep from "@/pages/onboarding/NameStep";
import LocationStep from "@/pages/onboarding/LocationStep";
import AgeStep from "@/pages/onboarding/AgeStep";
import GoalStep from "@/pages/onboarding/GoalStep";
import FruitsStep from "@/pages/onboarding/FruitsStep";
import VeggiesStep from "@/pages/onboarding/VeggiesStep";
import FoodsStep from "@/pages/onboarding/FoodsStep";
import SportsStep from "@/pages/onboarding/SportsStep";
import AvatarStep from "@/pages/onboarding/AvatarStep";
import EmailStep from "@/pages/onboarding/EmailStep";
import ParentEmailStep from "@/pages/onboarding/ParentEmailStep";
import ParentAccountStep from "@/pages/onboarding/ParentAccountStep";
import PasswordStep from "@/pages/onboarding/PasswordStep";
import ConsentStep from "@/pages/onboarding/ConsentStep";
import ReviewStep from "@/pages/onboarding/ReviewStep";

function OnboardingRoutes() {
  return (
    <OnboardingProvider>
      <Switch>
        <Route path="/profile/intro" component={MascotIntroStep} />
        <Route path="/profile/account" component={ParentAccountStep} />
        <Route path="/profile/questions" component={QuickQuestionsStep} />
        <Route path="/profile/name" component={NameStep} />
        <Route path="/profile/location" component={LocationStep} />
        <Route path="/profile/age" component={AgeStep} />
        <Route path="/profile/goal" component={GoalStep} />
        <Route path="/profile/preferences/fruits" component={FruitsStep} />
        <Route path="/profile/preferences/veggies" component={VeggiesStep} />
        <Route path="/profile/preferences/foods" component={FoodsStep} />
        <Route path="/profile/preferences/sports" component={SportsStep} />
        <Route path="/profile/avatar" component={AvatarStep} />
        <Route path="/profile/email" component={EmailStep} />
        <Route path="/profile/parent-email" component={ParentEmailStep} />
        <Route path="/profile/password" component={PasswordStep} />
        <Route path="/profile/consent" component={ConsentStep} />
        <Route path="/profile/review" component={ReviewStep} />
      </Switch>
    </OnboardingProvider>
  );
}

function AddChildRoutes() {
  return (
    <AddChildProvider>
      <Switch>
        <Route path="/settings/children/add/name" component={ChildNameStep} />
        <Route path="/settings/children/add/age" component={ChildAgeStep} />
        <Route path="/settings/children/add/goal" component={ChildGoalStep} />
        <Route path="/settings/children/add/fruits" component={ChildFruitsStep} />
        <Route path="/settings/children/add/veggies" component={ChildVeggiesStep} />
        <Route path="/settings/children/add/foods" component={ChildFoodsStep} />
        <Route path="/settings/children/add/sports" component={ChildSportsStep} />
        <Route path="/settings/children/add/avatar" component={ChildAvatarStep} />
        <Route path="/settings/children/add/review" component={ChildReviewStep} />
      </Switch>
    </AddChildProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={DashboardRedesign} />
      <Route path="/home" component={DashboardRedesign} />
      <Route path="/dashboard-v2" component={DashboardV2} />
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
      <Route path="/lesson/brainfuel-for-school" component={BrainFuelForSchool} />
      <Route path="/lesson/:lessonId">
        {(params) => <LessonPlayer lessonId={params.lessonId} />}
      </Route>
      <Route path="/streak" component={Streak} />
      
      {/* Settings Pages */}
      <Route path="/settings" component={Settings} />
      <Route path="/settings/profile" component={Profile} />
      <Route path="/settings/subscription" component={Subscription} />
      <Route path="/settings/children" component={ManageChildren} />
      
      {/* Add Child Onboarding Flow */}
      <Route path="/settings/children/add/name" component={AddChildRoutes} />
      <Route path="/settings/children/add/age" component={AddChildRoutes} />
      <Route path="/settings/children/add/goal" component={AddChildRoutes} />
      <Route path="/settings/children/add/fruits" component={AddChildRoutes} />
      <Route path="/settings/children/add/veggies" component={AddChildRoutes} />
      <Route path="/settings/children/add/foods" component={AddChildRoutes} />
      <Route path="/settings/children/add/sports" component={AddChildRoutes} />
      <Route path="/settings/children/add/avatar" component={AddChildRoutes} />
      <Route path="/settings/children/add/review" component={AddChildRoutes} />
      
      {/* Onboarding Flow - Single Provider */}
      <Route path="/profile/intro" component={OnboardingRoutes} />
      <Route path="/profile/account" component={OnboardingRoutes} />
      <Route path="/profile/questions" component={OnboardingRoutes} />
      <Route path="/profile/name" component={OnboardingRoutes} />
      <Route path="/profile/location" component={OnboardingRoutes} />
      <Route path="/profile/age" component={OnboardingRoutes} />
      <Route path="/profile/goal" component={OnboardingRoutes} />
      <Route path="/profile/preferences/fruits" component={OnboardingRoutes} />
      <Route path="/profile/preferences/veggies" component={OnboardingRoutes} />
      <Route path="/profile/preferences/foods" component={OnboardingRoutes} />
      <Route path="/profile/preferences/sports" component={OnboardingRoutes} />
      <Route path="/profile/avatar" component={OnboardingRoutes} />
      <Route path="/profile/email" component={OnboardingRoutes} />
      <Route path="/profile/parent-email" component={OnboardingRoutes} />
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
