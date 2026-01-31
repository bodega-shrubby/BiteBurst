# BiteBurst Settings, Profile, Subscription & Manage Children - Replit Agent Prompt

## Overview
Add Settings, Profile, Subscription, and Manage Children pages to BiteBurst. The Settings page serves as a hub linking to all account management features. Family Plan subscribers can add up to 4 children and switch between profiles. When adding a new child, they complete the same onboarding process as the first child.

## Reference Wireframes
- `/wireframes/settings-page-wireframe.html` - Main settings hub
- `/wireframes/profile-page-wireframe.html` - Edit profile details
- `/wireframes/subscription-page-wireframe.html` - Plan selection
- `/wireframes/manage-children-wireframe.html` - Add/switch children (Family Plan) with full onboarding flow

## Reference Code (Existing Onboarding)
- `/client/src/pages/onboarding/` - Existing onboarding components to reuse
- Key files: `OnboardingContext.tsx`, `AgeStep.tsx`, `CurriculumStep.tsx`, `NameStep.tsx`, etc.

---

## IMPORTANT: Year Group / Grade (Not Age)

**Do NOT use age.** Use Year Group (UK) or Grade (US) based on curriculum selection.

### Year Group Options by Curriculum

**UK Curriculum:**
```typescript
const ukYearGroups = [
  { id: 'year-2', label: 'Year 2', curriculumId: 'uk-ks1' },
  { id: 'year-3', label: 'Year 3', curriculumId: 'uk-ks2' },
  { id: 'year-4', label: 'Year 4', curriculumId: 'uk-ks2' },
  { id: 'year-5', label: 'Year 5', curriculumId: 'uk-ks2' },
  { id: 'year-6', label: 'Year 6', curriculumId: 'uk-ks2' },
  { id: 'year-7', label: 'Year 7', curriculumId: 'uk-ks3' },
  { id: 'year-8', label: 'Year 8', curriculumId: 'uk-ks3' },
  { id: 'year-9', label: 'Year 9', curriculumId: 'uk-ks3' },
];
```

**US Curriculum:**
```typescript
const usGrades = [
  { id: 'grade-1', label: 'Grade 1', curriculumId: 'us-k2' },
  { id: 'grade-2', label: 'Grade 2', curriculumId: 'us-k2' },
  { id: 'grade-3', label: 'Grade 3', curriculumId: 'us-35' },
  { id: 'grade-4', label: 'Grade 4', curriculumId: 'us-35' },
  { id: 'grade-5', label: 'Grade 5', curriculumId: 'us-35' },
  { id: 'grade-6', label: 'Grade 6', curriculumId: 'us-68' },
  { id: 'grade-7', label: 'Grade 7', curriculumId: 'us-68' },
  { id: 'grade-8', label: 'Grade 8', curriculumId: 'us-68' },
];
```

### Question Text
- UK: "What year group is your child in?"
- US: "What grade is your child in?"

---

## Navigation & Access Points

### How Users Access Settings

**1. From Sidebar "More" Button:**
- Update "More" in `Sidebar.tsx` to link to `/settings`

**2. From Profile/Dashboard Page:**
- Add a settings icon (⚙️) in the profile header area
- This icon should link to `/settings`

### Routes to Add
```tsx
// In App.tsx or routes file
<Route path="/settings" component={Settings} />
<Route path="/settings/profile" component={SettingsProfile} />
<Route path="/settings/subscription" component={SettingsSubscription} />
<Route path="/settings/children" component={ManageChildren} />

// Child Onboarding Flow (nested routes)
<Route path="/settings/children/add" component={AddChildOnboarding} />
<Route path="/settings/children/add/name" component={ChildNameStep} />
<Route path="/settings/children/add/year-group" component={ChildYearGroupStep} />
<Route path="/settings/children/add/goal" component={ChildGoalStep} />
<Route path="/settings/children/add/avatar" component={ChildAvatarStep} />
<Route path="/settings/children/add/preferences" component={ChildPreferencesStep} />
<Route path="/settings/children/add/review" component={ChildReviewStep} />
```

---

## Database Schema Updates

### Users Table Update
```sql
-- Add subscription and curriculum fields to users table
ALTER TABLE users ADD COLUMN subscription_plan VARCHAR(20) DEFAULT 'free';
-- Values: 'free', 'individual', 'family'

ALTER TABLE users ADD COLUMN subscription_children_limit INT DEFAULT 1;
-- 1 for free/individual, 2-4 for family

ALTER TABLE users ADD COLUMN is_parent BOOLEAN DEFAULT false;
-- true for parent accounts

ALTER TABLE users ADD COLUMN curriculum_country VARCHAR(10);
-- 'uk' or 'us' - set during initial onboarding, inherited by children
```

