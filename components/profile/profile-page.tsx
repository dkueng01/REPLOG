"use client"

import { format, subDays, isAfter, isSameDay } from "date-fns"
import { userStats } from "@/mockedData/userStats"
import { workouts } from "@/mockedData/workouts"
import { exercises } from "@/mockedData/exercises"
import { AppShell } from "@/components/layout/app-shell"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dumbbell, Calendar, BarChart3 } from "lucide-react"

export function ProfilePage() {
  const joinDate = new Date(userStats.joinDate)

  // Calculate statistics from workout data
  const calculateStats = () => {
    // Sort workouts by date (newest first)
    const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Last workout date
    const lastWorkoutDate = sortedWorkouts.length > 0 ? new Date(sortedWorkouts[0].date) : new Date()

    // Total workouts
    const totalWorkouts = workouts.length

    // Total sets
    const totalSets = workouts.reduce((total, workout) => {
      return (
        total +
        workout.exercises.reduce((exerciseTotal, exercise) => {
          return exerciseTotal + exercise.sets.length
        }, 0)
      )
    }, 0)

    // Total volume (weight × reps)
    const totalVolume = workouts.reduce((total, workout) => {
      return (
        total +
        workout.exercises.reduce((exerciseTotal, exercise) => {
          return (
            exerciseTotal +
            exercise.sets.reduce((setTotal, set) => {
              return setTotal + set.weight * set.reps
            }, 0)
          )
        }, 0)
      )
    }, 0)

    // Workouts this week (last 7 days)
    const oneWeekAgo = subDays(new Date(), 7)
    const workoutsThisWeek = workouts.filter((workout) => isAfter(new Date(workout.date), oneWeekAgo)).length

    // Calculate streak (consecutive days with workouts)
    const calculateStreak = () => {
      if (sortedWorkouts.length === 0) return 0

      // Get unique workout dates and sort them (newest first)
      const workoutDates = [...new Set(sortedWorkouts.map((w) => format(new Date(w.date), "yyyy-MM-dd")))]
        .map((dateStr) => new Date(dateStr))
        .sort((a, b) => b.getTime() - a.getTime())

      // If no workout today, streak is 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (
        !workoutDates.some((date) => isSameDay(date, today)) &&
        !workoutDates.some((date) => isSameDay(date, subDays(today, 1)))
      ) {
        return 0
      }

      let streak = 1
      let currentDate = workoutDates[0]

      for (let i = 1; i < workoutDates.length; i++) {
        const expectedPrevDate = subDays(currentDate, 1)
        if (isSameDay(expectedPrevDate, workoutDates[i])) {
          streak++
          currentDate = workoutDates[i]
        } else {
          break
        }
      }

      return streak
    }

    const streak = calculateStreak()

    // Find favorite exercise (most frequently performed)
    const exerciseFrequency = {}
    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exerciseFrequency[exercise.exerciseId] = (exerciseFrequency[exercise.exerciseId] || 0) + 1
      })
    })

    let favoriteExerciseId = null
    let maxFrequency = 0

    Object.entries(exerciseFrequency).forEach(([exerciseId, frequency]) => {
      if (frequency > maxFrequency) {
        favoriteExerciseId = exerciseId
        maxFrequency = frequency
      }
    })

    const favoriteExercise = favoriteExerciseId
      ? exercises.find((ex) => ex.id === favoriteExerciseId)?.name || "Unknown"
      : "None"

    // Calculate personal bests (max weight for each exercise)
    const personalBests = {}

    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const maxWeightSet = exercise.sets.reduce((max, set) => (set.weight > max ? set.weight : max), 0)

        if (!personalBests[exercise.exerciseId] || maxWeightSet > personalBests[exercise.exerciseId]) {
          personalBests[exercise.exerciseId] = maxWeightSet
        }
      })
    })

    // Get last workout plan name
    const lastWorkoutPlanId = sortedWorkouts.length > 0 ? sortedWorkouts[0].planId : null
    const lastWorkoutPlanName =
      lastWorkoutPlanId === "plan1"
        ? "Push Day"
        : lastWorkoutPlanId === "plan2"
          ? "Pull Day"
          : lastWorkoutPlanId === "plan3"
            ? "Leg Day"
            : "Unknown"

    return {
      totalWorkouts,
      totalSets,
      totalVolume,
      workoutsThisWeek,
      lastWorkoutDate,
      streak,
      favoriteExercise,
      personalBests,
      lastWorkoutPlanName,
    }
  }

  const stats = calculateStats()

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt={userStats.username} />
              <AvatarFallback>{userStats.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center sm:items-start">
              <h1 className="text-2xl font-bold tracking-tight">{userStats.username}</h1>
              <p className="text-muted-foreground">Member since {format(joinDate, "MMMM yyyy")}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Workout Summary</CardTitle>
                <CardDescription>Your workout statistics and achievements</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
                    <Dumbbell className="h-5 w-5 text-orange-500" />
                    <span className="text-xs text-muted-foreground">Total Workouts</span>
                    <span className="text-xl font-bold">{stats.totalWorkouts}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
                    <BarChart3 className="h-5 w-5 text-orange-500" />
                    <span className="text-xs text-muted-foreground">Total Volume</span>
                    <span className="text-xl font-bold">{stats.totalVolume.toLocaleString()} kg</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    <span className="text-xs text-muted-foreground">Current Streak</span>
                    <span className="text-xl font-bold">{stats.streak} days</span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-medium">Personal Bests</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.personalBests).map(([exerciseId, weight]) => {
                      const exerciseName = exercises.find((ex) => ex.id === exerciseId)?.name || "Unknown"
                      return (
                        <div key={exerciseId} className="flex items-center justify-between rounded-md border px-3 py-2">
                          <span>{exerciseName}</span>
                          <span className="font-medium">{weight} kg</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-medium">Recent Activity</h3>
                  <div className="rounded-md border px-3 py-2">
                    <p className="text-sm">Last workout: {format(stats.lastWorkoutDate, "MMMM d, yyyy")}</p>
                    <p className="text-sm text-muted-foreground">{stats.lastWorkoutPlanName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-6 text-muted-foreground">
                Settings will be available in a future update.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
