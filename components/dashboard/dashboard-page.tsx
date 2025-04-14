"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Dumbbell, ListChecks, Play, User } from "lucide-react"
import { userStats } from "@/mockedData/userStats"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardPage() {
  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  })

  const lastWorkoutDate = new Date(userStats.lastWorkoutDate)

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, {userStats.username}
          </h1>
          <p className="text-muted-foreground">Last workout: {format(lastWorkoutDate, "MMMM d, yyyy")}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Workouts this week</span>
                  <span className="text-2xl font-bold">{userStats.workoutsThisWeek}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Current streak</span>
                  <span className="text-2xl font-bold">{userStats.streak} days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/active-workout" className="col-span-2">
            <Button className="w-full h-auto py-6 bg-orange-500 hover:bg-orange-600">
              <Play className="mr-2 h-5 w-5" />
              Start Workout
            </Button>
          </Link>

          <Link href="/workout-plans" className="col-span-1">
            <Card className="h-full hover:bg-muted/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <ListChecks className="mb-2 h-8 w-8 text-orange-500" />
                <CardTitle className="text-center text-sm">Workout Plans</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link href="/exercises" className="col-span-1">
            <Card className="h-full hover:bg-muted/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Dumbbell className="mb-2 h-8 w-8 text-orange-500" />
                <CardTitle className="text-center text-sm">Exercises</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile" className="col-span-2">
            <Card className="h-full hover:bg-muted/50 transition-colors">
              <CardContent className="flex items-center p-6">
                <User className="mr-4 h-8 w-8 text-orange-500" />
                <div>
                  <CardTitle className="text-sm">Profile</CardTitle>
                  <CardDescription>View your stats and settings</CardDescription>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
