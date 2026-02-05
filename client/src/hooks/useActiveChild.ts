import { useQuery } from "@tanstack/react-query";
import { Child } from "@shared/schema";

interface AuthUser {
  id: string;
  displayName: string;
  avatarId?: string | null;
  goal?: string;
  activeChildId?: string;
}

export interface ActiveChildProfile {
  type: 'primary' | 'additional';
  id: string;
  childId?: string;
  name: string;
  avatar: string;
  goal: string | null;
  age: number | null;
  locale: string | null;
  xp: number | null;
  streak: number | null;
}

export function useActiveChild(user: AuthUser | null | undefined) {
  const { data: subscriptionData } = useQuery<{
    plan: string;
    childrenLimit: number;
    children: Array<{
      id: string;
      type: 'primary' | 'additional';
      name: string;
      avatar: string;
      age: number;
      locale: string;
      goal: string | null;
      xp: number;
      streak: number;
    }>;
  }>({
    queryKey: ['/api/settings/subscription'],
    enabled: !!user,
  });

  if (!user) {
    return null;
  }

  const activeChildId = user.activeChildId;

  if (activeChildId && subscriptionData?.children) {
    const additionalChild = subscriptionData.children.find(
      c => c.type === 'additional' && c.id === activeChildId
    );
    if (additionalChild) {
      return {
        type: 'additional' as const,
        id: user.id,
        childId: additionalChild.id,
        name: additionalChild.name,
        avatar: additionalChild.avatar,
        goal: additionalChild.goal,
        age: additionalChild.age,
        locale: additionalChild.locale,
        xp: additionalChild.xp,
        streak: additionalChild.streak,
      };
    }
  }

  // Get primary child from subscription data
  const primaryChild = subscriptionData?.children?.find(c => c.type === 'primary');

  return {
    type: 'primary' as const,
    id: user.id,
    childId: primaryChild?.id,
    name: primaryChild?.name || user.displayName,
    avatar: primaryChild?.avatar || user.avatarId || 'child',
    goal: primaryChild?.goal || user.goal || null,
    age: primaryChild?.age || null,
    locale: primaryChild?.locale || 'en-GB',
    xp: primaryChild?.xp || 0,
    streak: primaryChild?.streak || 0,
  };
}