### Children Table (Updated - Year Group instead of Age)
```sql
CREATE TABLE children (
  id SERIAL PRIMARY KEY,
  parent_id INT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar VARCHAR(50) DEFAULT '🧒',

  -- Year Group / Grade (NOT age)
  year_group VARCHAR(20) NOT NULL, -- e.g., 'year-5', 'grade-3'
  curriculum_id VARCHAR(20) NOT NULL, -- e.g., 'uk-ks2', 'us-35'

  -- Learning preferences
  goal VARCHAR(100),
  favorite_fruits TEXT[], -- Array of fruits
  favorite_veggies TEXT[], -- Array of veggies
  favorite_foods TEXT[], -- Array of foods
  favorite_sports TEXT[], -- Array of sports

  -- Progress tracking
  xp INT DEFAULT 0,
  streak INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX idx_children_parent_id ON children(parent_id);
```

### Active Child Tracking
```sql
-- Add active_child_id to users (for family plan parents)
ALTER TABLE users ADD COLUMN active_child_id INT REFERENCES children(id);
```

---

## API Endpoints

### Subscription Endpoints
```typescript
// GET /api/subscription - Get current subscription status
interface SubscriptionResponse {
  plan: 'free' | 'individual' | 'family';
  childrenLimit: number;
  childrenCount: number;
  curriculumCountry: 'uk' | 'us'; // Inherited by all children
  children: Child[];
}

// POST /api/subscription - Update subscription (for testing without payment)
interface UpdateSubscriptionRequest {
  plan: 'free' | 'individual' | 'family';
  childrenLimit?: number; // 2-4 for family plan
}
```

### Children Endpoints
```typescript
// GET /api/children - Get all children for current user
// Returns array of Child objects

// POST /api/children - Add a new child (after completing onboarding)
interface AddChildRequest {
  name: string;
  username: string;
  avatar: string;
  yearGroup: string; // e.g., 'year-5', 'grade-3'
  curriculumId: string; // e.g., 'uk-ks2', 'us-35'
  goal?: string;
  favoriteFruits?: string[];
  favoriteVeggies?: string[];
  favoriteFoods?: string[];
  favoriteSports?: string[];
}

// PUT /api/children/:id - Update a child's profile
// DELETE /api/children/:id - Remove a child

// POST /api/children/:id/switch - Switch to this child's profile
// Sets active_child_id on parent user
```

---

## Child Onboarding Flow (7 Steps)

When "Add Another Child" is clicked, navigate to `/settings/children/add` and start the onboarding flow.

### Onboarding Steps for New Child

**Step 1: Name** (`/settings/children/add/name`)
- Reuse existing `NameStep.tsx` component
- Ask: "What's your child's name?"

**Step 2: Year Group / Grade** (`/settings/children/add/year-group`)
- Reuse logic from `AgeStep.tsx`
- Question based on family's curriculum:
  - UK: "What year group is your child in?"
  - US: "What grade is your child in?"
