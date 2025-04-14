"use client"

import { format } from "date-fns"
import { userStats } from "@/mockedData/userStats"
import { AppShell } from "@/components/layout/app-shell"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dumbbell, Calendar, BarChart3 } from "lucide-react"

export function ProfilePage() {
  const joinDate = new Date(userStats.joinDate)
  const lastWorkoutDate = new Date(userStats.lastWorkoutDate)

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
                    <span className="text-xl font-bold">{userStats.totalWorkouts}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
                    <BarChart3 className="h-5 w-5 text-orange-500" />
                    <span className="text-xs text-muted-foreground">Total Volume</span>
                    <span className="text-xl font-bold">{userStats.totalVolume.toLocaleString()} lbs</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    <span className="text-xs text-muted-foreground">Current Streak</span>
                    <span className="text-xl font-bold">{userStats.streak} days</span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-medium">Personal Bests</h3>
                  <div className="space-y-2">
                    {Object.entries(userStats.personalBests).map(([exerciseId, weight]) => {
                      const exerciseName =
                        exerciseId === "ex1"
                          ? "Bench Press"
                          : exerciseId === "ex3"
                            ? "Squats"
                            : exerciseId === "ex7"
                              ? "Deadlift"
                              : "Unknown"
                      return (
                        <div key={exerciseId} className="flex items-center justify-between rounded-md border px-3 py-2">
                          <span>{exerciseName}</span>
                          <span className="font-medium">{weight} lbs</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-medium">Recent Activity</h3>
                  <div className="rounded-md border px-3 py-2">
                    <p className="text-sm">Last workout: {format(lastWorkoutDate, "MMMM d, yyyy")}</p>
                    <p className="text-sm text-muted-foreground">Pull Day</p>
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
