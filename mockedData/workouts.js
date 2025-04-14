export const workouts = [
  {
    id: "workout1",
    date: "2025-04-10T10:30:00Z",
    planId: "plan1", // Push Day
    completed: true,
    exercises: [
      {
        exerciseId: "ex1", // Bench Press
        sets: [
          { weight: 135, reps: 12 },
          { weight: 155, reps: 10 },
          { weight: 175, reps: 8 },
          { weight: 185, reps: 6 },
        ],
      },
      {
        exerciseId: "ex4", // Shoulder Press
        sets: [
          { weight: 40, reps: 12 },
          { weight: 45, reps: 10 },
          { weight: 50, reps: 8 },
        ],
      },
      {
        exerciseId: "ex6", // Tricep Extensions
        sets: [
          { weight: 30, reps: 15 },
          { weight: 35, reps: 12 },
          { weight: 40, reps: 10 },
        ],
      },
    ],
  },
  {
    id: "workout2",
    date: "2025-04-12T11:00:00Z",
    planId: "plan2", // Pull Day
    completed: true,
    exercises: [
      {
        exerciseId: "ex2", // Pull-ups
        sets: [
          { weight: 0, reps: 10 },
          { weight: 0, reps: 8 },
          { weight: 0, reps: 7 },
        ],
      },
      {
        exerciseId: "ex7", // Deadlift
        sets: [
          { weight: 225, reps: 8 },
          { weight: 245, reps: 6 },
          { weight: 275, reps: 5 },
        ],
      },
      {
        exerciseId: "ex5", // Bicep Curls
        sets: [
          { weight: 25, reps: 12 },
          { weight: 30, reps: 10 },
          { weight: 30, reps: 8 },
        ],
      },
    ],
  },
]
