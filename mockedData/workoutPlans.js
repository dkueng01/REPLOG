export const workoutPlans = [
  {
    id: "plan1",
    name: "Push Day",
    exercises: [
      {
        exerciseId: "ex1", // Bench Press
        sets: 4,
        repRange: "8-12",
        earlyRPE: 7,
        lastRPE: 9,
        alternativeExerciseIds: ["ex4", "ex6"], // Shoulder Press, Tricep Extensions
        restTime: 120, // Rest time in seconds
        warmupSets: 2, // Number of warmup sets
      },
      {
        exerciseId: "ex4", // Shoulder Press
        sets: 3,
        repRange: "8-12",
        earlyRPE: 7,
        lastRPE: 8,
        alternativeExerciseIds: ["ex1", "ex6"], // Bench Press, Tricep Extensions
        restTime: 90,
        warmupSets: 1,
      },
      {
        exerciseId: "ex6", // Tricep Extensions
        sets: 3,
        repRange: "10-15",
        earlyRPE: 6,
        lastRPE: 8,
        alternativeExerciseIds: ["ex1", "ex4"], // Bench Press, Shoulder Press
        restTime: 60,
        warmupSets: 1,
      },
    ],
  },
  {
    id: "plan2",
    name: "Pull Day",
    exercises: [
      {
        exerciseId: "ex2", // Pull-ups
        sets: 3,
        repRange: "8-12",
        earlyRPE: 7,
        lastRPE: 9,
        alternativeExerciseIds: ["ex7", "ex5"], // Deadlift, Bicep Curls
        restTime: 120,
        warmupSets: 1,
      },
      {
        exerciseId: "ex7", // Deadlift
        sets: 3,
        repRange: "6-8",
        earlyRPE: 8,
        lastRPE: 9,
        alternativeExerciseIds: ["ex2", "ex5"], // Pull-ups, Bicep Curls
        restTime: 180,
        warmupSets: 3,
      },
      {
        exerciseId: "ex5", // Bicep Curls
        sets: 3,
        repRange: "10-15",
        earlyRPE: 6,
        lastRPE: 8,
        alternativeExerciseIds: ["ex2", "ex7"], // Pull-ups, Deadlift
        restTime: 60,
        warmupSets: 1,
      },
    ],
  },
  {
    id: "plan3",
    name: "Leg Day",
    exercises: [
      {
        exerciseId: "ex3", // Squats
        sets: 4,
        repRange: "8-12",
        earlyRPE: 7,
        lastRPE: 9,
        alternativeExerciseIds: ["ex8", "ex7"], // Leg Press, Deadlift
        restTime: 180,
        warmupSets: 3,
      },
      {
        exerciseId: "ex8", // Leg Press
        sets: 3,
        repRange: "10-12",
        earlyRPE: 7,
        lastRPE: 8,
        alternativeExerciseIds: ["ex3", "ex7"], // Squats, Deadlift
        restTime: 120,
        warmupSets: 2,
      },
    ],
  },
]