- Show grid of year groups/grades
- Curriculum is inherited from family account (set during parent's initial onboarding)

**Step 3: Goal** (`/settings/children/add/goal`)
- Reuse existing `GoalStep.tsx` component
- Options: "Build healthy habits", "Improve sports performance", "Learn food science"

**Step 4: Avatar** (`/settings/children/add/avatar`)
- Reuse existing `AvatarStep.tsx` component
- Grid of emoji avatars to choose from

**Step 5-6: Preferences** (`/settings/children/add/preferences`)
- Combine or step through:
  - Favorite Fruits (`FruitsStep.tsx`)
  - Favorite Veggies (`VeggiesStep.tsx`)
  - Favorite Foods (`FoodsStep.tsx`)
  - Favorite Sports (`SportsStep.tsx`)

**Step 7: Review** (`/settings/children/add/review`)
- Reuse logic from `ReviewStep.tsx`
- Show summary of all entered data
- "Add Child to Family" button
- On success, redirect to `/settings/children`

### Child Onboarding Context

Create a separate context for child onboarding (or reuse OnboardingContext with a flag):

```tsx
// client/src/pages/settings/children/AddChildContext.tsx

interface ChildOnboardingProfile {
  name: string;
  username: string;
  yearGroup: string;
  curriculumId: string;
  goal: string;
  avatar: string;
  favoriteFruits: string[];
  favoriteVeggies: string[];
  favoriteFoods: string[];
  favoriteSports: string[];
}

interface AddChildContextType {
  profile: ChildOnboardingProfile;
  updateProfile: (updates: Partial<ChildOnboardingProfile>) => void;
  resetProfile: () => void;
  curriculumCountry: 'uk' | 'us'; // From parent's subscription
}
```

### Year Group Step Component

```tsx
// Adapts existing AgeStep.tsx for child onboarding

export default function ChildYearGroupStep() {
  const { profile, updateProfile, curriculumCountry } = useAddChildContext();
  const [selectedYearGroup, setSelectedYearGroup] = useState(profile.yearGroup || "");

  const yearGroupOptions = useMemo(() => {
    return getYearGroupOptions(curriculumCountry);
  }, [curriculumCountry]);

  const questionText = curriculumCountry === "uk"
    ? "What year group is your child in?"
    : "What grade is your child in?";

  const handleYearGroupSelect = (option: YearGroupOption) => {
    setSelectedYearGroup(option.id);
    updateProfile({
      yearGroup: option.id,
      curriculumId: option.curriculumId
    });
  };

  return (
    <ChildOnboardingLayout step={2} totalSteps={7}>
      <h1 className="font-extrabold text-3xl">{questionText}</h1>
      <p className="text-gray-500 mb-6">
        Based on {curriculumCountry === 'uk' ? 'UK' : 'US'} curriculum
      </p>

      <div className="grid grid-cols-2 gap-3">
        {yearGroupOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleYearGroupSelect(option)}
            className={`px-4 py-4 text-lg font-bold rounded-2xl border-2 transition ${
              selectedYearGroup === option.id
                ? 'border-orange-500 bg-orange-500 text-white'
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {selectedYearGroup && (
        <Button onClick={() => navigate('/settings/children/add/goal')}>
          NEXT
        </Button>
      )}
    </ChildOnboardingLayout>
  );
}
```

---

## Page 1: Settings (Main Hub)

**File:** `client/src/pages/Settings.tsx`

### Conditional Rendering Logic
```tsx
const { data: subscription } = useQuery(['subscription'], fetchSubscription);
const isFamilyPlan = subscription?.plan === 'family';
const activeChild = subscription?.children?.find(c => c.isActive);
const curriculumLabel = subscription?.curriculumCountry === 'uk' ? '🇬🇧 UK' : '🇺🇸 US';
```

Show "Manage Children" option only for Family Plan subscribers.

---

## Page 2: Manage Children (Family Plan Only)

**File:** `client/src/pages/ManageChildren.tsx`

### Display Year Group in Child Cards

```tsx
function ChildCard({ child, isActive, onSwitch, onEdit }: ChildCardProps) {
  // Format year group label for display
  const yearGroupLabel = child.yearGroup.startsWith('year-')
    ? child.yearGroup.replace('year-', 'Year ')
    : child.yearGroup.replace('grade-', 'Grade ');

  return (
    <div className={`bg-white rounded-2xl border-2 p-4 ${isActive ? 'border-orange-500' : 'border-gray-200'}`}>
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">{child.avatar}</span>
        </div>
        <div>
          <p className="font-bold text-gray-900">{child.name}</p>
          <p className="text-sm text-gray-500">
            @{child.username} • <span className="text-orange-600 font-medium">{yearGroupLabel}</span>
          </p>
          <div className="flex items-center space-x-2 mt-1">
            {child.streak > 0 && (
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                🔥 {child.streak} day streak
              </span>
            )}
            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
              {child.xp} XP
            </span>
          </div>
        </div>
      </div>
      {/* Switch and Edit buttons */}
    </div>
  );
}
```

### Add Child Button - Navigates to Onboarding

```tsx
{canAddMore && (
  <button
    onClick={() => navigate('/settings/children/add/name')}
    className="w-full bg-white rounded-2xl border-2 border-dashed border-gray-300 p-5 hover:border-orange-300 hover:bg-orange-50 transition"
  >
    <div className="flex items-center justify-center space-x-3">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-2xl text-gray-400">+</span>
      </div>
      <div className="text-left">
        <p className="font-semibold text-gray-700">Add Another Child</p>
        <p className="text-sm text-gray-500">
          {childrenLimit - children.length} spot(s) remaining • Starts onboarding
        </p>
      </div>
    </div>
  </button>
)}
```

### Plan Info Banner with Curriculum

```tsx
<div className="bg-purple-50 rounded-2xl p-4 mb-6 flex items-center justify-between border border-purple-100">
  <div className="flex items-center space-x-3">
    <span className="text-2xl">👨‍👩‍👧‍👦</span>
    <div>
      <p className="font-semibold text-purple-800">Family Plan</p>
      <p className="text-sm text-purple-600">{children.length} of {childrenLimit} children added</p>
    </div>
  </div>
  <div className="flex items-center space-x-2">
    <span className="text-xs bg-white text-purple-600 px-2 py-1 rounded-full border border-purple-200">
      {curriculumCountry === 'uk' ? '🇬🇧 UK Curriculum' : '🇺🇸 US Curriculum'}
    </span>
  </div>
