import { useQuery } from "@tanstack/react-query";
import { Child } from "@shared/schema";

interface AuthUser {
  id: string;
  displayName: string;
  avatarId?: string | null;
  goal?: string;
  yearGroup?: string;
  curriculum?: string;
  activeChildId?: string;
}

export interface ActiveChildProfile {
  type: 'primary' | 'additional';
  id: string;
  childId?: string;
  name: string;
  avatar: string;
  goal: string | null;
  yearGroup: string | null;
  curriculumId: string | null;
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
      yearGroup: string;
      curriculumId: string;
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
        yearGroup: additionalChild.yearGroup,
        curriculumId: additionalChild.curriculumId,
        xp: additionalChild.xp,
        streak: additionalChild.streak,
      };
    }
  }

  return {
    type: 'primary' as const,
    id: user.id,
    childId: undefined,
    name: user.displayName,
    avatar: user.avatarId || 'child',
    goal: user.goal || null,
    yearGroup: user.yearGroup || null,
    curriculumId: user.curriculum || null,
    xp: 0,
    streak: 0,
  };
}
