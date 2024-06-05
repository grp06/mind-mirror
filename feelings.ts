export interface FeelingCategory {
  level0: string;
  level1: string[];
  level2: string[];
}

export const feelingCategories: FeelingCategory[] = [
  {
    level0: "Happy",
    level1: [
      "Optimistic",
      "Trusting",
      "Peaceful",
      "Powerful",
      "Accepted",
      "Proud",
      "Interested",
      "Content",
      "Playful",
      "Excited",
      "Amazed",
      "Energetic",
      "Eager",
      "Joyful",
      "Free"
    ],
    level2: [
      "Hopeful",
      "Inspired",
      "Sensitive",
      "Intimate",
      "Cheeky",
      "Curious",
      "Valued",
      "Respected",
      "Successful",
      "Confident",
      "Creative",
      "Courageous",
      "Loving",
      "Thankful"
    ]
  },
  {
    level0: "Sad",
    level1: [
      "Lonely",
      "Vulnerable",
      "Despair",
      "Guilty",
      "Depressed",
      "Hurt",
      "Disappointed",
      "Disapproving",
      "Ashamed",
      "Empty",
      "Remorseful"
    ],
    level2: [
      "Grief",
      "Fragile",
      "Abandoned",
      "Isolated",
      "Victimized",
      "Powerless"
    ]
  },
  {
    level0: "Disgusted",
    level1: [
      "Disapproving",
      "Disappointed",
      "Awful",
      "Repelled"
    ],
    level2: [
      "Judgmental",
      "Embarrassed",
      "Appalled",
      "Revolted",
      "Horrified",
      "Nauseated",
      "Detestable",
      "Hesitant"
    ]
  },
  {
    level0: "Angry",
    level1: [
      "Let down",
      "Humiliated",
      "Bitter",
      "Mad",
      "Aggressive",
      "Frustrated",
      "Distant",
      "Critical"
    ],
    level2: [
      "Provoked",
      "Hostile",
      "Infuriated",
      "Annoyed",
      "Withdrawn",
      "Numb",
      "Furious",
      "Jealous"
    ]
  },
  {
    level0: "Fearful",
    level1: [
      "Scared",
      "Anxious",
      "Insecure",
      "Weak",
      "Rejected",
      "Threatened",
      "Helpless",
      "Frightened"
    ],
    level2: [
      "Overwhelmed",
      "Worried",
      "Inadequate",
      "Insignificant",
      "Excluded",
      "Nervous",
      "Persecuted",
      "Exposed"
    ]
  },
  {
    level0: "Bad",
    level1: [
      "Bored",
      "Busy",
      "Stressed",
      "Tired",
      "Confused",
      "Sleepy",
      "Unfocused"
    ],
    level2: [
      "Stunned",
      "Shaken",
      "Stupefied",
      "Awed",
      "Astonished",
      "Perplexed",
      "Dismayed",
      "Disillusioned",
      "Shocked"
    ]
  },
  {
    level0: "Surprised",
    level1: [
      "Startled",
      "Confused",
      "Amazed",
      "Excited"
    ],
    level2: [
      "Stunned",
      "Shaken",
      "Stupefied",
      "Awed",
      "Astonished",
      "Perplexed",
      "Disillusioned",
      "Dismayed",
      "Shocked"
    ]
  }
];