</div>
```

---

## Implementation Checklist

### Database & API
- [ ] Update users table with subscription and curriculum fields
- [ ] Create `children` table with `year_group` field (NOT age)
- [ ] Add `active_child_id` to users table
- [ ] Create GET `/api/subscription` endpoint (include curriculumCountry)
- [ ] Create POST `/api/subscription` endpoint (test mode - no payment)
- [ ] Create CRUD endpoints for `/api/children`
- [ ] Create POST `/api/children/:id/switch` endpoint

### Child Onboarding Flow
- [ ] Create `AddChildContext.tsx` for child onboarding state
- [ ] Create `ChildOnboardingLayout.tsx` (similar to existing OnboardingLayout)
- [ ] Create/adapt step components:
  - [ ] `ChildNameStep.tsx`
  - [ ] `ChildYearGroupStep.tsx` (Year/Grade based on curriculum)
  - [ ] `ChildGoalStep.tsx`
  - [ ] `ChildAvatarStep.tsx`
  - [ ] `ChildPreferencesStep.tsx` (Fruits, Veggies, Foods, Sports)
  - [ ] `ChildReviewStep.tsx`
- [ ] Wire up routes for child onboarding flow

### Manage Children Page
- [ ] Display Year Group/Grade (not age) for each child
- [ ] Show curriculum badge in plan info banner
- [ ] "Add Child" button navigates to onboarding flow
- [ ] Switch between children
- [ ] Edit child profiles

### Settings & Subscription Pages
- [ ] Show curriculum country in subscription details
- [ ] Redirect to Manage Children after selecting Family Plan

---

## Testing Scenarios

### Test Case 1: Add Child (UK Curriculum)
1. As Family Plan user with UK curriculum
2. Click "Add Another Child"
3. Complete onboarding:
   - Enter name: "Maya"
   - Select year group: "Year 4"
   - Select goal: "Build healthy habits"
   - Pick avatar
   - Select preferences
4. Review and confirm
5. Verify child appears in Manage Children with "Year 4" label

### Test Case 2: Add Child (US Curriculum)
1. As Family Plan user with US curriculum
2. Click "Add Another Child"
3. Onboarding should show "What grade is your child in?"
4. Select: "Grade 3"
5. Verify child appears with "Grade 3" label

### Test Case 3: Curriculum Inheritance
1. Parent has UK curriculum set
2. Add new child
3. Year Group step should only show UK options (Year 2-9)
4. Curriculum ID should be set correctly (e.g., 'uk-ks2')

---

## Data Types Reference

```typescript
interface Child {
  id: number;
  parentId: number;
  name: string;
  username: string;
  avatar: string;
  yearGroup: string; // e.g., 'year-5', 'grade-3'
  curriculumId: string; // e.g., 'uk-ks2', 'us-35'
  goal?: string;
  favoriteFruits?: string[];
  favoriteVeggies?: string[];
  favoriteFoods?: string[];
  favoriteSports?: string[];
  xp: number;
  streak: number;
  isActive: boolean;
  createdAt: string;
}

interface Subscription {
  plan: 'free' | 'individual' | 'family';
  childrenLimit: number;
  childrenCount: number;
  curriculumCountry: 'uk' | 'us';
  children: Child[];
}

interface YearGroupOption {
  id: string;
  label: string;
  curriculumId: string;
}
```

---

## Subscription Plans Reference

| Plan | Price | Children | Features |
|------|-------|----------|----------|
| Free | $0 | 1 | Ads, limited bursts, basic lessons |
| Individual | $4.50/mo | 1 | Ad-free, unlimited bursts, personalized practice, parent tracking |
| Family | $7.99/mo | 2-4 | All Individual features for multiple children, switch profiles |

### Benefits (Pro Plans)
1. **Ad-free experience** - No interruptions during lessons
2. **Unlimited bursts/lives** - No caps on retries or practice
3. **Personalized practice** - Lessons adapt to knowledge gaps
4. **Parent progress tracking** - See habits learned and progress made
